import { NextResponse } from "next/server";
import Order from "@/models/OrderModels";
import { connect } from "@/db/connection";

export async function GET() {
  await connect();
  try {
    console.log("Fetching orders");

    const orders = await Order.find().populate("userId");

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      customerId: order.userId?.email || "Unknown",
      productId: order.productId,
      size: order.size || "N/A",
      date: new Date(order.createdAt).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }));

    return NextResponse.json(
      { success: true, data: formattedOrders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}
