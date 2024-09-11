import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";
import EventListDataGrid from "./Event/EventListDataGrid";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs"; // For date formatting
import "./EventList.css";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((event) => {
        const eventDate = dayjs(event.date); // Using dayjs for date parsing
        return eventDate.isSame(dayjs(dateFilter), "day");
      });
    }

    if (locationFilter) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, dateFilter, locationFilter, events]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      const formattedEvents = response.data.map((event) => ({
        ...event,
        date: dayjs(event.date).format("YYYY-MM-DDTHH:mm"), // Format date in a standardized way
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

  const fetchRegisteredEvents = async () => {
    try {
      const response = await axiosInstance.get("/rsvp/registered-events/");
      setRegisteredEvents(response.data.map((event) => event.id));
    } catch (error) {
      toast.error("Error fetching registered events");
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axiosInstance.post("/rsvp/register/", { event_id: eventId });
      toast.success("Registered for event!");
      fetchRegisteredEvents();
    } catch (error) {
      toast.error("Failed to register, please try again.");
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const decodedToken = jwtDecode(token);
      const loggedInUserId = decodedToken.user_id;

      const response = await axiosInstance.get(
        `/rsvp/rsvps/?event_id=${eventId}`
      );

      const rsvp = response.data.find(
        (rsvp) => rsvp.event === eventId && rsvp.user === loggedInUserId
      );

      if (rsvp) {
        await axiosInstance.patch(`/rsvp/rsvps/${rsvp.id}/`, {
          status: status,
        });
        toast.success("RSVP updated successfully!");
      } else {
        toast.error("No RSVP found for this event.");
      }
    } catch (error) {
      console.error("Failed to update RSVP:", error);
      toast.error("Failed to update RSVP, please try again.");
    }
  };

  return (
    <div className="event-list-page">
      <div className="header-container">
        <Typography variant="h4" className="page-title">
          Event List
        </Typography>
        <Button
          sx={{
            ":hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
          variant="contained"
          color="transperent"
          className="back-to-home-button"
          onClick={() => navigate("/home")}
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
        registeredEvents={registeredEvents}
        handleRegister={handleRegister}
        handleRSVP={handleRSVP}
        showFilters={true}
      />
    </div>
  );
};

export default EventList;
