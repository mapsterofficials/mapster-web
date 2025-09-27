import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportIssuePage.css";
import MapsterHeader from "./MapsterHeader";

function ReportIssuePage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) {
      setError("Please describe your issue before sending.");
      return;
    }
    setLoading(true);
    setSuccessMsg("");
    try {
      // Get user info from backend
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.user) throw new Error("Could not fetch user info");
      const { name, email } = data.user;
      // Send report to backend
      const reportRes = await fetch("http://localhost:5000/api/report-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, name, email }),
      });
      if (!reportRes.ok) throw new Error("Failed to send report");
      setDescription("");
      setSuccessMsg("Thank you for your report! Updates regarding your issue will be sent to your email.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-issue-container">
      <MapsterHeader />
      <h2 className="report-issue-title">Report an Issue</h2>
      <p className="report-issue-desc">Please describe your issue below. Your name and email will be recorded when you send this report.</p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="report-issue-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          placeholder="Describe your issue here..."
          disabled={loading}
        />
        <button type="submit" className="report-issue-send-btn" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <div style={{ color: "#d32f2f", marginTop: "8px", textAlign: "center" }}>{error}</div>}
        {successMsg && <div style={{ color: "#388e3c", marginTop: "12px", textAlign: "center", fontWeight: 500 }}>{successMsg}</div>}
      </form>
    </div>
  );
}

export default ReportIssuePage;
