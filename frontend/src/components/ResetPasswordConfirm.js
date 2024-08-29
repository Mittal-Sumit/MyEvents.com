// src/components/ResetPasswordConfirm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import './AuthStyles.css'; // Ensure you're using the AuthStyles.css file

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams(); // Get UID and token from URL
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8000/api/users/reset_password_confirm/${uid}/${token}/`,
                { password }
            );
            setMessage('Password has been reset successfully.');
            navigate('/login');
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
            console.error('Reset error:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" className="auth-button" value="Change Password" />
                {message && <Typography color="error">{message}</Typography>}
            </form>
            <button className="auth-link-button" onClick={handleBackToLogin}>
                Back to Login
            </button>
        </div>
    );
};

export default ResetPasswordConfirm;
