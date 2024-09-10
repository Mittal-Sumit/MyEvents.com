// src/components/GuestListPopup.js
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "./EventManagement.css"; // Reusing EventManagement CSS for similar styling

const GuestListPopup = ({ eventId, handleClose }) => {
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  useEffect(() => {
    fetchGuestList();
  }, [eventId]);

  const fetchGuestList = async () => {
    try {
      const response = await axiosInstance.get(
        `/rsvp/guestlist/?event_id=${eventId}`
      );
      setGuestList(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching guest list");
      setLoading(false);
    }
  };

  const filteredGuests = guestList.filter(
    (guest) =>
      guest.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "" || guest.status === statusFilter) &&
      (emailFilter === "" || guest.email.includes(emailFilter))
  );

  const handleMarkCheckedIn = async (guestId) => {
    try {
      await axiosInstance.patch(`/rsvp/guestlist/${guestId}/mark_checked_in/`);
      toast.success("Guest marked as checked in");
      fetchGuestList();
    } catch (error) {
      toast.error("Failed to mark guest as checked in");
    }
  };

  const handleDeleteGuest = async (guestId) => {
    try {
      await axiosInstance.delete(
        `/rsvp/guestlist/${guestId}/delete_registration/`
      );
      toast.success("Guest registration deleted");
      fetchGuestList();
    } catch (error) {
      toast.error("Failed to delete guest registration");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100px"
      >
        <CircularProgress />
      </Box>
    );
  }

  const guestColumns = [
    { field: "guest_name", headerName: "Guest Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleMarkCheckedIn(params.id)}
            style={{ marginRight: 8 }}
          >
            Mark as Checked In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteGuest(params.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h5">Guest List</Typography>
      </DialogTitle>
      <DialogContent>
        {/* Filters */}
        <div className="filter-container">
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Filter by Email"
            variant="outlined"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="email-filter"
          />
          <TextField
            select
            label="RSVP Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="attending">Attending</MenuItem>
            <MenuItem value="not_attending">Not Attending</MenuItem>
            <MenuItem value="maybe">Maybe</MenuItem>
            <MenuItem value="checked_in">Checked In</MenuItem>
          </TextField>
        </div>

        {/* Guest List DataGrid */}
        <div className="datagrid-container">
          <DataGrid
            rows={filteredGuests}
            columns={guestColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
            style={{ borderRadius: "8px", backgroundColor: "#ffffff" }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuestListPopup;
