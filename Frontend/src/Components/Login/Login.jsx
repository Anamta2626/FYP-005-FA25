import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/Dysgraphia Logo.png";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password
    };

    try {
      const response = await fetch(`${API_URL}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok && data.code === 200) {
        // ✅ store the actual user object
        localStorage.setItem("userData", JSON.stringify(data.object));
        localStorage.setItem("token", data.object.token || ""); // if backend provides token
        // console.log("Stored token in localStorage:", data.object.token);


        // console.log("Stored userData in localStorage:", data.object);

        toast.success(data.message);
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
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
          <img src={logo} alt="GraphCure Logo" className="logo" />
          <p className="intro-text">
            Welcome to <strong>GraphCure</strong>. An AI-powered platform that helps identify
            dysgraphia early and supports children with personalized handwriting improvement
            exercises.
          </p>
        </div>

        <div className="right-panel">
          <h2 className="title">LogIn</h2>
          <p className="subtitle">
            Welcome back! Please enter your credentials to access your account.
          </p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

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

            <div className="options">
              <label>
                <input
                  type="checkbox"
                // onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Remember me
              </label>
            </div>

            <button className="login-btn" type="submit">
              Login
            </button>
          </form>

          <p className="register-text">
            Don’t have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;