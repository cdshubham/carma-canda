import { compare } from "bcryptjs";
import { connect } from "@/db/connection";
import User from "@/models/userModels";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user._id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      memberSince: user.createdAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
