// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import './AuthStyles.css'; // Import the updated CSS file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password,
            });
            setMessage('Login successful!');
            navigate('/home');
        } catch (error) {
            setMessage('Invalid credentials, please try again.');
            console.error('Error response:', error.response);
        }
    };

    const handleForgotPassword = () => {
        navigate('/reset-password');
    };

    return (
        <div className="auth-container">
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <input type="submit" className="auth-button" value="Login" />
                    <button className="auth-link-button forgot-password-link" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                </div>
                {message && <Typography color="error">{message}</Typography>}
            </form>
            <Link to="/register" className="auth-link">
                Don't have an account? Register here
            </Link>
        </div>
    );
};

export default Login;
