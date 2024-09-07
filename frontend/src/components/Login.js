// src/components/Login.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import HeaderAuth from "./HeaderAuth";
import TextInput from "./Login/TextInput";
import PasswordToggle from "./Login/PasswordToggle";
import { handleLogin } from "../utils/authUtils";
import "./AuthStyles.css";
import PasswordField from "./Login/PasswordField";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password, navigate);
  };

  return (
    <div className="auth-container">
      <HeaderAuth />
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
        <PasswordField password={password} setPassword={setPassword} />
        <div className="auth-keep-center">
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
