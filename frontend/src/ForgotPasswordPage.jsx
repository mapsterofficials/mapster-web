import { useState } from "react";
import FullWidthButton from "./FullWidthButton";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  return (
    <div className="forgot-wrapper">
      <h3 className="forgot-title">Forgot Password</h3>
      <h2 className="reset-title">Reset your password</h2>
      <p className="reset-desc">
        Enter the email associated with your account and we'll send an email with instructions to reset your password.
      </p>
      <input type="email" className="forgot-input" placeholder="Email" disabled={emailSent} />
      <FullWidthButton text="Send Reset Instructions" onClick={() => setEmailSent(true)} />
      {emailSent && <div className="reset-info">A password reset link has been sent to your email address.</div>}
    </div>
  );
}

export default ForgotPasswordPage;
