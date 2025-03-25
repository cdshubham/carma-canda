import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    birthday: { type: Date }, // Birthday of spouse
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip_code: { type: String },
      country: { type: String },
    },
    spouse: {
      first_name: { type: String },
      last_name: { type: String },
      gender: { type: String, enum: ["male", "female", "other"] },
      birthday: { type: Date }, // Birthday of spouse
    },
    anniversary: { type: Date }, // Anniversary date
    children: [
      {
        first_name: { type: String },
        last_name: { type: String },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: true,
        },
        birthday: { type: Date },
      },
    ],
    social_media: [
      {
        platform: { type: String },
        url: { type: String },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models?.users || mongoose.model("users", userSchema);
export default User;
