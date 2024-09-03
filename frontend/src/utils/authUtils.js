// src/utils/authUtils.js

import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';

export const handleLogin = async (username, password, navigate) => {
    try {
        const response = await axiosInstance.post('users/login/', {
            username,
            password,
        });

        const { access, refresh } = response.data;
        const tokenPayload = JSON.parse(atob(access.split('.')[1]));
        const userRole = tokenPayload.role;

        sessionStorage.setItem('accessToken', access);
        sessionStorage.setItem('refreshToken', refresh);
        toast.success('Login successful!');

        if (userRole === 'admin') {
            navigate('/admin-dashboard');
        } else {
            navigate('/home');
        }
    } catch (error) {
        toast.error('Invalid credentials, please try again.');
        console.error('Error:', error);
    }
};
