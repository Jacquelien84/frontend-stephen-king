import "./BookDetails.css";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import { IoHeart } from "react-icons/io5";
import StarRating from "../../components/starRating/StarRating.jsx";
import Button from "../../components/button/Button.jsx";
import {updateLocalStorageList} from "../../helpers/FavoriteAndReadOption.js";

function BookDetails() {
    const { loggedIn } = useContext(AuthContext);
    const { id } = useParams();
    const [books, setBooks] = useState([]);
    const { user } = useContext(AuthContext);
    const [localBook, setLocalBook] = useState(null);
    const [warning, setWarning] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [isRead, setIsRead] = useState(false);
    const [favoritesList, setFavoritesList] = useState([]);
    const [readList, setReadList] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, [id]);

    async function fetchBooks() {
        try {
            const response = await api.get('/books');
            setBooks(response.data);

            const foundBook = response.data.find((book) => book.id === parseInt(id));
            if (foundBook) {
                setLocalBook(foundBook);
            } else {
                setWarning("Boek niet gevonden.");
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function deleteBook(id) {
        try {
            await api.delete(`/books/${id}`);
            window.alert("Boek is verwijderd");
            fetchBooks();
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        const savedFavorite = JSON.parse(localStorage.getItem(`favorite_${id}`)) || false;
        const savedRead = JSON.parse(localStorage.getItem(`read_${id}`)) || false;
        const savedFavoritesList = JSON.parse(localStorage.getItem("favoritesList")) || [];
        const savedReadList = JSON.parse(localStorage.getItem("readList")) || [];

        setIsFavorite(savedFavorite);
        setIsRead(savedRead);
        setFavoritesList(savedFavoritesList);
        setReadList(savedReadList);
    }, [id]);

    const toggleFavorite = () => {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);

        const updatedFavoritesList = updateLocalStorageList(id, "favoritesList", newFavoriteStatus);
        setFavoritesList(updatedFavoritesList);

        localStorage.setItem(`favorite_${id}`, JSON.stringify(newFavoriteStatus));
    };

    const toggleRead = () => {
        const newReadStatus = !isRead;
        setIsRead(newReadStatus);

        const updatedReadList = updateLocalStorageList(id, "readList", newReadStatus);
        setReadList(updatedReadList);

        localStorage.setItem(`read_${id}`, JSON.stringify(newReadStatus));
    };

    return (
        <>
            {localBook ? (
                <section className="inner-content-container">
                    <div className="img-book">
                        <img
                            src={`http://localhost:8080/books/${localBook.id}/bookcovers`}
                            alt={localBook.title}
                            onError={(e) => {
                                e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(localBook.title || 'No Image')}`;
                                console.log("Error loading image");
                            }}
                        />
                        <div className="text-book">
                            <h2>{localBook.title}
                            {isFavorite ? (
                                <IoHeart className="faved-icon" onClick={toggleFavorite} />
                            ) : (
                                <IoHeart className="fav-icon" onClick={toggleFavorite} />
                            )}
                            </h2>
                            <hr />
                            <p><strong>Schrijver:</strong> {localBook.author}</p>
                            <p><strong>Originele Titel:</strong> {localBook.originalTitle}</p>
                            <p><strong>Released:</strong> {localBook.released}</p>
                            <p><strong>Verfilmd:</strong> {localBook.movieAdaptation}</p>
                            <p><strong>Beschrijving:</strong> {localBook.description}</p>
                            {loggedIn && (
                                <>
                            <div className="rating-read-container">
                                <StarRating id={localBook.id} />
                                <Button
                                        type="button"
                                        className={`read ${isRead ? 'read-active' : ''}`}
                                        size="medium"
                                        text={isRead ? "Markeer als niet gelezen" : "Markeer als gelezen"}
                                        onClick={toggleRead}
                            /></div>
                                </>
                            )}

                            {user && user.role === "ADMIN" && (
                                <Button size="small" text="Verwijder" onClick={() => deleteBook(localBook.id)} />
                            )}

                        </div>
                    </div>
                </section>
            ) : (
                books.length > 0 && <p>{warning || "Boek niet gevonden"}</p>
            )}
        </>
    );
}

export default BookDetails;




