import './Profile.css';
import {useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../components/button/Button.jsx";
import {FaUser} from "react-icons/fa";
import {Balloon} from "@phosphor-icons/react";

function Profile() {
    const { loggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [favoritesList, setFavoritesList] = useState([]);
    const [readList, setReadList] = useState([]);

    useEffect(() => {
        const savedFavoritesList = JSON.parse(localStorage.getItem("favoritesList")) || [];
        const savedReadList = JSON.parse(localStorage.getItem("readList")) || [];
        setFavoritesList(savedFavoritesList);
        setReadList(savedReadList);

        const handleStorageChange = () => {
            setFavoritesList(JSON.parse(localStorage.getItem("favoritesList")) || []);
            setReadList(JSON.parse(localStorage.getItem("readList")) || []);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const navigateToNewBook = () => {
        navigate('/uploadnewbook');
    };

    const goToBookDetails = (id) => {
        navigate(`/books/${id}`);
    };

    return (
        <main className="profile-content">
            <section className="container-row">
                {loggedIn && (
                    <h2>
                        {user.role === "USER" && <FaUser />}
                        {user.role === "ADMIN" && <Balloon />}
                        Welcome {user.username}!
                    </h2>
                )}

                <div className="profile-container-column">
                    {loggedIn && user.role === "ADMIN" && (
                        <div className="profile-buttons">
                            <Button type="button" size="medium" text="Upload nieuw boek" onClick={navigateToNewBook} />
                        </div>
                    )}
                </div>

                <div>
                    <h2>Favorites</h2>
                    <ul>
                        {favoritesList.length > 0 ? (
                            favoritesList.map((book) => (
                                <li key={book.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToBookDetails(book.id);
                                        }}
                                    >
                                        {book.id}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p>No favorite books added yet.</p>
                        )}
                    </ul>

                    <h2>Read Books</h2>
                    <ul>
                        {readList.length > 0 ? (
                            readList.map((book) => (
                                <li key={book.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToBookDetails(book.id);
                                        }}
                                    >
                                        {book.id}{book.title}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p>No books marked as read yet.</p>
                        )}
                    </ul>
                </div>
            </section>
        </main>
    );
}

export default Profile;


