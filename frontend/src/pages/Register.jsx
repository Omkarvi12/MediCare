import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

import "../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Error message
  const [errorMessage, setErrorMessage] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");


  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Remove error when user starts typing
    setErrorMessage("");

  };


  // ==========================
  // Register User
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      // Show success message
      setSuccessMessage(
        response.data.message ||
        "Registration successful"
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {

      console.error(
        "Registration Error:",
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
        "Unable to create account. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <section className="auth">

      <div className="auth-container">

        <h2>Create Account</h2>

        <p>
          Join MediCare Today
        </p>


        {/* ==========================
            Error Message
        ========================== */}

        {errorMessage && (

          <div className="auth-error">
            {errorMessage}
          </div>

        )}


        {/* ==========================
            Success Message
        ========================== */}

        {successMessage && (

          <div className="auth-success">
            {successMessage}
          </div>

        )}


        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />


          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Register"}

          </button>

        </form>


        <p className="bottom-text">

          Already have an account?

          <Link to="/login">
            {" "}Login
          </Link>

        </p>

      </div>

    </section>

  );

}

export default Register;