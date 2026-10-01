// POST /api/account/name — the logged-in customer updates their display name.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionEmail } from "@/lib/session";
import { setCustomerName } from "@/lib/sanityWrite";

export async function POST(request) {
  try {
    const email = getSessionEmail(cookies());
    if (!email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { name } = await request.json();
    const cleanName = String(name || "").trim().replace(/\s+/g, " ");

    if (cleanName.length < 1 || cleanName.length > 80) {
      return NextResponse.json(
        { error: "Name must be between 1 and 80 characters" },
        { status: 400 },
      );
    }

    await setCustomerName(email, cleanName);
    return NextResponse.json({ name: cleanName });
  } catch (error) {
    console.error("❌ Update name error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
