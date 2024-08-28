import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password,
            });
            setMessage('Login successful!');
            navigate('/home'); // Redirect to home page after successful login
        } catch (error) {
            setMessage('Invalid credentials, please try again.');
            console.error('Error response:', error.response);
        }
    };

    return (
        <div className="auth-section">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Login;
