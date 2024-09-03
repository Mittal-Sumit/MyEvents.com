// src/utils/auth.js

export const isAuthenticated = () => {
    const token = sessionStorage.getItem('accessToken');
    console.log('Checking authentication, token present:', !!token);
    return !!token; // Returns true if the token exists
};
