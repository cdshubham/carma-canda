import { NextResponse } from "next/server";
import { connect } from "@/db/connection";
import Order from "@/models/OrderModels";

export async function GET() {
  try {
    await connect();

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // The collection name in MongoDB (not the model name)
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          trackingId: 1,
          dnNumber: 1,
          deliveryDate: 1,
          items: 1,
          createdAt: 1,
          "userDetails.first_name": 1,
          "userDetails.last_name": 1,
          "userDetails.email": 1,
        },
      },
    ]);

    const formattedOrders = orders.map((order) => {
      const userDetails = order.userDetails || {};

      return {
        orderId: order._id.toString(),
        customerId: userDetails._id ? userDetails._id.toString() : null,
        customerName:
          `${userDetails.first_name || ""} ${userDetails.last_name || ""}`.trim() ||
          "Unknown Customer",
        customerEmail: userDetails.email || "",
        products: (order.items || []).map((item) => ({
          productId: item.productId || "",
          productType: item.productType || "",
          colour: item.colour || "",
          quantity: item.quantity || 0,
        })),
        date: order.createdAt,
        totalItems: (order.items || []).reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        ),
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
