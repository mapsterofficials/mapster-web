import { useState } from "react";
import FullWidthButton from "./FullWidthButton";
import "./ForgotPasswordPage.css";
import MapsterHeader from "./MapsterHeader";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailSent(true);
      } else {
        setError(data.message || "Could not send reset instructions.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-wrapper">
      <MapsterHeader />
      <h3 className="forgot-title">Forgot Password</h3>
      <h2 className="reset-title">Reset your password</h2>
      <p className="reset-desc">
        Enter the email associated with your account and we'll send an email with instructions to reset your password.
      </p>
      <input
        type="email"
        className="forgot-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={emailSent || loading}
      />
      <FullWidthButton text={loading ? "Sending..." : "Send Reset Instructions"} onClick={handleReset} disabled={emailSent || loading} />
      {emailSent && <div className="reset-info">A password reset link has been sent to your email address.</div>}
      {error && <div style={{ color: "#d32f2f", marginTop: 8, textAlign: "center" }}>{error}</div>}
    </div>
  );
}

export default ForgotPasswordPage;
