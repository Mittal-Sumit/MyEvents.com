// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">  {/* Updated to match Footer.css */}
            <p>&copy; 2024 MyEvent.com</p>
            <div className="footer-contact-info">
                <p>Email: contact@myevent.com</p>
                <p>Phone: +91 1234 567 890</p>
                <p>Address: 123, City, State, India</p>
                <p>Pin Code: 654321</p>
            </div>
        </footer>
    );
};

export default Footer;
