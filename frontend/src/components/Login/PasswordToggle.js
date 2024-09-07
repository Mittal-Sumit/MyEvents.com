/* src/components/Login/PasswordToggle.js */
import React from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordToggle = ({ showPassword, togglePasswordVisibility }) => (
  <span
    className="toggle-login-password"
    onClick={togglePasswordVisibility}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === "Enter" && togglePasswordVisibility()}
    aria-label="Toggle Password Visibility"
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
);

PasswordToggle.propTypes = {
  showPassword: PropTypes.bool.isRequired,
  togglePasswordVisibility: PropTypes.func.isRequired,
};

export default PasswordToggle;
