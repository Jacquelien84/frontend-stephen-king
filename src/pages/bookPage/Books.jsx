import './Books.css';
import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BookCard from '../../components/bookCard/BookCard.jsx';
import {BookContext} from "../../context/BookContext.jsx";  // Importeer het nieuwe component

function Books() {
    const {bookData} = useContext(BookContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            console.error('Error fetching book details:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Functie om boeken op te halen
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/books?sortBy=${sortBy}&sortOrder=${sortOrder}`);
            setBooks(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    // Functie om op boeknaam te zoeken
    const fetchBookByName = async (title) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/books/title/${title}`);
            setSearchResults([response.data]);
        } catch (error) {
            console.error('Error fetching book:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Navigeren naar boekdetails pagina
    const navigateToBook = (id) => {
        navigate(`/books/${id}`);
    }

    return (
        <div className="book-list-container">
            {/* Zoekbalk en sorteeropties */}
            <div className="search-sort-controls">
                <FaSearch id="search-icon"/>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button onClick={() => {
                    if (!searchValue.trim()) {
                        alert("Please enter a valid book title to search.");
                        return;
                    }
                    fetchBookByName(searchValue);
                }}>Search</button>
            </div>

            {/* Boekenlijst */}
            <div className="books-grid">
                {loading ? (
                    <div>Loading...</div>
                ) : searchResults.length > 0 ? (
                    searchResults.map((book) => (
                        <BookCard key={book.id} book={book} onClick={() => fetchBookDetails(book.id)}/>
                    ))
                ) : books.length > 0 ? (
                    books.map((book) => (
                        <BookCard key={book.id} book={book} onClick={() => fetchBookDetails(book.id)}/>
                    ))
                ) : (
                    <div>No books found.</div>
                )}
            </div>

            {/* Boekgegevens na klikken cover */}
            {selectedBook && (
                <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedBook.title}</h2>
                        <img
                            src={`http://localhost:8080/books/${selectedBook.id}/bookcovers`}
                            alt={selectedBook.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150'; // Fallback afbeelding
                                console.log("Error loading image");
                            }}
                        />
                        <p><strong>Beschrijving:</strong> {selectedBook.description}</p>
                        <button onClick={() => navigateToBook(selectedBook.id)}>Details</button>
                        <button onClick={() => setSelectedBook(null)}>Close</button>
                    </div>
                </div>
            )}

            {/* Foutmelding */}
            {error && <p className="error-message">Something went wrong: {error.message}</p>}
        </div>
    );
};

export default Books;


