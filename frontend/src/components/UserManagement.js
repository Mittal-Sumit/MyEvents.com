import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserRole } from "../api/userManagementApi"; // Import functions from userManagementApi.js
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid"; // MUI DataGrid
import { TextField, MenuItem, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Use navigate for navigation
import "./UserManagement.css"; // Ensure you have a CSS file for styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    handleFetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, roleFilter, users]);

  const handleFetchUsers = async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
      handleFetchUsers(); // Refresh the user list
    } catch (error) {
      // Error already handled in userManagementApi.js
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const columns = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    {
      field: "actions",
      headerName: "Action",
      width: 220,
      renderCell: (params) => {
        const { id, role } = params.row;
        return role === "user" ? (
          <Button
            variant="contained"
            onClick={() => handleUpdateUserRole(id, "manager")}
          >
            Make Manager
          </Button>
        ) : role === "manager" ? (
          <Button
            variant="contained"
            onClick={() => handleUpdateUserRole(id, "user")}
          >
            Revoke Manager
          </Button>
        ) : (
          <span>Admin (Cannot Change)</span>
        );
      },
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-management-container">
      <h2>User Management</h2>

      {/* Go Back to Home Button */}
      <Button
        sx={{
          ":hover": {
            bgcolor: "primary.main",
            color: "white",
          },
        }}
        color="white"
        onClick={() => navigate("/home")}
        style={{ marginBottom: "20px" }}
      >
        Go Back to Home
      </Button>

      <div className="filters">
        <TextField
          label="Search by Username"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />
        <TextField
          label="Filter by Role"
          select
          variant="outlined"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-input"
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
      </div>

      <div className="datagrid-container-um">
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight={false} // Disable auto height to make it scrollable
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default UserManagement;
