// src/components/Home.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';  // Ensure correct path
import Footer from './Footer';    // Ensure correct path
import './Home.css';              // Import the CSS file for styling

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // References for the sections
    const headerRef = useRef(null);
    const contentRef = useRef(null);
    const footerRef = useRef(null);

    const handleLogout = () => {
        navigate('/login');  // Navigate to login page on logout
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    // Close sidebar when clicking outside of it
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

    // Scroll functions
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
            <div className="main-header" ref={headerRef}>  {/* Header reference */}
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

            <div className="main-content" ref={contentRef}> {/* Content reference */}
                <h1>Welcome to MyEvent</h1>
                <p>This is the main page content.</p>
            </div>

            <div ref={footerRef}> {/* Footer reference */}
                <Footer />
            </div>
        </div>
    );
};

export default Home;
