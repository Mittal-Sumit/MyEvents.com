/* src/components/Header.js */
import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = ({ toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      <button className="burger-menu" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="site-title">MyEvent.com</h1>
      <div className="header-icons">
        <AccountCircleIcon
          className="profile-icon"
          onClick={handleProfileClick}
        />
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
