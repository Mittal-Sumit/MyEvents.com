// src/components/GuestListReports.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  CircularProgress,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import GuestListComponent from "./GuestListComponent"; // Correct default import

const GuestListReports = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsAndGuestLists();
  }, []);

  const fetchEventsAndGuestLists = async () => {
    try {
      const response = await axiosInstance.get("/events/"); // Fetch all events
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching events");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Event Guest List Reports
      </Typography>

      {events.map((event) => (
        <Accordion key={event.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${event.id}-content`}
            id={`panel-${event.id}-header`}
          >
            <Typography>{event.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Guest List for {event.title}</Typography>
            <GuestListComponent eventId={event.id} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default GuestListReports;
