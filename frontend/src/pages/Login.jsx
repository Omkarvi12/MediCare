import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      // Save token and user information
      login(
        response.data.token,
        response.data.user
      );

      //alert("Login Successful ✅");

      // ==========================
      // Role Based Redirect
      // ==========================

      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      //alert(
      //  error.response?.data?.message ||
      //  "Login Failed"
      //);

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="auth">

      <div className="auth-container">

        <h2>Login</h2>

        <p>Welcome Back to MediCare</p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="bottom-text">

          Don't have an account?

          <Link to="/register">
            {" "}
            Register
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Login;