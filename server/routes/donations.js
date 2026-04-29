import express from "express";
import Donation from "../models/Donation.js";
import BloodBank from "../models/BloodBank.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/donations  — donor sees own donations
router.get("/", protect, async (req, res) => {
  try {
    const donations = await Donation.find({ donorUsername: req.user.username }).sort({ createdAt: -1 });
    res.json(donations.map((d) => ({ ...d.toObject(), id: d._id })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/donations  — donor schedules a donation
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "donor")
      return res.status(403).json({ message: "Only donors can schedule donations" });

    const { bankId, bloodType, units, date } = req.body;
    if (!bankId || !bloodType || !units || !date)
      return res.status(400).json({ message: "bankId, bloodType, units and date are required" });

    // 90-day cooldown check
    const last = await Donation.findOne({ donorUsername: req.user.username }).sort({ createdAt: -1 });
    if (last) {
      const diff = (new Date() - new Date(last.date)) / (1000 * 60 * 60 * 24);
      if (diff < 90)
        return res.status(400).json({
          message: `You must wait ${Math.ceil(90 - diff)} more day(s) before donating again.`,
        });
    }

    const bank = await BloodBank.findById(bankId);
    if (!bank) return res.status(404).json({ message: "Blood bank not found" });

    const donation = await Donation.create({
      donorUsername: req.user.username,
      bankId,
      bankName: bank.name,
      bloodType,
      units: parseInt(units),
      date,
    });

    res.status(201).json({ ...donation.toObject(), id: donation._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
