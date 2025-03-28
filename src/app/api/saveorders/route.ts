import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/OrderModels";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function POST(req: Request) {
  await connect();

  try {
    const { userId, items } = await req.json();
    console.log("📩 Received Order Data:", { userId, items });

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Find user by userId
    const user = await User.findById(userId);
    console.log("👤 Found User:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure items array is not empty
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Generate unique trackingId
    const trackingId = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create a new order
    const newOrder = new Order({
      userId: user._id,
      items,
      trackingId,
      createdAt: new Date(),
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "✅ Order placed successfully",
        order: {
          orderId: newOrder._id,
          trackingId: newOrder.trackingId,
          customerId: user._id,
          customerEmail: user.email,
          items: newOrder.items,
          createdAt: newOrder.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 Order Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
