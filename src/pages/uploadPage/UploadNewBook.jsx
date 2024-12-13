import './UploadNewBook.css';
import React, { useState, useEffect } from 'react';
import api from "../../services/api.js";
import { useNavigate } from 'react-router-dom';
import InputElement from '../../components/input/Input.jsx';
import Button from '../../components/button/Button.jsx';

function UploadNewBook() {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [released, setReleased] = useState('');
    const [movieAdaptation, setMovieAdaptation] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrlPhoto, setPreviewUrlPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Authorized');
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (previewUrlPhoto) {
                URL.revokeObjectURL(previewUrlPhoto);
            }
        };
    }, [previewUrlPhoto]);

    function handleImageChange(e) {
        const uploadedImage = e.target.files[0];
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
            console.error("Je moet ingelogd zijn om een boek toe te voegen.");
            setStatus('Login');
            setLoading(false);
            return;
        }

        try {
            const bookResponse = await api.post('/books', {
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

            const addedBookId = bookResponse.data.id;

            if (image && addedBookId) {
                const formData = new FormData();
                formData.append("file", image);

                try {
                    const uploadResponse = await api.post(`/books/${addedBookId}/bookcovers`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    console.error("Boekomslag succesvol geüpload", uploadResponse.data);
                } catch (uploadError) {
                    console.error("Fout bij het uploaden van de boekomslag", uploadError);
                }
            }
            setStatus("Done");
        } catch (error) {
            console.error("Fout bij het toevoegen van het boek:", error);
            setStatus("Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container-row">
            {status === "Done" && <h3>Boek en omslag succesvol toegevoegd!</h3>}

            {status === "Login" && (
                <div className="error">
                    <h4>Je moet ingelogd zijn om boeken toe te voegen.</h4>
                    <button onClick={() => navigate('/login')}>Log in</button>
                </div>
            )}

            {status === "NotAdmin" && (
                <div className="error">
                    <h4>Je moet een admin zijn om boeken toe te voegen.</h4>
                </div>
            )}

            {(!loading && status === "Authorized") && (
                <div className="container-column">
                    <h3>Nieuw Boek Toevoegen</h3>
                    <form onSubmit={addBook}>
                        <div className="input-container">

                            <InputElement
                                name="book-id-field"
                                label="Id:"
                                id="book-id"
                                cols="30"
                                rows="1"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />

                            <InputElement
                                name="title-field"
                                label="Title:"
                                id="title"
                                cols="30"
                                rows="1"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <InputElement
                                name="author-field"
                                label="Author:"
                                id="author"
                                cols="30"
                                rows="1"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />

                            <InputElement
                                name="original-title-field"
                                label="Original Title:"
                                id="original-title"
                                cols="30"
                                rows="1"
                                value={originalTitle}
                                onChange={(e) => setOriginalTitle(e.target.value)}
                            />

                            <InputElement
                                name="released-field"
                                label="Released:"
                                id="released"
                                cols="30"
                                rows="1"
                                value={released}
                                onChange={(e) => setReleased(e.target.value)}
                            />

                            <InputElement
                                name="movie-adaptation-field"
                                label="Movie Adaptation:"
                                id="movieAdaptation"
                                cols="30"
                                rows="1"
                                value={movieAdaptation}
                                onChange={(e) => setMovieAdaptation(e.target.value)}
                            />

                            <InputElement
                                name="description-field"
                                label="Beschrijving:"
                                id="description"
                                cols="30"
                                rows="10"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

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

                            <Button
                                size="small"
                                text={"Add Book"}
                                type="submit"
                            />
                        </div>
                    </form>
                </div>
            )}

            {loading && <p>Loading...</p>}
        </main>
    );
}

export default UploadNewBook;
