import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import HeaderAuth from "./HeaderAuth";
import TextInput from "./Login/TextInput";
import PasswordField from "./Login/PasswordField";
import { handleLogin } from "../utils/authUtils";
import "./AuthStyles.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure handleLogin correctly saves token and user data
      await handleLogin(username, password, navigate);
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="go-back-home-button-container">
        <button
          className="go-back-home-button"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
      </div>
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
        <PasswordField
          password={password}
          setPassword={setPassword}
          label={"Enter Your Password"}
        />
        <div className="auth-keep-center">
          <Link to="/reset-password" className="auth-link">
            Forgot Password?
          </Link>
          <input type="submit" className="auth-button" value="Login" />
        </div>
      </form>
      <Link to="/register" className="auth-link">
        Don't have an account? Register here
      </Link>
    </div>
  );
};

export default Login;
