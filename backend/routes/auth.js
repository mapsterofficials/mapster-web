import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    console.log("Checking for existing user with email:", email);
    console.log("checking for existing user with name:", name);
    console.log("checking for existing user with phone number:", phone);
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

export default router;
