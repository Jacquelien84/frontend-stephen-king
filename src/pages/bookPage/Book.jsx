import './Book.css';
import React, { useState, useEffect } from 'react';
import axios from "axios";

const Book = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedBook, setSelectedBook] = useState(null);
    const [imageData, setImageData] = useState('');
    const [error, setError] = useState(null);

    // Haal boeken op bij het laden van de component
    useEffect(() => {
        fetchBooks();
    }, [sortBy, sortOrder]);

    // Functie om een specifiek boek op te halen en weer te geven in de modal
    const fetchBookDetails = async (bookId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/books/${bookId}`);
            setSelectedBook(response.data);
        } catch (error) {
            console.error("Error fetching book details:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Functie om afbeeldingen op te halen
    async function fetchBookcover(id) {
        setError(null);
        try {
            setLoadingImage(true);
            const download = await axios.get(`http://localhost:8080/books/${books.id}/bookcovers`, {
                responseType: 'arraybuffer'
            });
            console.log("download", download);
            const blob = new Blob([download.data], { type: 'image/jpg' });
            const dataUrl = URL.createObjectURL(blob);
            setImageData(dataUrl);
        } catch (e) {
            setError(e);
        } finally {
            setLoadingImage(false);
        }
    }

    // Functie om boeken op te halen
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/books?sortBy=${sortBy}&sortOrder=${sortOrder}`);
            setBooks(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError(error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Functie om op boeknaam te zoeken
    const fetchBookByName = async (title) => {
        if (!title.trim()) {
            setError("Please enter a valid search term");
            return;
        }

        setLoading(true);
        setError(null); // Reset error state before making the request
        try {
            const response = await axios.get(`books/title=${books.title}`);
            setBooks(Array.isArray(response.data) ? response.data : []);

            if (response.data.length === 0) {
                setError("No books found for the search term");
            }
        } catch (error) {
            console.error("Error fetching books by name:", error);
            setError("An error occurred while fetching the books.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="book-list-container">
            {/* Zoekbalk en sorteeropties */}
            <div className="search-sort-controls">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button onClick={() => fetchBookByName(searchValue)}>Search</button>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="title">Alphabetically</option>
                    <option value="released">Publication Year</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <button onClick={fetchBooks}>Reset</button>
            </div>

            {/* Boekenlijst */}
            <div className="books-grid">
                {loading ? (
                    <div>Loading...</div>
                ) : books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="book-card" onClick={() => fetchBookDetails(book.id)}>
                            <h3>{book.title}</h3>
                            <img src={`http://localhost:8080/books/${book.id}/bookcovers`} alt={book.title} />
                        </div>
                    ))
                ) : (
                    <div>No books found.</div>
                )}
            </div>

            {/* Boekdetail Modal */}
            {selectedBook && (
                <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedBook.title}</h2>
                        <p><strong>Schrijver:</strong> {selectedBook.author}</p>
                        <p><strong>Originele Title:</strong> {selectedBook.originalTitle}</p>
                        <p><strong>Released:</strong> {selectedBook.released}</p>
                        <p><strong>Verfilmd:</strong> {selectedBook.movieAdaptation}</p>
                        <p><strong>Beschrijving:</strong> {selectedBook.description}</p>
                        <button onClick={() => setSelectedBook(null)}>Close</button>
                    </div>
                </div>
            )}

            <div className="download-container">
                {loadingImage ? <p>Loading image...</p> : imageData &&
                    <img className='image-container' src={imageData} alt="blob" />}
                {error && <p className="error-message">Something went wrong: {error.message}</p>}
            </div>
        </div>
    );
};

export default Book;

