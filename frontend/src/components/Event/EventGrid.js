/* src/components/Event/EventGrid.js */
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
  onDelete,
  registeredEvents,
  handleRegister,
  handleRSVP,
  showFilters = true,
  showActions = true,
  isListMode = false,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDelete(eventToDelete);
      setOpenDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEventToDelete(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "date",
      headerName: "Date and Time",
      width: 180,
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
    { field: "location", headerName: "Location", width: 150 },
    ...(showActions
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: isListMode ? 350 : 150,
            renderCell: (params) => {
              const eventId = params.row.id;
              if (isListMode) {
                return registeredEvents.includes(eventId) ? (
                  <div>
                    <Button
                      sx={{ backgroundColor: "green", color: "white" }}
                      variant="outlined"
                      color="primary"
                      onClick={() => handleRSVP(eventId, "attending")}
                    >
                      Attending
                    </Button>
                    <Button
                      sx={{ backgroundColor: "red", color: "white" }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRSVP(eventId, "not attending")}
                    >
                      Not Attending
                    </Button>
                    <Button
                      sx={{ backgroundColor: "grey", color: "white" }}
                      variant="outlined"
                      onClick={() => handleRSVP(eventId, "maybe")}
                    >
                      Maybe
                    </Button>
                  </div>
                ) : (
                  <Button
                    sx={{ backgroundColor: "blue", color: "white" }}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRegister(eventId)}
                  >
                    Register
                  </Button>
                );
              } else {
                return (
                  <div>
                    <Button onClick={() => onEdit(params.row)}>Edit</Button>
                    <Button
                      onClick={() => handleDeleteClick(params.id)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Event?"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventGrid;
