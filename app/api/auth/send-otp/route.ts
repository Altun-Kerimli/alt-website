import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Verify baseline credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    const secret = process.env.NEXTAUTH_SECRET || "fallback";
    const dataString = `${otp}.${expires}.${secret}`;
    const hash = crypto.createHash("sha256").update(dataString).digest("hex");

    // 3. Send via Resend
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Note: You may need to verify your domain in Resend dashboard later
      to: process.env.ADMIN_EMAIL as string,
      subject: "ALT_SYS Authorization Code",
      html: `<p>Your secure access code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ hash, expires });

  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}