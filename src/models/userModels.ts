import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Please provide a username"] },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please provide a password"] },
  phoneNumber: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  kids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kid" }],
  createdAt: { type: Date, default: Date.now },
  address: { type: String },
});

const User = mongoose.models?.users || mongoose.model("users", userSchema);

export default User;
