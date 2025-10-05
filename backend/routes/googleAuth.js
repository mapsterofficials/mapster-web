import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Start Google OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), async (req, res) => {
  const { displayName, emails } = req.user;
  const email = emails[0].value;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: displayName,
      email,
      password: "", // No password for Google users
    });
  } else if (user.password && user.password !== "") {
    // User exists and has password, must use email/password
    return res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/signin?error=${encodeURIComponent("Please sign in using email and password")}`
    );
  }
  // User exists (no password) or was just created, allow Google login
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/google-auth-callback?token=${token}`);
});

export default router;
