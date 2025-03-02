// models/Kid.js
import mongoose from "mongoose";

const kidSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  birthday: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Kid = mongoose.models?.kids || mongoose.model("kids", kidSchema);

export default Kid;
