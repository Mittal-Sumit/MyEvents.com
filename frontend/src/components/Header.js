import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import the toast function
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const isLoggedIn = !!sessionStorage.getItem("accessToken"); // Check if the user is logged in

  const handleProfileClick = () => {
    window.location.href = "/profile"; // Navigate to profile page
  };

  const handleLogout = () => {
    // Remove tokens and user role from session storage
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userRole");

    // Show toast notification for logout
    toast.success("Logged out successfully!");

    // Refresh the page to reset state
    window.location.href = "/home"; // This will refresh and navigate to home
  };

  return (
    <header className="header">
      <button className="burger-menu-h" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="site-title">MyEvent.com</h1>
      <div className="header-icons">
        {isLoggedIn ? (
          <>
            <AccountCircleIcon
              className="profile-icon"
              onClick={handleProfileClick}
            />
            <button className="logout-button" onClick={handleLogout}>
              LOG OUT
            </button>
          </>
        ) : (
          <button
            className="login-button"
            onClick={() => (window.location.href = "/login")}
          >
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
