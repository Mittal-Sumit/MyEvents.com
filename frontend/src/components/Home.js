import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Header from './Header';
import WhatWeOffer from './Home/WhatWeOffer';
import ReactJoyride from 'react-joyride';
import { joyrideSteps } from './joyrideSteps';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Slider from 'react-slick'; // Import the Slider component from react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showJoyride, setShowJoyride] = useState(false);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

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

        return () => {
            document.removeEventListener('click', handleClickOutside);
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
            const response = await axiosInstance.get('/events/');
            setEvents(response.data.slice(0, 6));
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
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
        <div className={`home-page ${isSidebarOpen ? 'blur-background' : ''}`}>
            {/* Fixed Header */}
            <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} />

            {/* Sidebar */}
            <div className={`main-sidebar ${isSidebarOpen ? 'open' : 'main-sidebar-closed'}`}>
                <Sidebar
                    scrollToHeader={() => scrollToSection(headerRef)}
                    scrollToContent={() => scrollToSection(contentRef)}
                    scrollToFooter={() => scrollToSection(footerRef)}
                />
            </div>

            {/* Fullscreen Image Header */}
            <div className="fullscreen-image-header" ref={headerRef}>
            </div>

            {/* Main Content */}
            {/* Small Image */}
            <div className="small-image-container">
                <img src="/TheLogo.jpg" alt="Logo" className="small-image" />
            
            
            <div className="about-us-section">
                <h2>THE MY EVENT STORY</h2>
                <p className='about-us-sub'>
                <i>Plan Your Day</i>
                </p>
                <p>MyEvent.com began as a small passion project during a casual coffee chat between two friends who loved attending events but found it difficult to discover the right ones. With a shared vision, they dreamed of creating a platform that would bring people closer to the events that matter most to them—whether it's a live concert, a charity run, or an intimate workshop.

In 2021, armed with little more than determination and a belief in the power of human connection, MyEvent.com was born. What started as a simple event listing site quickly grew as users began sharing their love for unique experiences. Our community rapidly expanded, and we knew we were onto something bigger.
Where We Are Now

Today, MyEvent.com is more than just a platform—it's a destination for discovering moments that spark joy, learning, and connection. We've grown into a vibrant ecosystem that helps thousands of people find, register for, and engage with events in ways they’ve never experienced before. Our platform features everything from concerts and festivals to corporate networking events, workshops, and beyond. We also offer personalized event recommendations based on your interests, making it easier for you to find what you're passionate about.   </p>
            </div>
            </div>
            
            {/* What We Offer Section */}
             <WhatWeOffer />

            <div className="main-content" ref={contentRef}>
                <h1>Upcoming Events</h1>
                <Slider {...sliderSettings}>
                    {events.map(event => (
                        <div key={event.id} className="slider-item">
                            <Card className="event-card">
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="CardImg.jpg" // Placeholder image
                                    alt={event.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5">
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

                <div className="view-all-events">
                    <Link to="/event-list" className="view-all-link">View All Events</Link>
                </div>
            </div>
            
            <div className="image-between-section">
                <img src= "/Final.jpg" alt="Ending Section" className="end-page-image"/>
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
