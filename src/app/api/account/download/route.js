// POST /api/account/download — fresh download link for a product the
// logged-in customer has bought. Anyone else gets a 403.
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionEmail } from "@/lib/session";
import { getOwnedProductFile } from "@/lib/sanityWrite";
import { generateDownloadUrl } from "@/lib/s3";

export async function POST(request) {
  try {
    const email = getSessionEmail(cookies());
    if (!email) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { productId } = await request.json();
    const product = await getOwnedProductFile(email, String(productId || ""));

    if (!product?.fileUrl) {
      return NextResponse.json({ error: "Not available" }, { status: 403 });
    }

    const downloadUrl = await generateDownloadUrl(product.fileUrl, 86400);
    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error("❌ Account download error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
