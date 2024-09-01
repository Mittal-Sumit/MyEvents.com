// src/components/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import Header from './Header'; // Import the Header component
import './AuthStyles.css'; 

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/reset_password/', { email });
            toast.success(response.data.message); // Show success message using toaster
        } catch (error) {
            toast.error("User doesn't exist"); // Show error message using toaster
            console.error('Reset error:', error.response);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Header /> {/* Include the Header component */}
            <Typography variant="h5" gutterBottom>
                Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <Tooltip title='Enter a valid email address' placement='left'>
                <input
                    className="auth-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Tooltip>
                <input type="submit" className="auth-button" value="Send Reset Link" />
            </form>
            <button className="auth-link-button" onClick={handleBackToLogin}>
                Back to Login
            </button>
        </div>
    );
};

export default ResetPassword;
