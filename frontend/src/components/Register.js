/* src/components/Register.js */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import HeaderAuth from "./HeaderAuth";
import TextInput from "./Login/TextInput";
import PasswordStrengthInput from "./Register/PasswordStrengthInput";
import ConfirmPasswordInput from "./Register/ConfirmPasswordInput";
import { handleRegistration } from "../utils/authReg";
import "./AuthStyles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordScore < 3) {
      toast.error("Password is too weak. Please use a stronger password.");
      return;
    }
    handleRegistration(username, email, password, navigate);
  };

  return (
    <div className="auth-container">
      <HeaderAuth />
      <div className="auth-go-back">
        <button
          className="go-back-home-button"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
      </div>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Enter a unique username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          label="Enter a valid email address"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordStrengthInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          setPasswordScore={setPasswordScore}
          label="Password strength should be good or above"
        />
        <ConfirmPasswordInput
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showConfirmPassword={showConfirmPassword}
          toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
          label="Re-enter the password to confirm"
        />
        <input type="submit" className="auth-button" value="Register" />
      </form>
      <Link to="/login" className="auth-link">
        Back to Login
      </Link>
    </div>
  );
};

export default Register;
