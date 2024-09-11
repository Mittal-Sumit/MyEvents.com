import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = isAuthenticated();
  const userRole = sessionStorage.getItem("userRole"); // Assuming you store the role in sessionStorage

  console.log("ProtectedRoute, isAuthenticated:", auth, "Role:", userRole);

  // If not authenticated, redirect to login
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user does not match, redirect to Home
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  // If authenticated and role matches, allow access
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // Make role optional for routes that don't require a specific role
};

export default ProtectedRoute;
