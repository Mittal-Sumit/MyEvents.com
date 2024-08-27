// frontend/src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleSidebar} className="burger-menu">
                ☰
            </button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <ul>
                        <li>Home</li>
                        <li>Events</li>
                        <li>Profile</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
