// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: [true, "Please provide a username"] },
//   email: {
//     type: String,
//     required: [true, "Please provide an email"],
//     unique: true,
//   },
//   password: { type: String, required: [true, "Please provide a password"] },
//   phoneNumber: { type: String },
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   kids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kid" }],
//   createdAt: { type: Date, default: Date.now },
//   address: { type: String },
// });

// const User = mongoose.models?.users || mongoose.model("users", userSchema);

// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    birthday: { type: Date }, // Birthday of spouse
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip_code: { type: String, required: true },
      country: { type: String, required: true },
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
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: true,
        },
        birthday: { type: Date, required: true },
      },
    ],
    social_media: [
      {
        platform: { type: String, required: true },
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
