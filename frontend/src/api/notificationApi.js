// src/api/notificationApi.js
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${process.env.REACT_APP_API_URL}/api/notifications/`;

export const fetchNotifications = async () => {
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
    console.error("Error fetching notifications:", error);
    toast.error("Error fetching notifications");
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    toast.error("No authentication token found");
    throw new Error("No authentication token found");
  }

  try {
    await axios.post(
      `${API_URL}read/${notificationId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast.error("Error marking notification as read");
  }
};
