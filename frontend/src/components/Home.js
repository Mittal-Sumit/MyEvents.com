import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';  // Ensure correct path
import Footer from './Footer';    // Ensure correct path
import './Home.css';              // Import the CSS file for styling

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');  // Navigate to login page on logout
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <div className={`home-page ${isSidebarOpen ? 'blur-background' : ''}`}>
            <div className="header">
                <button 
                    className={`burger-menu ${isSidebarOpen ? 'highlight' : ''}`}
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
                {/* Image is set as background, no text needed */}
            </div>

            <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <Sidebar />
            </div>

            <div className="content">
                <h1>EVENTS</h1>
                {/* Additional content can go here */}
            </div>

            <Footer />
        </div>
    );
};

export default Home;
