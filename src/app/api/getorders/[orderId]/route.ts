import { NextResponse } from "next/server";
import { connect } from "@/db/connection";
import Order from "@/models/OrderModels";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connect();
    const { orderId } = params;

    // Find the order and populate with full customer details
    const orderResults = await Order.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(orderId) },
      },
      {
        $lookup: {
          from: "users", // The collection name in MongoDB
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
    ]);

    // Aggregation returns an array, so check if it's empty
    if (!orderResults || orderResults.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Get the first (and should be only) result
    const order = orderResults[0];
    const userDetails = order.userDetails || {};

    // Transform the data to include both order and customer details
    const formattedResponse = {
      order: {
        orderId: order._id.toString(),
        trackingId: order.trackingId || "",
        dnNumber: order.dnNumber || "",
        deliveryDate: order.deliveryDate || null,
        createdAt: order.createdAt,
        items: (order.items || []).map((item) => ({
          productId: item.productId || "",
          productType: item.productType || "",
          colour: item.colour || "",
          quantity: item.quantity || 0,
          measurements: item.measurements || {},
        })),
      },
      customer: userDetails
        ? {
            id: userDetails._id ? userDetails._id.toString() : null,
            name: `${userDetails.first_name || ""} ${userDetails.last_name || ""}`.trim(),
            email: userDetails.email || "",
            phone: userDetails.phone || "",
            gender: userDetails.gender || "",
            address: userDetails.address || {},
            spouse: userDetails.spouse || {},
            anniversary: userDetails.anniversary || null,
            children: userDetails.children || [],
            birthday: userDetails.birthday || null,
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data: formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order details",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
