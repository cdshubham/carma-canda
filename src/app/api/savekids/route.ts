import { NextResponse } from "next/server";
import Kid from "@/models/KidModels";
import { connect } from "@/db/connection";

export async function POST(req) {
  try {
    await connect();

    const { userId, kids } = await req.json();

    if (!userId || !Array.isArray(kids) || kids.length === 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const savedKids = await Kid.insertMany(
      kids.map((kid) => ({ ...kid, userId }))
    );

    return NextResponse.json(
      { success: true, data: savedKids },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving kids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
