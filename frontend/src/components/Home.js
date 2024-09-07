/* src/components/Home.js */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import WhatWeOffer from "./Home/WhatWeOffer";
import AboutUsSection from "./Home/AboutUsSection"; // Import the About Us section
import ImageBetweenSections from "./Home/ImageBetweenSections"; // Import the Image component
import SliderComponent from "./Home/SliderComponent"; // Import the Slider component
import ReactJoyride from "react-joyride";
import { joyrideSteps } from "./joyrideSteps";
import "./Home.css";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showJoyride, setShowJoyride] = useState(false);
  const [events, setEvents] = useState([]);
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

    fetchUpcomingEvents();
  }, []);

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
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
          scrollToHeader={() => scrollToSection(headerRef)}
          scrollToContent={() => scrollToSection(contentRef)}
          scrollToFooter={() => scrollToSection(footerRef)}
        />
      </div>

      <div className="fullscreen-image-header" ref={headerRef}></div>

      {/* About Us Section */}
      <AboutUsSection />

      {/* What We Offer Section */}
      <WhatWeOffer />

      {/* Event Slider */}
      <div className="main-content" ref={contentRef}>
        <h1>Upcoming Events</h1>
        <SliderComponent events={events} sliderSettings={sliderSettings} />
        <div className="view-all-events">
          <Link to="/event-list" className="view-all-link">
            View All Events
          </Link>
        </div>
      </div>

      {/* Image Between Sections */}
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
