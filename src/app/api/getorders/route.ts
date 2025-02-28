import { NextResponse } from "next/server";
import Order from "@/models/OrderModels";
import { connect } from "@/db/connection";

connect();
export async function GET() {
  try {
    console.log("asdas");

    const orders = await Order.find().populate("userId");
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}
