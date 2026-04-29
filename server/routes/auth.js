import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ message: "username, password and role are required" });

    const user = await User.findOne({ username: username.trim(), role });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: signToken(user), user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, name, email, phone, city, bloodType } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ message: "username, password and role are required" });

    const exists = await User.findOne({ username: username.trim() });
    if (exists) return res.status(409).json({ message: "Username already taken" });

    const user = await User.create({ username: username.trim(), password, role, name, email, phone, city, bloodType });
    res.status(201).json({ token: signToken(user), user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me  (validate stored token)
router.get("/me", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: user.toSafeObject() });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
