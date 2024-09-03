// src/components/EventManagement.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './EventManagement.css';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [editEventId, setEditEventId] = useState(null);
    const [expandedEventId, setExpandedEventId] = useState(null); // Track which event details to show

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axiosInstance.get('/events/');
            setEvents(response.data);
        } catch (error) {
            toast.error('Error fetching events');
        }
    };

    const handleCreateOrUpdateEvent = async (e) => {
        e.preventDefault();
        const eventData = { title, description, date, location };
        try {
            if (editEventId) {
                // Update existing event
                await axiosInstance.put(`/events/${editEventId}/`, eventData);
                toast.success('Event updated successfully!');
                setEditEventId(null); // Reset edit mode
            } else {
                // Create new event
                await axiosInstance.post('/events/', eventData);
                toast.success('Event created successfully!');
            }
            fetchEvents(); // Refresh the list of events
            clearForm();
        } catch (error) {
            toast.error('Error creating/updating event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axiosInstance.delete(`/events/${eventId}/`);
            toast.success('Event deleted successfully!');
            fetchEvents(); // Refresh the list of events
        } catch (error) {
            toast.error('Error deleting event');
        }
    };

    const handleEditEvent = (event) => {
        setTitle(event.title);
        setDescription(event.description);
        setDate(event.date);
        setLocation(event.location);
        setEditEventId(event.id);
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        setEditEventId(null);
    };

    const toggleEventDetails = (eventId) => {
        setExpandedEventId(expandedEventId === eventId ? null : eventId); // Toggle event details view
    };

    return (
        <div className="event-management-container">
            <button className="back-to-admin-button" onClick={() => navigate('/admin-dashboard')}>
                Back to Admin Dashboard
            </button>

            <h2>{editEventId ? 'Edit Event' : 'Create Event'}</h2>
            <form className="event-form" onSubmit={handleCreateOrUpdateEvent}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <button type="submit">{editEventId ? 'Update Event' : 'Create Event'}</button>
            </form>

            <h3>Existing Events</h3>
            <ul className="event-list">
                {events.map(event => (
                    <li key={event.id}>
                        <span className="event-title" onClick={() => toggleEventDetails(event.id)}>
                            {event.title}
                        </span>
                        {expandedEventId === event.id && (
                            <div className="event-details">
                                <p>Description: {event.description}</p>
                                <p>Date: {new Date(event.date).toLocaleString()}</p>
                                <p>Location: {event.location}</p>
                                <div>
                                    <button onClick={() => handleEditEvent(event)}>Edit</button>
                                    <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventManagement;
