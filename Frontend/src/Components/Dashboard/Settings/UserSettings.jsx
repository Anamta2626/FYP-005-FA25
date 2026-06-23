import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./update.css";

const Settings = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    password: "",
    old_password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Auto-fill form from localStorage ────────────────────────────────────
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")) || {};
    setFormData({
      name: storedUser.name || "",
      email: storedUser.email || "",
      age: storedUser.age || "",
      gender: storedUser.gender || "",
      address: storedUser.address || "",
      password: "", // never prefill password
      old_password: "",
      confirm_password: ""
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirm_password) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
        address: formData.address
      };

      // Only include password fields if user wants to change it
      if (formData.old_password && formData.password) {
        payload.old_password = formData.old_password;
        payload.password = formData.password;
      }

      const response = await fetch(`${API_URL}api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload), // fixed: payload, not full formData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        // localStorage update karein taake updated data turant reflect ho
        const storedUser = JSON.parse(localStorage.getItem("userData")) || {};
        localStorage.setItem(
          "userData",
          JSON.stringify({ ...storedUser, ...payload })
        );
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h2 className="settings-title">Update Profile Settings</h2>

        <form className="settings-form" onSubmit={handleSubmit}>
          <h5 className="section-title">Account Information</h5>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <h5 className="section-title mt-4">Address</h5>
          <div className="form-group full-width">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <h5 className="section-title mt-4">Security</h5>
          <div className="form-row">
            <div className="form-group">
              <label>Old Password</label>
              <div className="input-with-icon">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  placeholder="Enter old password"
                  value={formData.old_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-btn-inline"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="input-with-icon">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-btn-inline"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm new password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="eye-btn-inline"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="btn-wrapper">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;