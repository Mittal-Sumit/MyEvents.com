import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import PasswordToggle from '../Login/PasswordToggle'; // Reuse the PasswordToggle component

const ConfirmPasswordInput = ({
    confirmPassword,
    setConfirmPassword,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    label,
}) => (
    <div className="password-field">
        <Tooltip title={label} placement="left">
            <input
                className="auth-input"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </Tooltip>
        <PasswordToggle 
            showPassword={showConfirmPassword} 
            togglePasswordVisibility={toggleConfirmPasswordVisibility} 
        />
    </div>
);

ConfirmPasswordInput.propTypes = {
    confirmPassword: PropTypes.string.isRequired,
    setConfirmPassword: PropTypes.func.isRequired,
    showConfirmPassword: PropTypes.bool.isRequired,
    toggleConfirmPasswordVisibility: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default ConfirmPasswordInput;
