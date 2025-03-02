import { connect } from "@/db/connection";
import { NextRequest, NextResponse } from "next/server";

import { signIn } from "@/auth";

export async function POST(request: NextRequest) {
  await connect();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });

    return NextResponse.json({
      message: "Login successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
