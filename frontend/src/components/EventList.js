import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import { Button, Typography } from '@mui/material';
import EventDataGrid from './Event/EventDataGrid';
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

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
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

            <EventDataGrid
                events={filteredEvents}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                availableLocations={availableLocations}
                showFilters={true}
            />
        </div>
    );
};

export default EventList;
