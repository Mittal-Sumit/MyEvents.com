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
import "./Home.css";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState(null); // Track user role
  const navigate = useNavigate();
  const upcomingEventsRef = useRef(null); // For upcoming events section
  const footerRef = useRef(null);

  const sections = useRef([]); // Collect all sections

  const addToSections = (el) => {
    if (el && !sections.current.includes(el)) {
      sections.current.push(el);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    const sidebar = document.querySelector(".burger-menu-h");
    const burgerMenu = document.querySelector(".burger-menu-h");
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
    fetchUserRole();
    fetchUpcomingEvents();
    applyIntersectionObserver();
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

  const applyIntersectionObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    sections.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          navigateTo={(path) => handleNavigation(path)}
          scrollToHeader={scrollToTop} // Use scrollToTop for "Home" button
          scrollToContent={() => scrollToSection(upcomingEventsRef)} // Scroll to upcoming events
          scrollToFooter={() => scrollToSection(footerRef)}
        />
      </div>

      <div ref={addToSections}>
        <AboutUsSection />
      </div>

      <div ref={addToSections}>
        <WhatWeOffer />
      </div>

      <div className="main-content" ref={upcomingEventsRef}>
        <h1>Check Some Upcoming Events</h1>
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

      <div ref={addToSections}>
        <ImageBetweenSections />
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
