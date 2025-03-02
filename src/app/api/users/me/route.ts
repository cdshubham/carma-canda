import { getDataFromToken } from "@/utils/TokenHandler";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModels";
import { connect } from "@/db/connection";

export async function GET(request: NextRequest) {
  await connect();
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
      mesaaage: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
