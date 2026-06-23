import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./SignUp.css";
import logo from "../../assets/Dysgraphia Logo.png";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Validation Function
  const validateForm = () => {
    // Full Name Validation
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    // Email Validation
    const allowedDomains = [
      "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
      "icloud.com", "live.com", "protonmail.com"
    ];

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

 

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    const domain = email.split("@")[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) {
      toast.error("Please use a valid email provider (e.g. gmail.com, yahoo.com)");
      return false;
    }
    // Age Validation
    if (Number(age) < 6 || Number(age) > 100) {
      toast.error("Please enter a valid age 6 or above");
      return false;
    }

    // Address Validation
    if (address.trim().length < 5) {
      toast.error("Address must be at least 5 characters");
      return false;
    }

    // Gender Validation
    if (!gender) {
      toast.error("Please select gender");
      return false;
    }

    // Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character"
      );
      return false;
    }

    // Confirm Password Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Run Validation
    if (!validateForm()) return;

    const userData = {
      name,
      email,
      password,
      age: Number(age),
      address,
      gender,
    };

    try {
      const response = await fetch(
        `${API_URL}api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="left-panel">
          <img
            src={logo}
            alt="GraphCure Logo"
            className="logo"
          />

          <p className="intro-text">
            Welcome to <strong>GraphCure</strong> – AI-powered
            system to diagnose dysgraphia. Join our platform to
            get early detection, personalized exercises, and
            progress tracking for children’s handwriting
            development.
          </p>
        </div>

        <div className="right-panel">
          <h2 className="title">Sign Up</h2>

          <p className="subtitle">
            Create your account to get started with our amazing
            platform.
          </p>

          <form
            className="login-form"
            onSubmit={handleSignup}
          >
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Age */}
            <input
              type="number"
              placeholder="Age"
              required
              value={age}
              min="3"
              max="100"
              onChange={(e) => setAge(e.target.value)}
            />

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Gender */}
            <select
              className="form-input"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Password */}
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="forms-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="input-wrapper">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                className="forms-input"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <button className="login-btn" type="submit">
              Create Account
            </button>
          </form>

          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;