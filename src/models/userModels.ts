import mongoose, { Document, Model } from "mongoose";

interface IChild {
  first_name: string;
  last_name?: string;
  gender: "male" | "female" | "other";
  birthday?: Date;
}

interface ISpouse {
  first_name: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  birthday?: Date;
}

interface ISocialMedia {
  platform: string;
  url: string;
}

interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export interface IUser extends Document {
  first_name: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  email: string;
  phone?: string;
  password: string;
  birthday?: Date;
  address?: IAddress;
  spouse?: ISpouse;
  anniversary?: Date;
  children?: IChild[];
  social_media?: ISocialMedia[];
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: { type: Date }, // Birthday of user
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip_code: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    spouse: {
      first_name: { type: String, trim: true },
      last_name: { type: String, trim: true },
      gender: { type: String, enum: ["male", "female", "other"] },
      birthday: { type: Date },
    },
    anniversary: { type: Date },
    children: [
      {
        first_name: { type: String, required: true, trim: true },
        last_name: { type: String, trim: true },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: true,
        },
        birthday: { type: Date },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
    social_media: [
      {
        platform: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
  },
  {
    timestamps: true,
    // Add these options for better performance
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.models?.users || mongoose.model("users", userSchema);
export default User;
