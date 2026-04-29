import express from "express";
import Request from "../models/Request.js";
import BloodBank from "../models/BloodBank.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/requests  — protected
// hospitals see their own; banks see requests for their bank
router.get("/", protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "hospital") {
      filter.hospitalUsername = req.user.username;
    } else if (req.user.role === "bank") {
      const bank = await BloodBank.findOne({ username: req.user.username });
      if (bank) filter.bankId = bank._id;
    }
    const requests = await Request.find(filter).sort({ createdAt: -1 });
    // Attach bankName for frontend
    const banks = await BloodBank.find();
    const bankMap = Object.fromEntries(banks.map((b) => [String(b._id), b.name]));
    const result = requests.map((r) => ({
      ...r.toObject(),
      id: r._id,
      bankName: bankMap[String(r.bankId)] || "Unknown",
      time: new Date(r.createdAt).toLocaleTimeString(),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/requests  — hospital only
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "hospital")
      return res.status(403).json({ message: "Only hospitals can create requests" });

    const { bankId, bloodType, units, urgency, hospitalName } = req.body;
    if (!bankId || !bloodType || !units)
      return res.status(400).json({ message: "bankId, bloodType and units are required" });

    const bank = await BloodBank.findById(bankId);
    if (!bank) return res.status(404).json({ message: "Blood bank not found" });

    const newReq = await Request.create({
      bankId,
      hospitalUsername: req.user.username,
      hospitalName: hospitalName || req.user.username,
      bloodType,
      units: parseInt(units),
      urgency: urgency || "Normal",
    });

    res.status(201).json({ ...newReq.toObject(), id: newReq._id, bankName: bank.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/requests/:id  — bank only (approve / reject)
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "bank")
      return res.status(403).json({ message: "Only blood banks can update requests" });

    const { action } = req.body; // "approve" | "reject"
    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ message: "action must be 'approve' or 'reject'" });

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already resolved" });

    if (action === "approve") {
      // Deduct from inventory
      const bank = await BloodBank.findById(request.bankId);
      if (!bank) return res.status(404).json({ message: "Blood bank not found" });
      const current = bank.inventory.get(request.bloodType) || 0;
      bank.inventory.set(request.bloodType, Math.max(0, current - request.units));
      await bank.save();
    }

    request.status = action === "approve" ? "approved" : "rejected";
    await request.save();

    res.json({ ...request.toObject(), id: request._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
