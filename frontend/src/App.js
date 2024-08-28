import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage'; // Import the AuthPage component
import Home from './components/Home'; // Import the Home component for after login
import './App.css'; // Make sure this exists for global styles

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} /> {/* Default to login */}
                <Route path="/login" element={<AuthPage />} /> {/* Show login and register */}
                <Route path="/home" element={<Home />} /> {/* Home page after login */}
            </Routes>
        </Router>
    );
};

export default App;
