import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashedPassword });
    const token = jwt.sign({ id: user._id, email: user.email }, "mapster_jwt_secret", { expiresIn: "1d" });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });
    const token = jwt.sign({ id: user._id, email: user.email }, "mapster_jwt_secret", { expiresIn: "1d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Error signing in", error: err });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, "mapster_jwt_secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

router.put("/update", authenticateToken, async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name: name || "", phone: phone || "" }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REPORT_EMAIL_USER,
        pass: process.env.REPORT_EMAIL_PASS,
      },
    });
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}&email=${email}`;
    await transporter.sendMail({
      from: process.env.REPORT_EMAIL_USER,
      to: email,
      subject: "Mapster Password Reset",
      text: `You requested a password reset. Click the link below to reset your password:\n${resetUrl}\nIf you did not request this, please ignore this email.`,
    });
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset email", error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return res.status(400).json({ message: "Missing required fields" });
  try {
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
});

export default router;
