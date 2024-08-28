import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Home.css'; // Create or use an existing CSS file for additional styles

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="App">
            <Header />
            <Sidebar />
            <div className="content">
                <div className="home-header">
                    <h2>Welcome to the Home Page</h2>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                {/* Additional content can go here */}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
