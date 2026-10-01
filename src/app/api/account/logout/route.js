// POST /api/account/logout — removes the session cookie.
import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/account", request.url), 303);
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
