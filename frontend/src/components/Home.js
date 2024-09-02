// src/components/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Header from './Header'; // Assuming you have a Header component
import ReactJoyride from 'react-joyride'; // Import React Joyride
import { joyrideSteps } from './joyrideSteps'; // Import the steps for Joyride
import './Home.css';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showJoyride, setShowJoyride] = useState(false); // State to control Joyride visibility
    const navigate = useNavigate();

    // References for the sections
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const footerRef = useRef(null);

    const handleLogout = () => {
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
    }, []);

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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel risus quis enim aliquet euismod sit amet ac felis. Curabitur vehicula vehicula lorem ac elementum. Donec at sodales lorem. Proin sed ligula vestibulum, finibus ex non, fringilla nisl. In hac habitasse platea dictumst. Sed eget magna mi. Phasellus vitae libero venenatis, cursus purus in, interdum ligula. Etiam feugiat est eu erat laoreet, et egestas lectus vulputate. Nullam malesuada massa et mauris volutpat, a varius nunc pharetra. Mauris consectetur facilisis tincidunt. Nulla facilisi. Cras lacinia magna non dui cursus, vel convallis lorem iaculis.</p>
                <p>Vivamus a est a nisi ultricies facilisis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In hac habitasse platea dictumst. Integer nec magna sem. Nam vel egestas eros. Vestibulum pretium luctus tincidunt. Nullam nec lorem sem. Duis auctor, erat id egestas facilisis, orci nisi hendrerit metus, vel ultricies nulla orci et magna. Aenean facilisis convallis ipsum, sed vulputate est fermentum non.</p>
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
