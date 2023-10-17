import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./css/userList.css";
import Loader from "../Loader/loader";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  let token = localStorage.getItem("Token");
  let decodeToken = jwtDecode(token);
  const userId = decodeToken.id;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/getAll", {
        headers: { auth: token },
      });
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      let token = localStorage.getItem("Token");
      await axios.delete(`http://localhost:8080/auth/deleteUser/${id}`, {
        headers: { auth: token },
      });
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  function convertTimeFormate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = new Date(timestamp).toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
    });
    return date.toString() !== "Invalid Date" ? formattedDate : "";
  }

  return (
    <div className="user-list-container">
      <h1 className="user-list-title">Total Users Count {users.length}</h1>
      {loading && <Loader />}
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>IsActive</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="user-item" key={user._id}>
              <td>{user._id}</td>
              <td>
                {user.isActive ? (
                  <span style={{ color: "green" }}>● Online</span>
                ) : (
                  <span style={{ color: "red" }}>● Offline</span>
                )}
              </td>
              <td>{convertTimeFormate(user.createdAt)}</td>
              <td>{convertTimeFormate(user.lastLogin)}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user._id !== userId && (
                  <button
                    className="delete-button"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
