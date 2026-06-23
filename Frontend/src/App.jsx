

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/SignUp/SignUp";
import Dashboard from "./Components/Dashboard/Dashboard";
import LandingPage from "./Components/LandingPage/FirstPage";
import AboutUs_Intro from "./Components/LandingPage/AboutUs_Intro";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  useEffect(() => {
    AOS.init({ once: true }); // once: true → animation ek baar scroll ke time
  }, []);

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutUs" element={<AboutUs_Intro />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;

