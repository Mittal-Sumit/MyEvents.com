import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar'; 
import { toast } from 'react-toastify'; 
import Header from './Header'; 
import TextInput from './Login/TextInput'; // Reusing TextInput component
import PasswordToggle from './Login/PasswordToggle'; // Reusing PasswordToggle component
import './AuthStyles.css'; 

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams(); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordScore, setPasswordScore] = useState(0); 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (passwordScore < 3) { 
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
            <Header /> 
            <Typography variant="h5" gutterBottom>
                Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="password-field">
                    <TextInput
                        label="Password strength should be good or above"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordToggle
                        showPassword={showPassword}
                        togglePasswordVisibility={() => setShowPassword(prevState => !prevState)}
                    />
                </div>
                
                <PasswordStrengthBar
                    className='password-strength-container'
                    password={password}
                    onChangeScore={(score) => setPasswordScore(score)} 
                />

                <div className="password-field">
                    <TextInput
                        label="Re-enter the new password to confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <PasswordToggle
                        showPassword={showConfirmPassword}
                        togglePasswordVisibility={() => setShowConfirmPassword(prevState => !prevState)}
                    />
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
