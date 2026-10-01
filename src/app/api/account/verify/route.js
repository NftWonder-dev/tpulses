// GET /api/account/verify?token=... — the link in the login email lands here.
// A valid link becomes a 30-day session cookie, then the customer goes to /account.
import { NextResponse } from "next/server";
import {
  readToken,
  createToken,
  SESSION_COOKIE,
  SESSION_DAYS,
} from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const url = new URL(request.url);
  const payload = readToken(url.searchParams.get("token"), "login");

  if (!payload) {
    return NextResponse.redirect(new URL("/account?error=expired", url.origin));
  }

  const sessionToken = createToken(
    { email: payload.email, purpose: "session" },
    SESSION_DAYS * 24 * 60 * 60,
  );

  const response = NextResponse.redirect(new URL("/account", url.origin));
  response.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true, // not readable by page JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return response;
}
