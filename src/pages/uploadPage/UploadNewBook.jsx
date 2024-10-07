import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadNewBook() {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [released, setReleased] = useState('');
    const [movieAdaptation, setMovieAdaptation] = useState('');
    const [description, setDescription] = useState('');

    // For book cover upload
    const [image, setImage] = useState(null);
    const [previewUrlPhoto, setPreviewUrlPhoto] = useState('');

    // For navigation and loading
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Authorized');  // Default status
    const navigate = useNavigate();  // Navigation hooks

    useEffect(() => {
        return () => {
            // Cleanup van de URL om geheugenlekken te voorkomen
            if (previewUrlPhoto) {
                URL.revokeObjectURL(previewUrlPhoto);
            }
        };
    }, [previewUrlPhoto]);

    // Handle book cover image change
    function handleImageChange(e) {
        const uploadedImage = e.target.files[0];

        // Controleer of er een bestand is geselecteerd en of dit een afbeelding is
        if (uploadedImage && uploadedImage.type.startsWith('image/')) {
            setImage(uploadedImage);
            setPreviewUrlPhoto(URL.createObjectURL(uploadedImage));
        } else {
            console.error("Het geselecteerde bestand is geen geldige afbeelding.");
        }
    }

    async function addBook(e) {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error("You must be logged in to add a book.");
            setStatus('Login');
            setLoading(false);
            return;
        }

        // Step 1: Submit book data first
        try {
            const bookResponse = await axios.post('http://localhost:8080/books', {
                id,
                title,
                author,
                originalTitle,
                released,
                movieAdaptation,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log("Book added successfully", bookResponse.data);
            const addedBookId = bookResponse.data.id;

            // Step 2: If book is added successfully, upload the cover
            if (image && addedBookId) {
                const formData = new FormData();
                formData.append("file", image);

                try {
                    const uploadResponse = await axios.post(`http://localhost:8080/books/${addedBookId}/bookcovers`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    console.log("Book cover uploaded successfully", uploadResponse.data);
                } catch (uploadError) {
                    console.error("Error uploading book cover", uploadError);
                }
            }

            setStatus("Done");
        } catch (error) {
            console.log("Error adding book:", error);
            setStatus("Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-row">
            {status === "Done" && <h3>Book and cover added successfully!</h3>}

            {status === "Login" && (
                <div className="error">
                    <h4>You have to be logged in to upload books.</h4>
                    <button onClick={() => navigate('/login')}>Log in</button>
                </div>
            )}

            {status === "NotAdmin" && (
                <div className="error">
                    <h4>You have to be an admin to upload books.</h4>
                </div>
            )}

            {(!loading && status === "Authorized") && (
                <div className="container-column">
                    <h3>Add New Book</h3>
                    <form onSubmit={addBook}>
                        <div className="input-container">

                            <label htmlFor="book-id">
                                Id:
                                <input
                                    type="text"
                                    name="book-id-field"
                                    id="book-id"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </label>

                            <label htmlFor="title">
                                Title:
                                <input
                                    type="text"
                                    name="title-field"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>

                            <label htmlFor="author">
                                Author:
                                <input
                                    type="text"
                                    name="author-field"
                                    id="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </label>

                            <label htmlFor="original-title">
                                Original Title:
                                <input
                                    type="text"
                                    name="original-title-field"
                                    id="original-title"
                                    value={originalTitle}
                                    onChange={(e) => setOriginalTitle(e.target.value)}
                                />
                            </label>

                            <label htmlFor="released">
                                Released:
                                <input
                                    type="text"
                                    name="released-field"
                                    id="released"
                                    value={released}
                                    onChange={(e) => setReleased(e.target.value)}
                                />
                            </label>

                            <label htmlFor="movie-adaptation">
                                Movie Adaptation:
                                <input
                                    type="text"
                                    name="movie-adaptation-field"
                                    id="movieAdaptation"
                                    value={movieAdaptation}
                                    onChange={(e) => setMovieAdaptation(e.target.value)}
                                />
                            </label>

                            <label htmlFor="description">
                                Description:
                                <input
                                    type="text"
                                    name="description-field"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>

                            <label htmlFor="bookcover">
                                Book Cover:
                                <input
                                    type="file"
                                    name="bookcover"
                                    id="bookcover"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {previewUrlPhoto && (
                                <label>
                                    Cover Preview:
                                    <img
                                        src={previewUrlPhoto}
                                        alt="Cover preview"
                                        className="image-preview"
                                    />
                                </label>
                            )}

                            <button type="submit">Add Book</button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <p>Loading...</p>}
        </div>
    );
}

export default UploadNewBook;
