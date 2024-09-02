// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify'; 
import Header from './Header'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './AuthStyles.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password,
            });

            const userRole = response.data.user.role; 
            toast.success('Login successful!'); 
            
            if (userRole === 'admin') {
                navigate('/admin-dashboard'); 
            } else {
                navigate('/home'); 
            }
        } catch (error) {
            toast.error('Invalid credentials, please try again.'); 
            console.error('Error:', error);
        }
    };

    return (
        <div className="auth-container">
            <Header /> 
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
                <div className="password-field">
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
