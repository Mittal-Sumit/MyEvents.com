import React from 'react';
import './Header.css';

const Header = ({ toggleSidebar, handleLogout }) => {
    return (
        <header className="header">
            <button className="burger-menu" onClick={toggleSidebar}>
                ☰
            </button>
            <h1 className="site-title">MyEvent.com</h1>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
};

export default Header;
