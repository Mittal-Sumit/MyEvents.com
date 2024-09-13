import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown"; // Ensure this import exists
import { fetchNotifications } from "../api/notificationApi"; // Ensure this import exists
import NotificationsIcon from "@mui/icons-material/Notifications";

const Sidebar = ({
  role,
  navigateTo,
  scrollToHeader,
  scrollToContent,
  scrollToFooter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // Notification state
  const sidebarRef = useRef(null);
  const burgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      burgerRef.current &&
      !burgerRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  const handleNotificationClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    fetchNotifications()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setNotifications(data); // Only set notifications if data is an array
        } else {
          console.error("Unexpected data format", data);
          setNotifications([]); // Fallback to empty array in case of unexpected response
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications", error);
        setNotifications([]); // Set notifications to empty array in case of error
      });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Burger Menu */}
      <button
        ref={burgerRef}
        onClick={toggleSidebar}
        className="burger-menu-s"
        style={{ zIndex: 1000 }} // Ensure burger is above the sidebar
      >
        ☰
      </button>
      <div
        ref={sidebarRef}
        className={`main-sidebar ${isOpen ? "open" : ""}`}
        style={{ zIndex: 999 }} // Sidebar under the burger
      >
        <nav className="sidebar-nav">
          <ul className="sidebar-list">
            <li className="sidebar-item" onClick={scrollToHeader}>
              Home
            </li>
            <li className="sidebar-item" onClick={scrollToContent}>
              Events
            </li>
            {role === "manager" || role === "admin" ? (
              <li
                className="sidebar-item"
                onClick={() => navigateTo("/event-management")}
              >
                Manage Events
              </li>
            ) : null}
            {role === "admin" ? (
              <>
                <li
                  className="sidebar-item"
                  onClick={() => navigateTo("/user-management")}
                >
                  User Roles
                </li>
                <li
                  className="sidebar-item"
                  onClick={() => navigateTo("/reports")}
                >
                  Guest List
                </li>
              </>
            ) : null}
            <li className="sidebar-item" onClick={scrollToFooter}>
              Contact Us
            </li>
            {/* Notification bell button */}
            <li className="sidebar-item" onClick={handleNotificationClick}>
              <NotificationsIcon />
              {isDropdownOpen && (
                <NotificationDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  notifications={notifications}
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
