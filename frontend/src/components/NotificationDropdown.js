import React, { useState, useEffect } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../api/notificationApi";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { toast } from "react-toastify"; // Importing toast for notifications

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Set loading true when the dropdown is opened
      fetchNotifications()
        .then((data) => {
          setNotifications(data);
          setLoading(false); // Set loading false after fetching data
        })
        .catch((error) => {
          toast.error("Failed to load notifications.");
          setLoading(false); // Ensure loading is set to false on error
        });
    }
  }, [isOpen]);

  const handleNotificationClick = (notificationId) => {
    markNotificationAsRead(notificationId)
      .then(() => {
        // Update the specific notification as read
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        toast.success("Notification marked as read!");
      })
      .catch(() => {
        toast.error("Failed to mark notification as read.");
      });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: "#f5f5f5", // Light grey background for contrast
          color: "#000", // Black text for visibility
        }}
      >
        Notifications
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No new notifications</p>
        ) : (
          <List>
            {notifications.map((notif) => (
              <div key={notif.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <ListItemText
                    primary={notif.message}
                    secondary={new Date(notif.created_at).toLocaleString()} // Formatting date
                    style={{
                      fontWeight: notif.is_read ? "normal" : "bold", // Bold for unread notifications
                    }}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDropdown;
