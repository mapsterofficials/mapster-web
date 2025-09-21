import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SplashScreen from "./SplashScreen";
import JoinPage from "./JoinPage";
import SignInPage from "./SignInPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import SettingsPage from "./SettingsPage";
import SignUpPage from "./SignUpPage";
import HomePage from "./HomePage";
import AboutUsPage from "./AboutUsPage";
import ChooseDestinationPage from "./ChooseDestinationPage";
import AccountPage from "./AccountPage";
import NavigationPage from "./NavigationPage";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 800);
    const timer2 = setTimeout(() => setShowSplash(false), 1000);

    const token = localStorage.getItem("authToken");
    if (token && window.location.pathname !== "/home") {
      window.location.replace("/home");
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (showSplash) {
    return (
      <div className={`splash-wrapper ${fadeOut ? "fade-out" : ""}`}>
        <SplashScreen />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/choosedestination" element={<ChooseDestinationPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
