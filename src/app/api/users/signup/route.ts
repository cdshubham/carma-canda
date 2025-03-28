import { connect } from "@/db/connection";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  await connect();
  try {
    const req = await request.json();
    const {
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    } = req;

    // Split username into first and last name
    const nameParts = username.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || ""; // Handle multiple words as last name

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // Send a welcome email
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email`, {
        sendTo: email,
      });
      console.log("Welcome email sent successfully.");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error("Error in POST /api/users", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
