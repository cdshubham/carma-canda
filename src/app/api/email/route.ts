import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import RegisterUserEmail from "@/emails/RegisterUserEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { sendTo, password } = await request.json();

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: sendTo,
      subject: "Welcome to Carma Canada! 🎉",
      react: RegisterUserEmail({ password }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
