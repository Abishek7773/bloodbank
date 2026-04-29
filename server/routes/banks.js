import express from "express";
import BloodBank from "../models/BloodBank.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper: convert Mongoose Map to plain object for JSON
const bankToJSON = (b) => {
  const obj = b.toObject({ virtuals: false });
  obj.id = obj._id;           // keep numeric-style "id" for frontend compat
  obj.inventory = Object.fromEntries(b.inventory);
  return obj;
};

// GET /api/banks  — public
router.get("/", async (_req, res) => {
  try {
    const banks = await BloodBank.find().sort({ name: 1 });
    res.json(banks.map(bankToJSON));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/banks/:id  — public
router.get("/:id", async (req, res) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) return res.status(404).json({ message: "Blood bank not found" });
    res.json(bankToJSON(bank));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/banks/:id/inventory  — protected (bank staff only)
router.put("/:id/inventory", protect, async (req, res) => {
  try {
    const bank = await BloodBank.findById(req.params.id);
    if (!bank) return res.status(404).json({ message: "Blood bank not found" });

    // Only the bank's own user can edit its inventory
    if (req.user.username !== bank.username && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden – not your blood bank" });
    }

    const { inventory } = req.body; // e.g. { "A+": 25, "B-": 5 }
    if (!inventory || typeof inventory !== "object")
      return res.status(400).json({ message: "inventory object required" });

    for (const [bt, val] of Object.entries(inventory)) {
      bank.inventory.set(bt, Math.max(0, parseInt(val) || 0));
    }
    await bank.save();
    res.json(bankToJSON(bank));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
