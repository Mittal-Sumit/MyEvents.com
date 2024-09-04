import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ReactJoyride from 'react-joyride';
import { joyrideSteps } from './joyrideSteps';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showJoyride, setShowJoyride] = useState(false); // State to control Joyride visibility
    const [events, setEvents] = useState([]); // State to store events data
    const navigate = useNavigate();

    // References for the sections
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const footerRef = useRef(null);

    const handleLogout = () => {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
        const sidebar = document.querySelector('.main-sidebar');
        const burgerMenu = document.querySelector('.burger-menu');
        if (isSidebarOpen && sidebar && !sidebar.contains(event.target) && !burgerMenu.contains(event.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSidebarOpen]);

    useEffect(() => {
        const isFirstLogin = true; 
        if (isFirstLogin) {
            setShowJoyride(true); 
        }

        // Fetch upcoming events
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            const response = await axiosInstance.get('/events/');
            const upcomingEvents = response.data.slice(0, 6); // Select the first 6 events as major upcoming events
            setEvents(upcomingEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const scrollToHeader = () => {
        if (headerRef.current) {
            headerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToContent = () => {
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToFooter = () => {
        if (footerRef.current) {
            footerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleTabClose = () => {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    const sliderSettings = {
        dots: true, // Enable dots
        infinite: true, // Infinite loop sliding
        speed: 500, // Transition speed
        slidesToShow: 3, // Number of slides to show at a time
        slidesToScroll: 1, // Number of slides to scroll on each navigation
        autoplay: true, // Enable auto-play for the carousel
        autoplaySpeed: 3000, // Duration for auto-play (in ms)
        arrows: true, // Show navigation arrows
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ]
    };

    return (
        <div className={`home-page ${isSidebarOpen ? 'blur-background' : ''}`}>
            <div className="main-header" ref={headerRef}>
                <button
                    className={`burger-menu ${isSidebarOpen ? 'highlight' : ''}`}
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className={`main-sidebar ${isSidebarOpen ? 'open' : 'main-sidebar-closed'}`}>
                <Sidebar
                    scrollToHeader={scrollToHeader}
                    scrollToContent={scrollToContent}
                    scrollToFooter={scrollToFooter}
                />
            </div>

            <div className="main-content" id="main-content" ref={contentRef}>
                <h1>EVENTS</h1>

                <Slider {...sliderSettings}>
                    {events.map(event => (
                        <div key={event.id} className="slider-item">
                            <Card className="event-card">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="https://via.placeholder.com/150" // Placeholder image
                                    alt={event.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {event.description}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Location:</strong> {event.location}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </Slider>

                {/* Link to view all events */}
                <div className="view-all-events">
                    <Link to="/event-list" className="view-all-link">View All Events</Link>
                </div>
            </div>

            <div ref={footerRef}>
                <Footer />
            </div>

            {showJoyride && (
                <ReactJoyride
                    steps={joyrideSteps}
                    continuous={true}
                    scrollToFirstStep={true}
                    showSkipButton={true}
                    showProgress={true}
                />
            )}
        </div>
    );
};

export default Home;
