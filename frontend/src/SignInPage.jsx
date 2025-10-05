import mapster_logo from "../assets/mapster_logo.png";
import google_icon from "../assets/google.png";
import FullWidthButton from "./FullWidthButton";
import "./SignInPage.css";

import { useState } from "react";
import { API_BASE_URL } from "./constants";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignIn() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sign-in-wrapper">
      <img className="sign-in-logo" src={mapster_logo} alt="Logo" />
      <div className="input-group">
        <input type="email" className="sign-in-input" placeholder="Email id" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="sign-in-input"
            placeholder="Password"
            style={{ paddingRight: "36px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#a3a3a3",
            }}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
          </span>
        </div>
      </div>
      {error && <div style={{ color: "#d32f2f", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "#388e3c", marginBottom: 8 }}>{success}</div>}
      <FullWidthButton
        text={loading ? <div className="loader" style={{ display: "inline-block", verticalAlign: "middle" }} /> : "Sign in"}
        onClick={handleSignIn}
        disabled={loading}
      />
      <div className="sign-in-links">
        <a
          href="#"
          className="forgot-password"
          onClick={(e) => {
            e.preventDefault();
            navigate("/forgotpassword");
          }}
        >
          Forgot Password ?
        </a>
        <div className="or-sign-in">or Sign in with</div>
      </div>
      <FullWidthButton
        text={
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={google_icon} alt="Google" style={{ width: 24, height: 24 }} />
            Sign in with Google
          </span>
        }
        onClick={() => {
          window.location.href = `${API_BASE_URL}/auth/google`;
        }}
      />
      <a
        href="#"
        className="forgot-password"
        onClick={(e) => {
          e.preventDefault();
          navigate("/signup");
        }}
      >
        Don't have an account ?
      </a>
    </div>
  );
}

export default SignInPage;
