// src/components/ResetPasswordConfirm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography,Tooltip } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar'; // Import Password Strength Bar
import { toast } from 'react-toastify'; // Import toast from react-toastify
import Header from './Header'; // Import the Header component
import './AuthStyles.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons for show/hide password

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0); // State to track password score
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
        if (passwordScore < 3) { // Check if password is at least 'okay'
            toast.error('Password is too weak. Please use a stronger password.');
            return;
        }
        try {
            await axios.post(
                `http://localhost:8000/api/users/reset_password_confirm/${uid}/${token}/`,
                { password }
            );
            toast.success('Password has been reset successfully.');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
            console.error('Reset error:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <Header /> {/* Include the Header component */}
            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="password-field">
                <Tooltip title="Password strength should be good or above" placement="left">
                    <input
                        className="auth-input"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </Tooltip>
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {/* Password Strength Bar with onChangeScore callback */}
                <PasswordStrengthBar
                    className='password-strength-container'
                    password={password}
                    onChangeScore={(score) => setPasswordScore(score)} // Set password score
                />

                <div className="password-field">
                <Tooltip title="Re-enter the new password to confirm" placement="left">
                    <input
                        className="auth-input"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </Tooltip>
                    <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <input type="submit" className="auth-button" value="Change Password" />
            </form>
            <button className="auth-link-button" onClick={handleBackToLogin}>
                Back to Login
            </button>
        </div>
    );
};

export default ResetPasswordConfirm;
