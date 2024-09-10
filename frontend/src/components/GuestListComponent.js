// src/components/GuestListComponent.js
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Box, Button } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const GuestListComponent = ({ eventId }) => {
  const [guestList, setGuestList] = useState([]);
  const [guestListLoading, setGuestListLoading] = useState(true);

  const fetchGuestList = async () => {
    try {
      const response = await axiosInstance.get(
        `/rsvp/guestlist/?event_id=${eventId}`
      );
      setGuestList(response.data);
      setGuestListLoading(false);
    } catch (error) {
      toast.error("Error fetching guest list");
      setGuestListLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestList();
  }, [eventId]);

  const handleMarkCheckedIn = async (guestId) => {
    try {
      await axiosInstance.patch(`/rsvp/guestlist/${guestId}/mark_checked_in/`);
      toast.success("Guest marked as checked in");
      fetchGuestList();
    } catch (error) {
      toast.error("Failed to mark guest as checked in");
    }
  };

  const handleDeleteRegistration = async (guestId) => {
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

  if (guestListLoading) {
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
      width: 250,
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
            onClick={() => handleDeleteRegistration(params.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={guestList}
        columns={guestColumns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default GuestListComponent;
