import React from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css'; // We will create this CSS file for styling

const AuthPage = () => {
    return (
        <div className="auth-container">
            <Login />
            <Register />
        </div>
    );
};

export default AuthPage;
