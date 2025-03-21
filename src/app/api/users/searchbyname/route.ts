import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function GET(request: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 3) {
      return NextResponse.json({ users: [] });
    }

    // Search for users where first_name or last_name matches the query (case-insensitive)
    const users = await User.find({
      $or: [
        { first_name: { $regex: query, $options: "i" } },
        { last_name: { $regex: query, $options: "i" } },
      ],
    })
      .select("first_name last_name email")
      .limit(10);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
