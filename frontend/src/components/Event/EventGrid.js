import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { format, parseISO } from "date-fns";

const EventGrid = ({
  events,
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  locationFilter,
  setLocationFilter,
  availableLocations,
  onEdit,
  onDelete, // onDelete passed from EventManagement
  registeredEvents,
  handleRegister,
  handleRSVP,
  showFilters = true,
  showActions = true,
  isListMode = false,
}) => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDetailsClick = (event) => {
    setSelectedEvent(event);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedEvent(null);
  };

  const columns = [
    {
      field: "serialNumber",
      headerName: "S. No.",
      width: 90,
      renderCell: (params) => {
        return params.api.getAllRowIds().indexOf(params.id) + 1; // Calculate serial number
      },
    },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "date",
      headerName: "Date and Time",
      width: 140,
      renderCell: (params) => {
        const dateStr = params.value;
        if (dateStr) {
          try {
            const date = parseISO(dateStr);
            return <span>{format(date, "yyyy-MM-dd HH:mm")}</span>;
          } catch (error) {
            console.error("Date parsing error:", error);
            return <span>Invalid date</span>;
          }
        }
        return <span>No date provided</span>;
      },
    },
    { field: "location", headerName: "Location", width: 175 },
    ...(showActions
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: isListMode ? 350 : 200,
            renderCell: (params) => {
              const eventId = params.row.id;
              if (isListMode) {
                return registeredEvents.includes(eventId) ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        ":hover": {
                          backgroundColor: "#45A049",
                        },
                      }}
                      variant="outlined"
                      onClick={() => handleRSVP(eventId, "attending")}
                    >
                      Attending
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: "#f44336",
                        color: "white",
                        ":hover": {
                          backgroundColor: "#e53935",
                        },
                      }}
                      variant="outlined"
                      onClick={() => handleRSVP(eventId, "not attending")}
                    >
                      Not Attending
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: "#9E9E9E",
                        color: "white",
                        ":hover": {
                          backgroundColor: "#757575",
                        },
                      }}
                      variant="outlined"
                      onClick={() => handleRSVP(eventId, "maybe")}
                    >
                      Maybe
                    </Button>
                  </div>
                ) : (
                  <Button
                    sx={{
                      backgroundColor: "#2196F3",
                      color: "white",
                      ":hover": {
                        backgroundColor: "#1976D2",
                      },
                    }}
                    variant="contained"
                    onClick={() => handleRegister(eventId)}
                  >
                    Register
                  </Button>
                );
              } else {
                return (
                  <div>
                    <Button
                      sx={{
                        color: "#2196F3",
                        ":hover": {
                          backgroundColor: "#1976D2",
                          color: "white",
                        },
                      }}
                      onClick={() => onEdit(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{
                        color: "#f44336",
                        ":hover": {
                          backgroundColor: "red",
                          color: "white",
                        },
                      }}
                      onClick={() => onDelete(params.id)} // Use onDelete from props
                      color="error"
                    >
                      Delete
                    </Button>
                  </div>
                );
              }
            },
          },
        ]
      : []),
    // Add a new column for "Details" button
    {
      field: "details",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDetailsClick(params.row)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <>
      {showFilters && (
        <div className="filter-container">
          <TextField
            label="Search Events"
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
            label="Filter by Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            className="date-filter"
          />
          <TextField
            select
            label="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="location-filter"
          >
            <MenuItem value="">All Locations</MenuItem>
            {availableLocations.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {loc}
              </MenuItem>
            ))}
          </TextField>
        </div>
      )}
      <div className="datagrid-container">
        <DataGrid
          rows={events}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          disableSelectionOnClick
          style={{ borderRadius: "8px", backgroundColor: "#FFFFFF" }}
        />
      </div>

      {/* Dialog for Event Details */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            backgroundColor: "white", // Light grey background for contrast
            color: "#000", // Black text for visibility
          }}
        >
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {selectedEvent?.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Location: {selectedEvent?.location}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Date:{" "}
            {selectedEvent
              ? new Date(selectedEvent.date).toLocaleDateString()
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventGrid;
