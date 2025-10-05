import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";
import profileIcon from "../assets/profile_icon.svg";
import aboutIcon from "../assets/about_us_icon.svg";
import darkIcon from "../assets/dark_mode_icon.svg";
import MapsterTopbar from "./MapsterTopbar";

function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("authToken");
      window.location.href = "/signin";
    }, 800);
  };

  return (
    <div className="settings-container">
      <MapsterTopbar />
      <div className="settings-topbar">
        <span className="settings-title">Account</span>
      </div>
      <div className="settings-list">
        <div className="settings-list-item" onClick={() => navigate("/account")}>
          <img src={profileIcon} alt="Profile" className="settings-icon" />
          <span className="settings-label">Profile</span>
          <span className="settings-arrow">&gt;</span>
        </div>
        <div className="settings-list-item" onClick={() => navigate("/aboutus")}>
          <img src={aboutIcon} alt="About us" className="settings-icon" />
          <span className="settings-label">About us</span>
          <span className="settings-arrow">&gt;</span>
        </div>
        <div className="settings-list-item">
          <img src={darkIcon} alt="Dark mood" className="settings-icon" />
          <span className="settings-label">Dark mode</span>
          <label className="settings-switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="settings-slider" />
          </label>
        </div>
      </div>
      <button className="settings-logout-btn" onClick={handleLogout} disabled={loading}>
        {loading ? <div className="loader" style={{ display: "inline-block", verticalAlign: "middle" }} /> : "log out"}
      </button>
    </div>
  );
}

export default SettingsPage;
