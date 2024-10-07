import "./Favourites.css";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import BookCard from "../../components/bookCard/BookCard.jsx";
import { Link, NavLink } from "react-router-dom";

function Favourites() {
    const { loggedIn, user, favourites } = useContext(AuthContext); // Haal de favorieten op uit de context

    return (
        <section className="outer-content-container">
            <div className="inner-content-container">
                {!loggedIn || !user ? (
                    <>
                        <h4>Login om boeken toe te kunnen voegen aan je favorieten</h4>
                        <Link to="/login">
                            <h3>Log in</h3>
                        </Link>
                    </>
                ) : favourites.length === 0 ? ( // Als er geen favorieten zijn
                    <div className="no-faves">
                        <p>Er staan nog geen boeken in je favorieten.</p>
                        <NavLink to="/book">Ga naar de boeken</NavLink>
                    </div>
                ) : ( // Als er favorieten zijn
                    <div className="favourites">
                        Hallo {user.username}. Deze boeken heb je toegevoegd aan je favorieten:
                        <ul>
                            {favourites.map((book) => (
                                <li key={book.id}>
                                    <BookCard
                                        id={book.id}
                                        title={book.title}
                                        author={book.author}
                                        originalTitle={book.originalTitle}
                                        released={book.released}
                                        movieAdaptation={book.movieAdaptation}
                                        description={book.description}
                                        bookcover={book.bookcover}
                                        faved="true"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Favourites;

