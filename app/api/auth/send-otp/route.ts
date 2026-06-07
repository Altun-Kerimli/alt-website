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
    // Fallback to 'onboarding@resend.dev' if EMAIL_FORM isn't explicitly set in your variables
    const senderEmail = process.env.EMAIL_FORM || "onboarding@resend.dev";
    const recipientEmail = process.env.ADMIN_EMAIL as string;

    const { error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      subject: "ALT_SYS Authorization Code",
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 12px; max-width: 450px;">
          <h2 style="color: #dc2626; margin-top: 0;">[ALT_SYS] 2FA Verification</h2>
          <p style="font-size: 14px; color: #333;">Your secure administrative access token is:</p>
          <div style="font-size: 28px; font-weight: bold; tracking: 4px; padding: 12px; background: #fff; border: 1px solid #ddd; border-radius: 8px; text-align: center; margin: 16px 0; color: #000;">
            ${otp}
          </div>
          <p style="font-size: 11px; color: #666; margin-bottom: 0;">This security matrix token will self-destruct in 5 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Engine Error:", error);
      return NextResponse.json({ error: "Failed to transmit email payload." }, { status: 500 });
    }

    return NextResponse.json({ hash, expires });

  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json({ error: "Internal system error." }, { status: 500 });
  }
}