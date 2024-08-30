// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Reuse the existing Sidebar component
import Footer from './Footer';   // Reuse the existing Footer component
import './AdminDashboard.css';   // Create a new CSS file for styling

const AdminDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className={`admin-dashboard-page ${isSidebarOpen ? 'blur-background' : ''}`}>
            <div className="main-header">
                <button 
                    className={`burger-menu ${isSidebarOpen ? 'highlight' : ''}`}
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className={`main-sidebar ${isSidebarOpen ? 'open' : 'main-sidebar-closed'}`}>
                <Sidebar />
            </div>

            <div className="main-content">
                <h2>Welcome, Admin</h2>
                <p>Here you can manage events, view user statistics, and more.</p>

                {/* Example sections for admin tasks */}
                <div className="dashboard-section">
                    <h3>Manage Events</h3>
                    <p>View, edit, or delete events.</p>
                    <button className="admin-button">Go to Events</button>
                </div>

                <div className="dashboard-section">
                    <h3>User Management</h3>
                    <p>View user profiles, assign roles, and manage accounts.</p>
                    <button className="admin-button">Manage Users</button>
                </div>

                <div className="dashboard-section">
                    <h3>Reports</h3>
                    <p>Generate and view reports.</p>
                    <button className="admin-button">View Reports</button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
