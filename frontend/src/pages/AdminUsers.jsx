import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import "../styles/adminUsers.css";

function AdminUsers() {

  const navigate = useNavigate();
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Users
  // ==========================

  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);

    } catch (error) {

      console.error("Users fetch error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch users"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================
  // Load Users
  // ==========================

  useEffect(() => {

    if (token) {
      fetchUsers();
    }

  }, [token]);


  // ==========================
  // Delete User
  // ==========================

  const handleDelete = async (id, role) => {

    if (role === "admin") {

      toast.error("Admin account cannot be deleted");

      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User deleted successfully");

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== id
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to delete user"
      );

    }
  };


  // ==========================
  // Loading
  // ==========================

  if (loading) {

    return (
      <div className="admin-users-center">

        <h2>Loading Users...</h2>

      </div>
    );

  }


  // ==========================
  // Error
  // ==========================

  if (error) {

    return (
      <div className="admin-users-center">

        <h2>Something went wrong</h2>

        <p className="admin-users-error">
          {error}
        </p>

        <button
          className="admin-users-button"
          onClick={fetchUsers}
        >
          Try Again
        </button>

      </div>
    );

  }


  return (
    <div className="admin-users-page">

      {/* ==========================
          HEADER
      ========================== */}

      <header className="admin-users-header">

        <div>

          <h1>
            Manage Users
          </h1>

          <p>
            View and manage registered MediCare users
          </p>

        </div>


        <button
          className="admin-users-back"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      {/* ==========================
          SUMMARY
      ========================== */}

      <div className="admin-users-summary">

        <div className="summary-card">

          <span>
            Total Users
          </span>

          <strong>
            {users.length}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Normal Users
          </span>

          <strong>
            {
              users.filter(
                (user) => user.role === "user"
              ).length
            }
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Admins
          </span>

          <strong>
            {
              users.filter(
                (user) => user.role === "admin"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* ==========================
          USERS TABLE
      ========================== */}

      <div className="admin-users-table-container">

        <table>

          <thead>

            <tr>

              <th>#</th>

              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Address</th>

              <th>Role</th>

              <th>Action</th>

            </tr>

          </thead>


          <tbody>

            {users.map((user, index) => (

              <tr key={user._id}>

                <td>
                  {index + 1}
                </td>

                <td className="user-name">
                  {user.name}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.phone || "N/A"}
                </td>

                <td>
                  {user.address || "N/A"}
                </td>

                <td>

                  <span
                    className={
                      user.role === "admin"
                        ? "role-admin"
                        : "role-user"
                    }
                  >
                    {user.role.toUpperCase()}
                  </span>

                </td>

                <td>

                  {user.role === "admin" ? (

                    <span className="protected-text">
                      Protected
                    </span>

                  ) : (

                    <button
                      className="delete-user-button"
                      onClick={() =>
                        handleDelete(
                          user._id,
                          user.role
                        )
                      }
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

    </div>
  );
}

export default AdminUsers;
