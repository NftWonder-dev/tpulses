// POST /api/account/login — emails a login link if the address has an account.
// Always answers the same way, so nobody can use this form to find out
// which email addresses are customers.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { customerExists } from "@/lib/sanityWrite";
import { createToken, LOGIN_LINK_MINUTES } from "@/lib/session";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://trimpulses.com";

export async function POST(request) {
  try {
    const { email } = await request.json();
    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!(await customerExists(cleanEmail))) {
      console.log("🔐 Login requested for unknown email (no email sent)");
      return NextResponse.json({ success: true });
    }

    const token = createToken(
      { email: cleanEmail, purpose: "login" },
      LOGIN_LINK_MINUTES * 60,
    );
    const loginUrl = `${BASE_URL}/api/account/verify?token=${encodeURIComponent(token)}`;

    const { error } = await resend.emails.send({
      from: "Trim Pulses <account@trimpulses.com>",
      to: [cleanEmail],
      subject: "Your Trim Pulses login link",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1e293b;">
          <img src="https://i.imgur.com/cF3l4cJ.png" alt="Trim Pulses" style="width: 100%; max-width: 520px; background: rgb(10,10,18); display: block; margin-bottom: 32px;" />
          <h1 style="font-size: 24px; color: #0f172a; margin: 0 0 16px;">Log in to your account</h1>
          <p style="color: #475569; line-height: 1.6;">Click the button below to access your Trim Pulses account and downloads.</p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: #22d3ee; color: #000; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Log in</a>
          </p>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">This link expires in ${LOGIN_LINK_MINUTES} minutes. If you didn't ask to log in, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Login email failed:", error);
      return NextResponse.json(
        { error: "Could not send email" },
        { status: 500 },
      );
    }

    console.log("🔐 Login link sent");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
