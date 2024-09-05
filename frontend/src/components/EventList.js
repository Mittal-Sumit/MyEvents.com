import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { Button, Typography } from '@mui/material';
import EventListDataGrid from './Event/EventListDataGrid'; // Changed file name to EventListDataGrid
import { parseISO, isSameDay } from 'date-fns'; 
import './EventList.css';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [availableLocations, setAvailableLocations] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]); // Store registered event IDs

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        fetchRegisteredEvents();
    }, []);

    useEffect(() => {
        let filtered = events;

        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(event => {
                const eventDate = parseISO(event.date);
                return isSameDay(eventDate, new Date(dateFilter));
            });
        }

        if (locationFilter) {
            filtered = filtered.filter(event =>
                event.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        setFilteredEvents(filtered);
    }, [searchQuery, dateFilter, locationFilter, events]);

    const fetchEvents = async () => {
        try {
            const response = await axiosInstance.get('/events/');
            setEvents(response.data);

            const uniqueLocations = [...new Set(response.data.map(event => event.location))];
            setAvailableLocations(uniqueLocations);
        } catch (error) {
            toast.error('Error fetching events');
        }
    };

    const fetchRegisteredEvents = async () => {
        try {
            const response = await axiosInstance.get('/rsvp/registered-events/');
            setRegisteredEvents(response.data.map(event => event.id)); // Store registered event IDs
        } catch (error) {
            toast.error('Error fetching registered events');
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await axiosInstance.post('/rsvp/register/', { event_id: eventId });
            toast.success('Registered for event!');
            fetchRegisteredEvents(); // Refresh registered events after registration
        } catch (error) {
            toast.error('Failed to register, please try again.');
        }
    };

    const handleRSVP = async (eventId, status) => {
        try {
            await axiosInstance.post('/rsvp/rsvps/', {
                event_id: eventId,
                status: status
            });
            toast.success('RSVP updated successfully!');
        } catch (error) {
            toast.error('Failed to RSVP, please try again.');
        }
    };

    return (
        <div className="event-list-page">
            <div className="header-container">
                <Typography variant="h4" className="page-title">
                    Event List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    className="back-to-home-button"
                    onClick={() => navigate('/home')}
                >
                    Go Back to Home
                </Button>
            </div>

            <EventListDataGrid
                events={filteredEvents}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                availableLocations={availableLocations}
                registeredEvents={registeredEvents} // Pass the registered events list
                handleRegister={handleRegister} // Pass the register function
                handleRSVP={handleRSVP} // Pass the RSVP function
                showFilters={true}
            />
        </div>
    );
};

export default EventList;
