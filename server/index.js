import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes     from "./routes/auth.js";
import bankRoutes     from "./routes/banks.js";
import requestRoutes  from "./routes/requests.js";
import donationRoutes from "./routes/donations.js";

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/",           (_req, res) => res.json({ status: "Blood Bank API running 🩸" }));
app.use("/api/auth",      authRoutes);
app.use("/api/banks",     bankRoutes);
app.use("/api/requests",  requestRoutes);
app.use("/api/donations", donationRoutes);

// 404 catch-all
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// ── Connect DB & Start ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
