import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordField from "./Login/PasswordField";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/users/me/");
      setUserData(response.data);
    } catch (error) {
      toast.error("Failed to load profile data.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axiosInstance.put("/users/me/", editData);
      toast.success("Profile updated successfully.");
      setUserData(editData); // Update main profile after successful edit
      setOpenEditModal(false); // Close the modal
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/users/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error("Failed to update password.");
    }
  };

  const handleEditButtonClick = () => {
    setEditData(userData); // Set current data into the modal form
    setOpenEditModal(true); // Open the modal
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false); // Close modal without saving
  };

  return (
    <div className="profile-page">
      <Typography variant="h4">Profile</Typography>

      {/* Display user details */}
      <Typography variant="body1">
        <strong>Username:</strong> {userData.username}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {userData.email}
      </Typography>

      {/* Button to trigger edit modal */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleEditButtonClick}
      >
        Edit Details
      </Button>

      {/* Button to go back to home */}
      <Button
        variant="outlined"
        color="secondary"
        style={{ marginTop: "10px" }}
        onClick={() => navigate("/home")}
      >
        Back to Home
      </Button>

      {/* Password Change Section */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Change Password
      </Typography>
      <PasswordField
        password={oldPassword}
        setPassword={setOldPassword}
        label="Old Password"
      />
      <PasswordField
        password={newPassword}
        setPassword={setNewPassword}
        label="New Password"
      />
      <PasswordField
        password={confirmPassword}
        setPassword={setConfirmPassword}
        label="Confirm New Password"
      />

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handlePasswordChange}
        style={{ marginTop: "10px" }}
      >
        Change Password
      </Button>

      {/* Modal for editing profile details */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editData.username}
            onChange={(e) =>
              setEditData({ ...editData, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleProfileUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
