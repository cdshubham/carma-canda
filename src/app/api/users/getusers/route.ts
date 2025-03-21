import { NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function GET(request) {
  await connect();

  try {
    const allUsers = await User.find({ role: { $ne: "admin" } });

    return NextResponse.json(
      { success: true, data: allUsers },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
