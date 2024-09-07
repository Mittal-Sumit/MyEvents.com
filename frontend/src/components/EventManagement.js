/* src/components/EventManagement.js */
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { Button, Typography, TextField } from "@mui/material";
import EventDataGrid from "./Event/EventDataGrid";
import "./EventManagement.css";
import { useNavigate } from "react-router-dom";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(
      events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (locationFilter === "" || event.location === locationFilter) &&
          (dateFilter === "" || event.date.startsWith(dateFilter))
      )
    );
  }, [searchQuery, locationFilter, dateFilter, events]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      setEvents(response.data);

      const uniqueLocations = [
        ...new Set(response.data.map((event) => event.location)),
      ];
      setAvailableLocations(uniqueLocations);
    } catch (error) {
      toast.error("Error fetching events");
    }
  };

  const handleCreateOrUpdateEvent = async (e) => {
    e.preventDefault();
    const eventData = { title, description, date, location };
    try {
      if (editEventId) {
        await axiosInstance.put(`/events/${editEventId}/`, eventData);
        toast.success("Event updated successfully!");
        setEditEventId(null);
      } else {
        await axiosInstance.post("/events/", eventData);
        toast.success("Event created successfully!");
      }
      fetchEvents();
      clearForm();
      setShowCreateForm(false);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.date || "Error creating/updating event"
        );
      } else {
        toast.error("An error occurred, please try again.");
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}/`);
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  const handleEditEvent = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setLocation(event.location);
    setEditEventId(event.id);
    setShowCreateForm(true);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setEditEventId(null);
  };

  return (
    <div className="event-management-page">
      <div className="header-container">
        <Typography variant="h4" className="page-title">
          Event Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="back-to-admin-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          Back to Admin Dashboard
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="create-event-button"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New Event"}
        </Button>
      </div>

      {showCreateForm && (
        <div className="create-event-form">
          <form onSubmit={handleCreateOrUpdateEvent} className="event-form">
            <TextField
              label="Event Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date and Time"
              variant="outlined"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-event-button"
              sx={{ mb: 2 }}
              fullWidth
            >
              {editEventId ? "Update Event" : "Create Event"}
            </Button>
          </form>
        </div>
      )}

      <EventDataGrid
        events={filteredEvents}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        availableLocations={availableLocations}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        showFilters={true}
      />
    </div>
  );
};

export default EventManagement;
