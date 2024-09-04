import React from 'react';
import './EventCard.css'; // Create a separate CSS file for card styling

const EventCard = ({ title, date, location, imageUrl }) => {
    return (
        <div className="event-card">
            <img src={imageUrl} alt={title} className="event-card-image" />
            <div className="event-card-content">
                <h3>{title}</h3>
                <p>{date}</p>
                <p>{location}</p>
            </div>
        </div>
    );
};

export default EventCard;
