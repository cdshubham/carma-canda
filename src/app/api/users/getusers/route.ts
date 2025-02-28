import { NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

connect();
export async function GET() {
  try {
    const customers = await User.find({ role: "user" });
    console.log("Customer", customers);

    return NextResponse.json(
      { success: true, data: customers },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}
