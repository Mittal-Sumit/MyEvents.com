/* src/components/GuestListReports.js */
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import GuestListPopup from "./GuestListPopup";
import { useNavigate } from "react-router-dom";

const GuestListReports = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      setEvents(response.data);
      const uniqueLocations = [
        ...new Set(response.data.map((event) => event.location)),
      ];
      setAvailableLocations(uniqueLocations);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching events");
      setLoading(false);
    }
  };

  const handleShowGuests = (eventId) => {
    setSelectedEventId(eventId);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (locationFilter === "" || event.location === locationFilter) &&
      (dateFilter === "" || event.date.startsWith(dateFilter))
  );

  const eventColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleShowGuests(params.row.id)}
        >
          Show Guests
        </Button>
      ),
    },
  ];

  return (
    <div className="guestlist-page">
      <Typography variant="h4" gutterBottom>
        Event Guest List Reports
      </Typography>
      {/* Go Back to Home Button */}
      <Button
        sx={{
          ":hover": {
            bgcolor: "primary.main", // theme.palette.primary.main
            color: "white",
          },
        }}
        color="primary"
        className="go-back-home-button"
        onClick={() => navigate("/home")} // Navigate to home page
        style={{ marginRight: "10px", marginBottom: "20px" }}
      >
        Go Back to Home
      </Button>

      {/* Filters */}
      <div className="filter-container">
        <TextField
          label="Search by Title"
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
          select
          label="Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="location-filter"
        >
          <MenuItem value="">All Locations</MenuItem>
          {availableLocations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          className="date-filter"
        />
      </div>

      {/* Event List DataGrid */}
      <Box className="datagrid-container">
        <DataGrid
          rows={filteredEvents}
          columns={eventColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          disableSelectionOnClick
        />
      </Box>

      {/* Guest List Popup */}
      {openPopup && (
        <GuestListPopup
          eventId={selectedEventId}
          handleClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default GuestListReports;
