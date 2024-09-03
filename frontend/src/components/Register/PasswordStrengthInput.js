import React from 'react';
import PropTypes from 'prop-types';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Tooltip } from '@mui/material';
import PasswordToggle from '../Login/PasswordToggle'; // Reuse the PasswordToggle component

const PasswordStrengthInput = ({
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    setPasswordScore,
    label,
}) => (
    <div className="password-field">
        <Tooltip title={label} placement="left">
            <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </Tooltip>
        <PasswordToggle 
            showPassword={showPassword} 
            togglePasswordVisibility={togglePasswordVisibility} 
        />
        <PasswordStrengthBar
            className='password-strength-container'
            password={password}
            onChangeScore={(score) => setPasswordScore(score)}
        />
    </div>
);

PasswordStrengthInput.propTypes = {
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired,
    showPassword: PropTypes.bool.isRequired,
    togglePasswordVisibility: PropTypes.func.isRequired,
    setPasswordScore: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default PasswordStrengthInput;
