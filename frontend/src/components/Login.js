// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import Header from './Header'; // Import the Header component
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide password
import './AuthStyles.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState); // Toggle password visibility
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password,
            });

            const userRole = response.data.user.role; // Extract user role from the response
            toast.success('Login successful!'); // Show success toaster notification
            // Redirect based on user role
            if (userRole === 'admin') {
                navigate('/admin-dashboard'); // Redirect to admin page
            } else {
                navigate('/home'); // Redirect to user home page
            }
        } catch (error) {
            toast.error('Invalid credentials, please try again.'); // Show error toaster notification
            console.error('Error:', error);
        }
    };

    const handleForgotPassword = () => {
        navigate('/reset-password');
    };

    return (
        <div className="auth-container">
            <Header /> {/* Include the Header component */}
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
            <Tooltip title="Enter your username" placement="left">
                <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </Tooltip>
                <Tooltip title="Enter your password" placement="left">
                <input
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </Tooltip>
                <span className="toggle-login-password" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <input type="submit" className="auth-button" value="Login" />
                    <button className="auth-link-button forgot-password-link" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                </div>
            </form>
            <Link to="/register" className="auth-link">
                Don't have an account? Register here
            </Link>
        </div>
    );
};

export default Login;
