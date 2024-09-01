// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard'; // Import the Admin Dashboard component
import ResetPassword from './components/ResetPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import './App.css';

const App = () => {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> {/* Toaster configuration */}
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin dashboard route */}
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            </Routes>
        </Router>
    );
};

export default App;
