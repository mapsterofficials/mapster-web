import React, { useState, useEffect } from "react";
import "./AccountPage.css";
import { useNavigate } from "react-router-dom";
import MapsterHeader from "./MapsterHeader";

function AccountPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
    fetch(`${process.env.VITE_API_URL}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.user?.name || "");
        setEmail(data.user?.email || "");
        setMobile(data.user?.phone || "");
      })
      .catch(() => {});
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${process.env.VITE_API_URL}/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone: mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="account-container">
      <MapsterHeader />
      <div className="account-topbar">
        <span className="account-title">Profile</span>
      </div>
      <form className="account-form" onSubmit={handleSave}>
        <label className="account-label">Name</label>
        <input className="account-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <label className="account-label">Email</label>
        <input className="account-input" type="email" value={email} readOnly placeholder="Email" />
        <label className="account-label">Mobile Number</label>
        <input
          className="account-input"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile Number"
        />
        {success && <div style={{ color: "#388e3c", marginBottom: 8 }}>{success}</div>}
        {error && <div style={{ color: "#d32f2f", marginBottom: 8 }}>{error}</div>}
        <div className="account-btn-row">
          <button type="button" className="account-cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="account-save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccountPage;
