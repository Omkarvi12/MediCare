import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

import "../styles/profile.css";

function Profile() {

  const { user, login, token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
  );
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);


  // ==========================
  // Fetch Profile
  // ==========================

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const response = await api.get(
          "/auth/profile"
        );

        const profile = response.data.user;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });

      } catch (error) {

        console.error(
          "Profile Fetch Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    if (token) {
      fetchProfile();
    }

  }, [token]);


  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ==========================
  // Edit Profile
  // ==========================

  const handleEdit = () => {

    setEditing(true);

  };


  // ==========================
  // Cancel Editing
  // ==========================

  const handleCancel = () => {

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });

    setEditing(false);

  };


  // ==========================
  // Update Profile
  // ==========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const response = await api.put(
        "/auth/profile",
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }
      );

      const updatedUser =
        response.data.user;

      // Update AuthContext
      login(token, updatedUser);

      // Update form
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });

      setEditing(false);

    } catch (error) {

      console.error(
        "Profile Update Error:",
        error
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================
  // Loading
  // ==========================

  if (loading) {

    return (
      <section className="profile-page">

        <div className="profile-container">

          <h2>
            Loading Profile...
          </h2>

        </div>

      </section>
    );

  }


  // ==========================
  // UI
  // ==========================

  return (

    <section className="profile-page">

      <div className="profile-container">


        {/* ==========================
            Profile Header
        ========================== */}

        <div className="profile-header">

          <div className="profile-avatar">

            {formData.name
              ? formData.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>

          <div>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your MediCare account
              information
            </p>

          </div>

        </div>


        {/* ==========================
            Profile Card
        ========================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your account details
              </p>

            </div>


            {!editing && (

              <button
                type="button"
                className="profile-edit-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>

            )}

          </div>


          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >


            {/* ==========================
                Name
            ========================== */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!editing}
                required
              />

            </div>


            {/* ==========================
                Email
            ========================== */}

            <div className="profile-field">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />

              <small>
                Email cannot be changed.
              </small>

            </div>


            {/* ==========================
                Phone
            ========================== */}

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!editing}
              />

            </div>


            {/* ==========================
                Address
            ========================== */}

            <div className="profile-field profile-field-full">

              <label>
                Address
              </label>

              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                readOnly={!editing}
                rows="4"
              />

            </div>


            {/* ==========================
                Action Buttons
            ========================== */}

            {editing && (

              <div className="profile-actions">

                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            )}

          </form>

        </div>


        {/* ==========================
            Account Information
        ========================== */}

        <div className="profile-account-card">

          <h2>
            Account Information
          </h2>


          <div className="account-info-row">

            <span>
              Account Type
            </span>

            <strong>
              {user?.role === "admin"
                ? "Administrator"
                : "Customer"}
            </strong>

          </div>


          <div className="account-info-row">

            <span>
              Member Since
            </span>

            <strong>

              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "MediCare Member"}

            </strong>

          </div>

        </div>

      </div>

    </section>

  );

}

export default Profile;
