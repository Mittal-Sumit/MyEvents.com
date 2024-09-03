import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';

const TextInput = ({ label, type, value, onChange, placeholder }) => (
    <Tooltip title={label} placement="left">
        <input
            className="auth-input"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </Tooltip>
);

TextInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default TextInput;
