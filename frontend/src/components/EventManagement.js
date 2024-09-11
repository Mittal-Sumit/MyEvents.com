import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EventDataGrid from "./Event/EventDataGrid";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import dayjs from "dayjs"; // For date parsing and formatting
import "./EventManagement.css";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setFilteredEvents(
      events.filter(
        (event) =>
          event.title.toLowerCase().includes(title.toLowerCase()) &&
          (locationFilter === "" || event.location === locationFilter) &&
          (dateFilter === "" || event.date.startsWith(dateFilter))
      )
    );
  }, [title, locationFilter, dateFilter, events]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      const formattedEvents = response.data.map((event) => ({
        ...event,
        date: dayjs(event.date).format("YYYY-MM-DDTHH:mm"), // Format the date correctly
      }));
      setEvents(formattedEvents);

      const uniqueLocations = [
        ...new Set(response.data.map((event) => event.location)),
      ];
      setAvailableLocations(uniqueLocations);
    } catch (error) {
      toast.error("Error fetching events");
    }
  };

  const handleCreateOrUpdateEvent = async () => {
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
      setOpenEventDialog(false);
    } catch (error) {
      toast.error("Error creating/updating event");
    }
  };

  const handleEditEvent = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(dayjs(event.date).format("YYYY-MM-DDTHH:mm")); // Ensure the date is in the right format
    setLocation(event.location);
    setEditEventId(event.id);
    setOpenEventDialog(true);
  };

  const handleCloseDialog = () => {
    clearForm();
    setOpenEventDialog(false);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setLocation("");
    setEditEventId(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      await axiosInstance.delete(`/events/${eventToDelete}/`);
      toast.success("Event deleted successfully!");
      setOpenDeleteDialog(false);
      fetchEvents();
    } catch (error) {
      toast.error("Error deleting event");
    } finally {
      setEventToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  return (
    <div className="event-management-page">
      <div className="header-container">
        <Typography variant="h4" className="page-title">
          Event Management
        </Typography>

        {/* Go Back to Home Button */}
        <Button
          sx={{
            ":hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
          color="white"
          onClick={() => navigate("/home")}
          style={{ marginRight: "10px" }}
        >
          Go Back to Home
        </Button>

        <Button
          sx={{
            ":hover": {
              bgcolor: "green",
              color: "white",
            },
          }}
          color="white"
          className="create-event-button"
          onClick={() => setOpenEventDialog(true)}
        >
          Create New Event
        </Button>
      </div>

      <EventDataGrid
        events={filteredEvents}
        searchQuery={title}
        setSearchQuery={setTitle}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        availableLocations={availableLocations}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        showFilters={true}
      />

      <Dialog
        open={openEventDialog}
        onClose={handleCloseDialog}
        aria-labelledby="event-dialog-title"
      >
        <DialogTitle id="event-dialog-title">
          {editEventId ? "Edit Event" : "Create New Event"}
        </DialogTitle>
        <DialogContent>
          <form className="event-form">
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdateEvent}
            color="primary"
            variant="contained"
          >
            {editEventId ? "Update Event" : "Create Event"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Are you sure you want to delete this event?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteEvent}
            color="secondary"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EventManagement;
