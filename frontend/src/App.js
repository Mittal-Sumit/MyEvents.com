import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EventList from "./components/EventList";
import GuestListReports from "./components/GuestListReports";
import EventManagement from "./components/EventManagement";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import UserManagement from "./components/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Routes>
        {/* Home is public, no authentication required */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Event List accessible to everyone after login */}
        <Route
          path="/event-list"
          element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          }
        />

        {/* Role-based protected routes */}
        <Route
          path="/event-management"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <EventManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GuestListReports />
            </ProtectedRoute>
          }
        />

        {/* Password reset routes */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password-confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        />
      </Routes>
    </Router>
  );
};

export default App;
