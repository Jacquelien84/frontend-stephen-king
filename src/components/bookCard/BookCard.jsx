import './BookCard.css'
import React from 'react';

const BookCard = ({ book, onClick }) => {

    return (
        <div key={book.id} className="book-card" onClick={() => onClick(book.id)}>
            <img
                src={`http://localhost:8080/books/${book.id}/bookcovers`}
                alt={book.title}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                    console.log("Error loading image");
                }}
            />
        </div>
    );
};

export default BookCard;
