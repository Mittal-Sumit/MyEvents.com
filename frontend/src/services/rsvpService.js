import axios from 'axios';
import { toast } from 'react-toastify';

// Create a new Axios instance just for RSVP purposes
const rsvpAxios = axios.create({
    baseURL: 'http://localhost:8000/api/rsvp/',
});

// Add the Authorization header manually for each request
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// RSVP register function
export const registerForEvent = async (eventId) => {
    try {
        const response = await rsvpAxios.post(
            'register/', 
            { event: eventId },  // Note: 'event' is passed, not 'event_id'
            { headers: getAuthHeaders() }
        );
        toast.success('Successfully registered for the event!');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            toast.error('Unauthorized. Please log in.');
        } else {
            toast.error('Failed to register for the event. Please try again.');
        }
        console.error('Register error:', error);
        return null;
    }
};

// Update RSVP status function
export const updateRSVPStatus = async (eventId, status) => {
    try {
        const response = await rsvpAxios.post(
            'rsvps/', 
            { event: eventId, status: status },  // Note: 'event' is passed, not 'event_id'
            { headers: getAuthHeaders() }
        );
        toast.success('RSVP updated successfully!');
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            toast.error('Unauthorized. Please log in.');
        } else {
            toast.error('Failed to update RSVP. Please try again.');
        }
        console.error('RSVP update error:', error.response ? error.response.data : error);
        return null;
    }
};

// Get registered events for the user
export const getRegisteredEvents = async () => {
    try {
        const response = await rsvpAxios.get(
            'registered-events/', 
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        toast.error('Failed to fetch registered events.');
        console.error('Fetch registered events error:', error);
        return [];
    }
};
