import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const BookContext = createContext({});

function BookContextProvider({ children }) {
    const [bookData, setBookData] = useState({
        books: [],
        status: "pending",
    });

    useEffect(() => {
        if (bookData.books.length === 0) {
            fetchBookData();
        }
    }, []); // Lege dependency array zodat de fetch één keer wordt uitgevoerd

    async function fetchBookData() {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found, unable to fetch books.");
            setBookData({
                books: [],
                status: "error",
            });
            return;
        }

        try {
            const { data } = await axios.get("http://localhost:8080/books", {
                headers: {
                    Authorization: `Bearer ${token}`,  // Headers toegevoegd op de juiste plek
                },
            });

            setBookData({
                books: data,
                status: "done",
            });
        } catch (e) {
            console.error("Error fetching books:", e);  // Foutmelding loggen
            setBookData((prevState) => ({
                ...prevState,
                status: "error",  // Status op 'error' zetten indien er iets misgaat
            }));
        }
    }

    const contextData = {
        bookData: bookData,
    };

    return (
        <BookContext.Provider value={contextData}>
            {bookData.status === "done" && children}
            {bookData.status === "pending" && <p>Loading...</p>}
            {bookData.status === "error" && <p>Failed to load books.</p>} {/* Foutmelding weergeven */}
        </BookContext.Provider>
    );
}

export default BookContextProvider;


