import { NextResponse } from "next/server";
import Order from "@/models/OrderModels";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function POST(req: Request) {
  await connect();
  try {
    const { productId, size, customerId } = await req.json();
    console.log(customerId);

    const user = await User.findOne({ email: customerId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newOrder = new Order({
      userId: user._id,
      productId,
      size,
      createdAt: new Date(),
    });

    await newOrder.save();

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: {
          orderId: newOrder._id,
          customerId: user.email,
          productId: newOrder.productId,
          size: newOrder.size,
          date: new Date(newOrder.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
