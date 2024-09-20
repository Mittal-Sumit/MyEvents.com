// src/api/userManagementApi.js
import axios from "axios";
import { toast } from "react-toastify";

// Define the base URL for user management API calls
const API_URL = `${process.env.REACT_APP_API_URL}/api/users/`;

// Fetch all users with the authentication token
export const fetchUsers = async () => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    toast.error("No authentication token found");
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response || error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    toast.error("Error fetching users");
    throw error;
  }
};

// Update user role with authentication token
export const updateUserRole = async (userId, newRole) => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    toast.error("No authentication token found");
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.patch(
      `${API_URL}update-role/${userId}/`,
      {
        role: newRole,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error.response || error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    toast.error("Error updating user role");
    throw error;
  }
};
