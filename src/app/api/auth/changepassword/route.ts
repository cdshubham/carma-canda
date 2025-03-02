import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { connect } from "@/db/connection";
import User from "@/models/userModels";

const passwordChangeSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  await connect();
  try {
    const body = await request.json();
    console.log(body);

    const validation = passwordChangeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { userId, currentPassword, newPassword } = validation.data;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 403 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password change error:", error);

    return NextResponse.json(
      { message: "An error occurred while changing the password" },
      { status: 500 }
    );
  }
}
