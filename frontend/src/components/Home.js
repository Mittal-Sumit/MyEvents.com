/* src/components/Home.js */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import WhatWeOffer from "./Home/WhatWeOffer";
import AboutUsSection from "./Home/AboutUsSection";
import ImageBetweenSections from "./Home/ImageBetweenSections";
import EventCard from "./Home/EventCard";
import ReactJoyride from "react-joyride";
import { joyrideSteps } from "./joyrideSteps";
import "./Home.css";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showJoyride, setShowJoyride] = useState(false);
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState(null); // Track user role
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    const sidebar = document.querySelector(".main-sidebar");
    const burgerMenu = document.querySelector(".burger-menu");
    if (
      isSidebarOpen &&
      sidebar &&
      !sidebar.contains(event.target) &&
      !burgerMenu.contains(event.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const isFirstLogin = true;
    if (isFirstLogin) {
      setShowJoyride(true);
    }

    fetchUserRole(); // Fetch user role after login
    fetchUpcomingEvents();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axiosInstance.get("/users/me/");
      setRole(response.data.role); // Set user role from API
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axiosInstance.get("/events/");
      setEvents(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (path) => {
    const isAuthenticated = !!sessionStorage.getItem("accessToken");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className={`home-page ${isSidebarOpen ? "blur-background" : ""}`}>
      <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} />

      <div
        className={`main-sidebar ${
          isSidebarOpen ? "open" : "main-sidebar-closed"
        }`}
      >
        <Sidebar
          role={role}
          navigateTo={(path) => handleNavigation(path)} // Redirect user based on role
          scrollToHeader={() => scrollToSection(headerRef)}
          scrollToContent={() => scrollToSection(contentRef)}
          scrollToFooter={() => scrollToSection(footerRef)}
        />
      </div>

      <div className="fullscreen-image-header" ref={headerRef}></div>

      <AboutUsSection />

      <WhatWeOffer />

      <div className="main-content" ref={contentRef}>
        <h1>Upcoming Events</h1>
        <div className="event-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="view-all-events">
          <Link to="/event-list" className="view-all-link">
            View All Events
          </Link>
        </div>
      </div>

      <ImageBetweenSections />

      <div ref={footerRef}>
        <Footer />
      </div>

      {showJoyride && (
        <ReactJoyride
          steps={joyrideSteps}
          continuous={true}
          scrollToFirstStep={false}
          showSkipButton={true}
          showProgress={true}
        />
      )}
    </div>
  );
};

export default Home;
