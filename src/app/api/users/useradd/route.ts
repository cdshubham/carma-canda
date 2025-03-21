import { connect } from "@/db/connection";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  await connect();
  try {
    const req = await request.json();

    const { username, email, password, phone } = req;
    console.log(password, email, phone);

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const nameParts = username.trim().split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    try {
      await axios.post(`${process.env.PUBLIC_BASE_URL}/api/email`, {
        sendTo: email,
        password,
      });
      console.log("Welcome email sent successfully.");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return NextResponse.json({
      message: "User registered successfully saved",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.error("Error in POST /api/users", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
