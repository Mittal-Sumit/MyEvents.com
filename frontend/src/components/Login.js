// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Header from './Header';
import TextInput from './Login/TextInput'; 
import PasswordToggle from './Login/PasswordToggle'; 
import { handleLogin } from '../utils/authUtils'; 
import './AuthStyles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password, navigate);
    };

    return (
        <div className="auth-container">
            <Header />
            <Typography variant="h5" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label="Enter your username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className="password-field">
                    <TextInput
                        label="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordToggle 
                        showPassword={showPassword} 
                        togglePasswordVisibility={togglePasswordVisibility} 
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <input type="submit" className="auth-button" value="Login" />
                    <Link to="/reset-password" className="auth-link forgot-password-link">
                        Forgot Password?
                    </Link>
                </div>
            </form>
            <Link to="/register" className="auth-link">
                Don't have an account? Register here
            </Link>
        </div>
    );
};

export default Login;
