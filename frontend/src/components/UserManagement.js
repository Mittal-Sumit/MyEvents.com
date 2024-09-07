/* src/components/UserManagement.js */
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Use the configured Axios instance
import { toast } from "react-toastify";
import "./UserManagement.css"; // Ensure you have a CSS file for styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:8000/api/users/"
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axiosInstance.patch(
        `http://localhost:8000/api/users/update-role/${userId}/`,
        {
          role: newRole,
        }
      );
      toast.success("User role updated successfully");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Error updating user role");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role === "user" ? (
                  <button onClick={() => updateUserRole(user.id, "admin")}>
                    Make Admin
                  </button>
                ) : (
                  <button onClick={() => updateUserRole(user.id, "user")}>
                    Revoke Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
