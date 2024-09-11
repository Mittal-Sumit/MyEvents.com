/* src/components/Sidebar.js */
import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  role,
  navigateTo,
  scrollToHeader,
  scrollToContent,
  scrollToFooter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button ref={burgerRef} onClick={toggleSidebar} className="burger-menu">
        ☰
      </button>
      <div ref={sidebarRef} className={`main-sidebar ${isOpen ? "open" : ""}`}>
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
                  Reports (Guest List)
                </li>
              </>
            ) : null}
            <li className="sidebar-item" onClick={scrollToFooter}>
              Contact Us
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
