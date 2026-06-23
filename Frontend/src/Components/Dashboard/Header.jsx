import React, { useEffect, useState } from "react";
import { FaEllipsisH ,  FaSignOutAlt } from "react-icons/fa"; // example icon
import Image from "../../assets/images.jpg"; // example profile image
import { useNavigate } from "react-router-dom";

const Header = () => {
   const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Time in hh:mm:ss AM/PM
      const time = now.toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Date in Thu, 24 October 2024
      const date = now.toLocaleDateString("en-PK", {
        weekday: "short",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(time);
      setCurrentDate(date);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const storedUser = localStorage.getItem("userData");
    // console.log("Header storedUser:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
      // console.log("Header userName state:", userName);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="topbar">
      {/* LEFT CORNER */}
      <div className="topbar-left">
        <div className="icon-wrapper">
          <div className="icon-circle">
            <img src={Image} alt="Profile" className="profile-img" />
          </div>
        </div>
        <span className="topbar-name"> {user ? user.name.toUpperCase() : "ALI KHAN"}</span>
      </div>

      {/* CENTER */}
      <div className="topbar-center">
      </div>

      {/* RIGHT CORNER */}
       <div className="topbar-right">
        <div className="time-graph-container">
          <div className="time-graph-line">
            <span className="time">{currentTime}</span>
             <div className="date">{currentDate}</div>
            <span className="separator">|</span>
            <span className="graphucre">Graphcure</span>
             <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={14} />
              Logout
            </button>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Header;