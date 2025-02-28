import { NextResponse } from "next/server";
import { connect } from "@/db/connection";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connect();
    const db = mongoose.connection.db;
    const ordersCollection = db?.collection("orders");

    const data = await ordersCollection?.find({}).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
