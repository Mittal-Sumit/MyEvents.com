// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard'; 
import EventManagement from './components/EventManagement'; 
import ResetPassword from './components/ResetPassword';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import UserManagement from './components/UserManagement';
import ProtectedRoute from './components/ProtectedRoute'; 
import './App.css';

const App = () => {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} /> 
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/event-management" element={<ProtectedRoute><EventManagement /></ProtectedRoute>} /> 
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            </Routes>
        </Router>
    );
};

export default App;
