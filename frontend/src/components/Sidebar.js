// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar = ({ scrollToHeader, scrollToContent, scrollToFooter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const burgerRef = useRef(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (
            sidebarRef.current && !sidebarRef.current.contains(event.target) &&
            burgerRef.current && !burgerRef.current.contains(event.target)
        ) {
            setIsOpen(false); // Close the sidebar if clicked outside
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <button ref={burgerRef} onClick={toggleSidebar} className="burger-menu">
                ☰
            </button>
            <div ref={sidebarRef} className={`main-sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <ul className="sidebar-list">
                        <li className="sidebar-item" onClick={scrollToHeader}>Home</li>
                        <li className="sidebar-item" onClick={scrollToContent}>Events</li>
                        <li className="sidebar-item" onClick={scrollToFooter}>Contact Us</li> {/* New About Us button */}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
