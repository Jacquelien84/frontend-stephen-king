import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { BookContext } from "../../context/BookContext.jsx";
import axios from "axios";
import { IoHeart } from "react-icons/io5";
import "./BookDetails.css";
import StarRating from "../../components/starRating/StarRating.jsx";

function BookDetails() {
    const { id } = useParams();
    const { bookData } = useContext(BookContext);
    const { loggedIn, user, fetchUserData } = useContext(AuthContext);
    const [localBook, setLocalBook] = useState(null);
    const [warning, setWarning] = useState("");
    const [faved, toggleFaved] = useState(false);
    const [status, setStatus] = useState("starting")

    useEffect(() => {
        // Check if bookData and books array exist before accessing them
        if (bookData && bookData.books.length > 0) {
            const foundBook = bookData.books.find((book) => book.id.toString() === id);

            if (foundBook) {
                setLocalBook(foundBook);

                // Check if the book is in the user's favourites
                if (user && foundBook.favourites && foundBook.favourites.some((fav) => fav.username === user.username)) {
                    toggleFaved(true);
                }
            } else {
                setLocalBook(null);
            }
        }
    }, [bookData, id, user]);

    async function AddToFavourites() {
        if (loggedIn) {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("user_username");

            if (!token || !username) {
                setWarning("Token or username not found.");
                return;
            }

            try {
                await axios.put(`http://localhost:8080/users/fav/${username}/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toggleFaved(true);
                fetchUserData(user.username, token);
            } catch (e) {
                console.error("Error adding to favourites:", e);
            }
        } else {
            setWarning("You have to be logged in to add books to your favourites.");
        }
    }


    async function RemoveFromFavourites() {
        if (loggedIn) {
            const username = localStorage.getItem("user_username"); // Store username for reuse

            try {
                await axios.delete(`http://localhost:8080/users/fav/${username}/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                toggleFaved(false);
                fetchUserData(user.username, localStorage.getItem("token"));
            } catch (e) {
                console.error("Error removing from favourites:", e);
            }
        }
    }

    if (status === "starting") {
        setStatus("loading");
        for (let i = 0; i < bookData.books.length; i++) {
            let externalId = bookData.books[i].id;

            if (externalId.toString() === id.toString()) {
                setLocalBook(bookData.books[i])
                for (let f = 0; f < bookData.books[i].favourites.length; f++) {
                    if (user && bookData.books[i].favourites[f].username === user.username) {
                        toggleFaved(true);
                    }
                }
            }
        }
        setStatus("done");
    }

    return (
        <>
            {localBook ? (
                <section className="inner-content-container">
                    <div className="img-book">
                        <img
                            src={`http://localhost:8080/books/${localBook.id}/bookcovers`}
                            alt={localBook.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150'; // Fallback afbeelding
                                console.log("Error loading image");
                            }}
                        />
                        <div className="text-book">
                            <h2>
                                {localBook.title}
                                {faved ? (
                                    <IoHeart className="faved-icon" onClick={RemoveFromFavourites}/>
                                ) : (
                                    <IoHeart className="fav-icon" onClick={AddToFavourites}/>
                                )}
                            </h2>
                            <hr/>
                            <p><strong>Schrijver:</strong> {localBook.author}</p>
                            <p><strong>Originele Title:</strong> {localBook.originalTitle}</p>
                            <p><strong>Released:</strong> {localBook.released}</p>
                            <p><strong>Verfilmd:</strong> {localBook.movieAdaptation}</p>
                            <p><strong>Beschrijving:</strong> {localBook.description}</p>
                            <StarRating id={localBook.id}/>
                        </div>
                    </div>
                </section>
            ) : (
                <p>Loading book details...</p>
            )}
            {(!localBook && bookData.books.length > 0) && <p>Book not found</p>}
            {warning && <p>{warning}</p>}
        </>
    );
}

export default BookDetails;

