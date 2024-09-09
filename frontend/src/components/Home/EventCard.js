import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const [open, setOpen] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D"; // You can replace this with a better placeholder
  const eventImage = event.image ? event.image : defaultImage;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card className="event-card">
        <CardMedia
          component="img"
          height="140"
          image={eventImage}
          alt={event.title}
          className="event-image"
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.description}
          </Typography>
          <Typography variant="subtitle2">
            Location: {event.location}
          </Typography>
          <Typography variant="subtitle2">
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Details
          </Button>
        </CardContent>
      </Card>

      {/* Dialog for Event Details */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{event.title}</DialogTitle>
        <DialogContent>
          <img
            src={eventImage}
            alt={event.title}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          />
          <Typography variant="body1" color="textPrimary" gutterBottom>
            {event.description}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Location: {event.location}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;
