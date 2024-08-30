// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import ResetPassword from './components/ResetPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin route */}
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            </Routes>
        </Router>
    );
};

export default App;
