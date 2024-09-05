import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify'; 
import HeaderAuth from './HeaderAuth'; 
import TextInput from './Login/TextInput'; // Reusing the TextInput component
import './AuthStyles.css'; 

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/reset_password/', { email });
            toast.success(response.data.message); 
        } catch (error) {
            toast.error("User doesn't exist"); 
            console.error('Reset error:', error.response);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <HeaderAuth /> 
            <Typography variant="h5" gutterBottom>
                Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Enter a valid email address"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="submit" className="auth-button" value="Send Reset Link" />
            </form>
            <Link to="/login" className="auth-link">
                Back to Login
            </Link>
        </div>
    );
};

export default ResetPassword;
