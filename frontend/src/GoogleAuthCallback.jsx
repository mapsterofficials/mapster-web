import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const errorMsg = params.get("error");
    if (token) {
      localStorage.setItem("authToken", token);
      window.location.replace("/home");
    } else if (errorMsg) {
      window.location.replace(`/signin?error=${encodeURIComponent(errorMsg)}`);
    } else {
      window.location.replace(`/signin?error=${encodeURIComponent("Unknown error during Google sign-in.")}`);
    }
  }, []);

  return <div>Signing in with Google...</div>;
}
