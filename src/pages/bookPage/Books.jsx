import './Books.css';
import React, {useState, useEffect} from 'react';
import api from "../../services/api.js";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BookCard from '../../components/bookCard/BookCard.jsx';
import Button from "../../components/button/Button.jsx";


function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [sortBy, sortOrder]);

    const fetchBookDetails = async (bookId) => {
        setLoading(true);
        try {
            const response = await api.get(`/books/${bookId}`);
            setSelectedBook(response.data);
        } catch (error) {
            console.error('Error fetching book details:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/books?sortBy=${sortBy}&sortOrder=${sortOrder}`);
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

    const fetchBookByName = async (title) => {
        setLoading(true);
        try {
            const response = await api.get(`/books/title/${title}`);
            setSearchResults([response.data]);
        } catch (error) {
            console.error('Error fetching book:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToBook = (id) => {
        navigate(`/books/${id}`);
    }

    return (
        <div className="book-list-container">
            <div className="search-sort-controls">
                <FaSearch id="search-icon"/>
                <textarea
                    placeholder="Search..."
                    rows="1"
                    cols="30"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button size="small" text="Zoeken" onClick={() => {
                    if (!searchValue.trim()) {
                        alert("Please enter a valid book title to search.");
                        return;
                    }
                    fetchBookByName(searchValue);
                }}></Button>
            </div>

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
                    <div>Geen boeken gevonden.</div>
                )}
            </div>

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
                        <Button size="small" text="Details" onClick={() => navigateToBook(selectedBook.id)} />
                        <Button size="small" text="Sluit" onClick={() => setSelectedBook(null)} />
                    </div>
                </div>
            )}

            {error && <p className="error-message">Er ging iets mis: {error.message}</p>}
        </div>
    );
}

export default Books;


