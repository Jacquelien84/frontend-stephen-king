import './StarRating.css';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

function StarRating({ id }) { // Voeg een 'id' prop toe
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    // Creëer een unieke sleutel voor localStorage gebaseerd op het id
    const localStorageKey = `rating-${id}`;

    // Bij het laden van de component, haal de opgeslagen waarde op uit localStorage
    useEffect(() => {
        const savedRating = localStorage.getItem(localStorageKey);
        if (savedRating) {
            setRating(parseInt(savedRating));
        }
    }, [localStorageKey]); // Het effect herlaadt als de id verandert

    // Wanneer de rating verandert, sla het op in localStorage
    const handleRatingClick = (ratingValue) => {
        setRating(ratingValue);
        localStorage.setItem(localStorageKey, ratingValue); // Sla de rating op per id in localStorage
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={ratingValue}>
                        <input
                            type="radio"
                            name={`rating-${id}`} // Zorg ervoor dat de naam uniek is per id
                            value={ratingValue}
                            onClick={() => handleRatingClick(ratingValue)}
                            style={{ display: 'none' }} // Verbergt de radio buttons
                        />
                        <FaStar
                            className="star"
                            color={ratingValue <= (hover || rating) ? "#8B0000" : "#e4e5e9"}
                            size={25}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default StarRating;
