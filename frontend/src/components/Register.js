
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Tooltip } from '@mui/material'; 
import PasswordStrengthBar from 'react-password-strength-bar';
import { toast } from 'react-toastify';
import Header from './Header';
import './AuthStyles.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (passwordScore < 3) { // Minimum requirement: password must be 'good'
            toast.error('Password is too weak. Please use a stronger password.');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/users/register/', {
                username,
                email,
                password,
            });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.username) {
                    toast.error('Username already exists. Please choose a different one.');
                } else if (errorData.email) {
                    toast.error('Email already exists. Please choose a different one.');
                } else {
                    toast.error('There was an error registering the user.');
                }
            } else {
                toast.error('There was an error registering the user.');
            }
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Header />
            <Typography variant="h5" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <Tooltip title="Enter a unique username" placement="left">
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Tooltip>
                <Tooltip title="Enter a valid email address" placement="left">
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Tooltip>
                <div className="password-field">
                    <Tooltip title="Password strength should be good or above" placement="left">
                        <input
                            className="auth-input"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Tooltip>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <PasswordStrengthBar 
                    className='password-strength-container' 
                    password={password} 
                    onChangeScore={(score) => setPasswordScore(score)} 
                />

                <div className="password-field">
                    <Tooltip title="Re-enter the password to confirm" placement="left">
                        <input
                            className="auth-input"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Tooltip>
                    <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <input type="submit" className="auth-button" value="Register" />
            </form>
            <button className="auth-link-button" onClick={handleBackToLogin}>
                Back to Login
            </button>
        </div>
    );
};

export default Register;
