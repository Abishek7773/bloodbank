import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    bankId:          { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
    hospitalUsername: { type: String, required: true },
    hospitalName:    { type: String, default: "" },
    bloodType:       { type: String, required: true },
    units:           { type: Number, required: true, min: 1 },
    urgency:         { type: String, enum: ["Normal", "Urgent", "Critical"], default: "Normal" },
    status:          { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
