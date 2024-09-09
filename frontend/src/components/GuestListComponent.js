// src/components/GuestListComponent.js
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { CircularProgress, Box, Typography } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const GuestListComponent = ({ eventId }) => {
  const [guestList, setGuestList] = useState([]);
  const [guestListLoading, setGuestListLoading] = useState(true);

  useEffect(() => {
    const fetchGuestList = async () => {
      try {
        const response = await axiosInstance.get(
          `/rsvp/guestlist/?event_id=${eventId}`
        );
        console.log("Guest List Response: ", response.data); // Log response for debugging
        setGuestList(response.data);
        setGuestListLoading(false);
      } catch (error) {
        toast.error("Error fetching guest list");
        setGuestListLoading(false);
      }
    };

    fetchGuestList();
  }, [eventId]);

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
  ];

  return (
    <div style={{ height: 250, width: "100%" }}>
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
