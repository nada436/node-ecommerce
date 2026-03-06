import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },

  otp:        { type: String },
  otpExpiry:  { type: Date },

  favorites:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  deletedAt:  { type: Date },
}, { timestamps: true });

export const User_model = mongoose.model("User", userSchema);