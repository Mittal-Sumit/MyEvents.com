import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EventDataGrid from "./Event/EventDataGrid";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./EventManagement.css";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [location, setLocation] = useState("");
  const [editEventId, setEditEventId] = useState(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
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
          event.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
          (locationFilter === "" || event.location === locationFilter) &&
          (dateFilter === "" || event.date.startsWith(dateFilter))
      )
    );
  }, [searchTitle, locationFilter, dateFilter, events]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      const formattedEvents = response.data.map((event) => ({
        ...event,
        date: dayjs(event.date).format("YYYY-MM-DDTHH:mm"),
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
    if (!date || !time) {
      toast.error("Please provide both date and time.");
      return;
    }

    const eventData = {
      title,
      description,
      date: dayjs(date).hour(time.hour()).minute(time.minute()).toISOString(),
      location,
    };

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
    setDate(dayjs(event.date));
    setTime(dayjs(event.date));
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
    setDate(null);
    setTime(null);
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
        searchQuery={searchTitle}
        setSearchQuery={setSearchTitle}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        availableLocations={availableLocations}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent} // Pass handleDeleteEvent here
        showFilters={true}
      />

      <Dialog
        open={openEventDialog}
        onClose={handleCloseDialog}
        aria-labelledby="event-dialog-title"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#f5f5f5", // Light grey background for contrast
            color: "#000", // Black text for visibility
          }}
          id="event-dialog-title"
        >
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Event Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => (
                  <TextField {...params} required fullWidth margin="normal" />
                )}
              />
              <TimePicker
                label="Event Time"
                value={time}
                onChange={(newTime) => setTime(newTime)}
                renderInput={(params) => (
                  <TextField {...params} required fullWidth margin="normal" />
                )}
              />
            </LocalizationProvider>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle
          sx={{
            backgroundColor: "white", // Light grey background for contrast
            color: "#000", // Black text for visibility
          }}
          id="delete-dialog-title"
        >
          Are you sure you want to delete this event?
        </DialogTitle>
        <DialogActions>
          <Button
            sx={{
              ":hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            onClick={handleCloseDeleteDialog}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteEvent}
            sx={{
              backgroundColor: "red", // Light grey background for contrast
              color: "white", // Black text for visibility
              ":hover": {
                bgcolor: "white",
                color: "red",
              },
            }}
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
