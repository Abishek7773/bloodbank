/**
 * seed.js – Run once to populate the database with initial data.
 * Usage: node seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import BloodBank from "./models/BloodBank.js";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const users = [
  // Hospitals
  { username: "apollo",   password: "pass", role: "hospital", name: "Apollo Hospital",          email: "apollo@hosp.in",   phone: "+91 9876543210", city: "Trichy" },
  // Blood Banks
  { username: "citybank", password: "pass", role: "bank",     name: "City Central Blood Bank",  email: "city@bank.in",     phone: "+91 431 2345678", city: "Trichy" },
  // Donors
  { username: "ravi",     password: "pass", role: "donor",    name: "Ravi Kumar",               email: "ravi@gmail.com",   phone: "+91 9876500001", city: "Trichy", bloodType: "O+" },
];

const banks = [
  {
    name: "City Central Blood Bank",
    address: "123 Main Street, Trichy",
    phone: "+91 431 2345678",
    email: "city@bank.in",
    city: "Trichy",
    username: "citybank",
    inventory: new Map([
      ["A+", 25], ["A-", 10], ["B+", 20], ["B-", 8],
      ["O+", 30], ["O-", 15], ["AB+", 12], ["AB-", 5],
    ]),
  },
  {
    name: "Regional Medical Center Blood Bank",
    address: "456 Hospital Road, Trichy",
    phone: "+91 431 2345679",
    email: "regional@bank.in",
    city: "Trichy",
    username: "",
    inventory: new Map([
      ["A+", 18], ["A-", 7], ["B+", 22], ["B-", 6],
      ["O+", 27], ["O-", 11], ["AB+", 9], ["AB-", 3],
    ]),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing
    await User.deleteMany({});
    await BloodBank.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users (passwords hashed by pre-save hook)
    for (const u of users) {
      await User.create(u);
      console.log(`👤 Created user: ${u.username} (${u.role})`);
    }

    // Create blood banks
    for (const b of banks) {
      await BloodBank.create(b);
      console.log(`🏥 Created bank: ${b.name}`);
    }

    console.log("\n✅ Seed complete!");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
