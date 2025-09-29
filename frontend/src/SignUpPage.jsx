import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FullWidthButton from "./FullWidthButton";
import google_icon from "../assets/google.png";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        setSuccess("Signup successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sign-in-wrapper">
      <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Sign Up</h2>
      <div className="input-group">
        <input type="text" className="sign-in-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" className="sign-in-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="tel" className="sign-in-input" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
      <FullWidthButton text={loading ? "Signing up..." : "Sign Up"} onClick={handleSignUp} disabled={loading} />
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          <div className="loader" />
        </div>
      )}
      <div className="sign-in-links" style={{ marginBottom: 24 }}>
        <div className="or-sign-in">or Sign up with</div>
      </div>
      <FullWidthButton
        text={
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <img src={google_icon} alt="Google" style={{ width: 24, height: 24 }} />
            Sign up with Google
          </span>
        }
        onClick={() => {}}
      />
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <a
          href="#"
          className="forgot-password"
          onClick={(e) => {
            e.preventDefault();
            navigate("/signin");
          }}
        >
          Already have an account?
        </a>
      </div>
    </div>
  );
}

export default SignUpPage;
