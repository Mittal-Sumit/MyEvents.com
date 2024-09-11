/* src/components/Profile.js */
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
import "./AuthStyles.css";

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
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
      setUserData(editData);
      setOpenEditModal(false);
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
    setEditData(userData);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleBackToHome = () => {
    // Simply navigate to Home for all users
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>

      <Typography variant="body1">
        <strong>Username:</strong> {userData.username}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {userData.email}
      </Typography>

      <Button
        sx={{ marginRight: 15 }}
        variant="contained"
        className="auth-button"
        onClick={handleEditButtonClick}
      >
        Edit Details
      </Button>

      <Button
        sx={{ color: "black" }}
        className="auth-button"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>

      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Change Password
      </Typography>
      <PasswordField
        password={oldPassword}
        setPassword={setOldPassword}
        customLabel="Old Password"
      />
      <PasswordField
        password={newPassword}
        setPassword={setNewPassword}
        customLabel="New Password"
      />
      <PasswordField
        password={confirmPassword}
        setPassword={setConfirmPassword}
        customLabel="Confirm New Password"
      />

      <Button
        variant="contained"
        className="auth-button"
        onClick={handlePasswordChange}
      >
        Change Password
      </Button>

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
