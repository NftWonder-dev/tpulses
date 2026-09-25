// middleware.js - Blocks every admin API route unless the admin is logged in.
// New routes under /api/admin are protected automatically.
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/adminAuth";

// The login/logout route must stay reachable without a session.
const PUBLIC_ADMIN_ROUTES = new Set(["/api/admin/auth"]);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_ROUTES.has(pathname.replace(/\/$/, ""))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
