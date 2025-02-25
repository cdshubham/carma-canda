import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/db/connection";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Headers:", req.headers);
    console.log("Webhook ID:", req.headers.get("x-shopify-webhook-id"));

    const response = NextResponse.json({ message: "Shopify request received" });

    (async () => {
      await connect();
      const db = mongoose.connection.db;
      const ordersCollection = db.collection("orders");
      await ordersCollection.insertOne(body);
      console.log("Order saved in MongoDB:", body.id);
    })();

    return response;
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
