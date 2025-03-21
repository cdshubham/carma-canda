import mongoose from "mongoose";
import Order from "@/models/OrderModels";
import { connect } from "@/db/connection";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connect();

  try {
    // Extract userId from params
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }
    const objectId = new mongoose.Types.ObjectId(id);

    const orders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(objectId), // ✅ Filter orders for the specific user
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
