import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FullWidthButton from "./FullWidthButton";
import "./ForgotPasswordPage.css";
import MapsterHeader from "./MapsterHeader";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  async function handleReset() {
    setError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful! You can now sign in.");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setError(data.message || "Could not reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!email || !token) {
    return (
      <div className="forgot-wrapper">
        <MapsterHeader />
        <h2>Invalid or missing reset link.</h2>
      </div>
    );
  }

  return (
    <div className="forgot-wrapper">
      <MapsterHeader />
      <h3 className="forgot-title">Reset Password</h3>
      <p className="reset-desc">Enter your new password below.</p>
      <input
        type="password"
        className="forgot-input"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        className="forgot-input"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
      />
      <FullWidthButton text={loading ? "Resetting..." : "Reset Password"} onClick={handleReset} disabled={loading} />
      {success && (
        <div className="reset-info" style={{ color: "#388e3c" }}>
          {success}
        </div>
      )}
      {error && <div style={{ color: "#d32f2f", marginTop: 8, textAlign: "center" }}>{error}</div>}
    </div>
  );
}

export default ResetPasswordPage;
