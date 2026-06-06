import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Verify baseline credentials before generating OTP
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Create a stateless cryptographic hash with a 5-minute expiration window
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins from now
    const secret = process.env.NEXTAUTH_SECRET || "fallback";
    
    // We hash the OTP + Expiration + Secret. 
    // The client never sees the raw OTP from the server, only this un-forgeable hash.
    const dataString = `${otp}.${expires}.${secret}`;
    const hash = crypto.createHash("sha256").update(dataString).digest("hex");

    // 4. Send the Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ALT_SYS Security" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "ALT_SYS Authorization Code",
      text: `Your secure access code is: ${otp}\n\nThis code expires in 5 minutes.`,
    });

    // 5. Return the validation parameters to the client
    return NextResponse.json({ hash, expires });

  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: "Failed to process 2FA request." }, { status: 500 });
  }
}