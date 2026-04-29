import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorUsername: { type: String, required: true },
    bankId:        { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
    bankName:      { type: String, default: "" },
    bloodType:     { type: String, required: true },
    units:         { type: Number, required: true, min: 1 },
    date:          { type: String, required: true }, // ISO date string e.g. "2025-04-29"
    status:        { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
