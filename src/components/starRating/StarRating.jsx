import './StarRating.css';
import React, { useState, useEffect } from 'react';
import {Balloon} from "@phosphor-icons/react";

function StarRating({ id }) {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const localStorageKey = `rating-${id}`;

    useEffect(() => {
        const savedRating = localStorage.getItem(localStorageKey);
        if (savedRating) {
            setRating(parseInt(savedRating));
        }
    }, [localStorageKey]);

    const handleRatingClick = (ratingValue) => {
        setRating(ratingValue);
        localStorage.setItem(localStorageKey, ratingValue);
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={ratingValue}>
                        <input
                            type="radio"
                            name={`rating-${id}`}
                            value={ratingValue}
                            onClick={() => handleRatingClick(ratingValue)}
                            style={{ display: 'none' }}
                        />
                        <Balloon
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
