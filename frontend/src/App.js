// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword'; // Ensure correct path and component import
import ResetPasswordConfirm from './components/ResetPasswordConfirm'; // Ensure correct path and component import
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/reset-password" element={<ResetPassword />} /> {/* Check this path */}
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} /> {/* Check this path */}
            </Routes>
        </Router>
    );
};

export default App;
