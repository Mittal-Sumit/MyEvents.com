import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PasswordField from "./Login/PasswordField"; // Using the password field component
import "./Profile.css"; // Importing the updated CSS

const Profile = () => {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    password: "", // Password field will now be mandatory for updates
  });
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
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileUpdate = async () => {
    // Create an object that will store the updates
    const updates = {};

    // Only add fields that have changed (not empty)
    if (editData.username && editData.username !== userData.username) {
      updates.username = editData.username;
    }
    if (editData.email && editData.email !== userData.email) {
      updates.email = editData.email;
    }

    // If no fields have changed, show a message and return
    if (Object.keys(updates).length === 0) {
      toast.error("No changes detected.");
      return;
    }

    try {
      console.log("Sending update request with data:", updates);

      // Send a PATCH request with the updated fields
      const response = await axiosInstance.patch("/users/me/", updates);

      console.log("Update response:", response.data); // Log the response
      toast.success("Profile updated successfully.");
      setUserData({ ...userData, ...updates }); // Update userData with the correct fields
      setOpenEditModal(false);

      // After updating, log the user out
      handleLogout();
    } catch (error) {
      console.error("Failed to update profile:", error); // Log the error for debugging
      toast.error("Failed to update profile.");
    }
  };

  // Logout function to clear session and navigate to login
  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/users/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully.");
      handleLogout();
    } catch (error) {
      toast.error("Failed to update password.");
      console.error("Password change error:", error);
    }
  };

  const handleEditButtonClick = () => {
    setEditData({ ...userData, password: "" }); // Initialize password field as empty
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <Typography variant="h5" className="auth-title">
        Profile
      </Typography>

      <div className="profile-info">
        <Typography variant="body1">
          <strong>Username:</strong> {userData.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {userData.email}
        </Typography>
      </div>

      <Button
        variant="contained"
        className="auth-button"
        onClick={handleEditButtonClick}
      >
        Edit Details
      </Button>

      <Button
        variant="outlined"
        className="auth-button"
        onClick={handleBackToHome}
      >
        Back to Home
      </Button>

      <Typography variant="h6" className="auth-subtitle">
        Change Password
      </Typography>

      <div className="password-change-fields">
        <div>
          <PasswordField
            password={oldPassword}
            setPassword={setOldPassword}
            customLabel="Old Password"
          />
        </div>

        <div>
          <PasswordField
            password={newPassword}
            setPassword={setNewPassword}
            customLabel="New Password"
          />
        </div>

        <div>
          <PasswordField
            password={confirmPassword}
            setPassword={setConfirmPassword}
            customLabel="Confirm New Password"
          />
        </div>
      </div>

      <Button
        variant="contained"
        className="auth-button"
        onClick={handlePasswordChange}
      >
        Change Password
      </Button>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle
          sx={{
            backgroundColor: "#f5f5f5", // Light grey background for contrast
            color: "#000", // Black text for visibility
          }}
        >
          Edit Profile
        </DialogTitle>
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
          <PasswordField
            password={editData.password}
            setPassword={(password) => setEditData({ ...editData, password })}
            customLabel="Password (required)"
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
