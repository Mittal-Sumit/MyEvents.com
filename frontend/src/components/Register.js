// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import './AuthStyles.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/register/', {
                username,
                email,
                password,
            });
            setMessage('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            setMessage('There was an error registering the user.');
            console.error('Registration error:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Typography variant="h5" gutterBottom>
                Register
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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" className="auth-button" value="Register" />
                {message && <Typography color="error">{message}</Typography>}
            </form>
            <button className="auth-link-button" onClick={handleBackToLogin}>
                Back to Login
            </button>
        </div>
    );
};

export default Register;
