import { connect } from "@/db/connection";
import User from "@/models/userModels";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { UserRequestBody } from "@/types/userSchema.types";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req);

    const { username, email, password }: UserRequestBody = req;
    console.log(req);
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
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
