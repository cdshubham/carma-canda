import { NextResponse } from "next/server";
import RegisterUserEmail from "@/emails/RegisterUserEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { sendTo }: { sendTo: string } = await req.json();

    if (!sendTo) {
      return NextResponse.json(
        { error: "Email recipient is required" },
        { status: 400 }
      );
    }

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: sendTo,
      subject: "Welcome to Carma Canada!!",
      react: RegisterUserEmail(),
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
