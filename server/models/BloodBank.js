import mongoose from "mongoose";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const inventorySchema = new mongoose.Schema(
  Object.fromEntries(bloodTypes.map((bt) => [bt.replace("+", "Plus").replace("-", "Minus"), { type: Number, default: 0 }])),
  { _id: false }
);

const bloodBankSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    address:  { type: String, default: "" },
    phone:    { type: String, default: "" },
    email:    { type: String, default: "" },
    city:     { type: String, default: "" },
    username: { type: String, default: "" }, // links to User
    inventory: {
      type: Map,
      of: Number,
      default: () =>
        new Map(bloodTypes.map((bt) => [bt, 0])),
    },
  },
  { timestamps: true }
);

export default mongoose.model("BloodBank", bloodBankSchema);
