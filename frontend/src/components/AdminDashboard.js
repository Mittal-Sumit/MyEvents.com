/* src/components/AdminDashboard.js */
import { React, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header"; // Import the Header component
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const goToUserManagement = () => {
    navigate("/user-management");
  };
  const headerRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <Header handleLogout={handleLogout} />

      <div className="fullscreen-image-header" ref={headerRef}></div>

      <div className="main-content">
        <h2>Welcome, Admin</h2>
        <p>Here you can manage events, view user statistics, and more.</p>

        <div className="dashboard-section">
          <h3>Manage Events</h3>
          <p>View, edit, or delete events.</p>
          <button
            className="admin-button"
            onClick={() => navigate("/event-management")}
          >
            Go to Events
          </button>
        </div>

        <div className="dashboard-section">
          <h3>User Management</h3>
          <p>View user profiles, assign roles, and manage accounts.</p>
          <button className="admin-button" onClick={goToUserManagement}>
            Manage Users
          </button>
        </div>

        <div className="dashboard-section">
          <h3>Reports</h3>
          <p>Generate and view reports.</p>
          <button className="admin-button" onClick={() => navigate("/reports")}>
            View Reports
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
