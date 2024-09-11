import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

export const handleLogin = async (username, password, navigate) => {
  try {
    const response = await axiosInstance.post("users/login/", {
      username,
      password,
    });

    const { access, refresh } = response.data;

    // Decode token to get role
    const tokenPayload = JSON.parse(atob(access.split(".")[1]));
    const userRole = tokenPayload.role;

    // Store tokens in sessionStorage
    sessionStorage.setItem("accessToken", access);
    sessionStorage.setItem("refreshToken", refresh);
    sessionStorage.setItem("userRole", userRole); // Storing user role just in case

    // Navigate based on user role
    toast.success("Login successful!");
    navigate("/home");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("Invalid credentials, please try again.");
    } else {
      toast.error("An unexpected error occurred.");
    }
    console.error("Login Error:", error);
  }
};

export const handleLogout = (navigate) => {
  // Remove tokens and user-related data from session storage
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("userRole");

  // Show toast notification for logout
  toast.success("Logged out successfully!");

  // Redirect to home page
  navigate("/home");
};
