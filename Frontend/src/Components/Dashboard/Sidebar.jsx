import React, { useState, useEffect } from "react";
import { FaHome, FaFileAlt, FaCog, FaUpload, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Dysgraphia Logo.png";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Upload");
  const [openModule, setOpenModule] = useState(false);
  const [openExercises, setOpenExercises] = useState({}); // { 1: true, 2: false }
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:5000/api/modules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) setModules(data.modules);
      })
      .catch((err) => console.error("Modules fetch error:", err));
  }, []);

  const handleLogout = () => navigate("/");

  const handleMenuClick = (menu, path) => {
    setActiveMenu(menu);
    navigate(path);
  };

  const toggleExercises = (moduleId) => {
    setOpenExercises((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo-container">
        <img
          src={Logo}
          alt="Logo"
          className="logo"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Upload Picture */}
      <div
        className={`menu-item ${activeMenu === "Upload" ? "active" : ""}`}
        onClick={() => handleMenuClick("Upload", "/dashboard")}
      >
        <FaUpload className="icon" />
        <span>Upload Picture</span>
        <span className="arrow">›</span>
      </div>

      {/* Module Dropdown */}
      <div
        className={`menu-item ${activeMenu.includes("Module") ? "active" : ""}`}
        onClick={() => setOpenModule(!openModule)}
      >
        <FaHome className="icon" />
        <span>Module</span>
        <FaChevronDown size={10} className={`arrow ${openModule ? "rotate" : ""}`} />
      </div>

      {openModule && (
        <div className="submenu">
          {modules.map((module) => (
            <div key={module.id}>
              {/* Module Row */}
              <div
                className="submenu-module-row"
                onClick={() => {
                  toggleExercises(module.id);
                }}
              >
                <span>Module {module.id}</span>
                {openExercises[module.id] ? (
                  <FaChevronDown size={9} />
                ) : (
                  <FaChevronRight size={9} />
                )}
              </div>

              {/* Exercises under this module */}
              {openExercises[module.id] && (
                <div className="submenu-exercises">
                  {module.exercises.map((ex, index) => (
                    <div
                      key={ex.id}
                      className={`submenu-exercise-item ${
                        activeMenu === ex.id ? "active-exercise" : ""
                      }`}
                      onClick={() => {
                        setActiveMenu(ex.id);
                        navigate(`/dashboard/module/${module.id}/exercise/${index + 1}`);
                      }}
                    >
                      Exercise {index + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Records */}
      <div
        className={`menu-item ${activeMenu === "Records" ? "active" : ""}`}
        onClick={() => handleMenuClick("Records", "/dashboard/records")}
      >
        <FaFileAlt className="icon" />
        <span>Records</span>
        <span className="arrow">›</span>
      </div>

      {/* Settings */}
      <div
        className={`menu-item ${activeMenu === "Settings" ? "active" : ""}`}
        onClick={() => handleMenuClick("Settings", "/dashboard/Settings")}
      >
        <FaCog className="icon" />
        <span>Settings</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
};

export default Sidebar;