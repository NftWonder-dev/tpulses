// app/api/webhooks/lemonsqueezy/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/lib/sanity";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

function verifyWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export async function POST(request) {
  try {
    console.log("🔔 WEBHOOK FIRED");

    const payload = await request.text();
    const signature = request.headers.get("x-signature");

    if (!verifyWebhookSignature(payload, signature)) {
      console.error("❌ Invalid signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = JSON.parse(payload);
    console.log("📋 Event:", data.meta.event_name);

    if (data.meta.event_name !== "order_created") {
      console.log("⏭️ Not order_created, skipping");
      return NextResponse.json({ success: true });
    }

    const order = data.data;
    const customerEmail = order.attributes.user_email;
    const customerName = order.attributes.user_name || "Customer"; // ← ADD THIS
    const orderTotal = (order.attributes.total / 100).toFixed(2); // ← ADD THIS
    const variantId = order.attributes.first_order_item?.variant_id;

    console.log("✅ Order ID:", order.id);
    console.log("📧 Email:", customerEmail);
    console.log("👤 Name:", customerName);
    console.log("💰 Total:", orderTotal);
    console.log("🔍 Variant ID:", variantId);

    if (!variantId) {
      console.error("❌ No variant ID");
      return NextResponse.json({ error: "No variant ID" }, { status: 400 });
    }

    // Query Sanity
    console.log("📌 Querying Sanity...");
    const product = await client.fetch(
      `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { name, fileUrl }`,
      { variantId: variantId.toString() },
    );

    if (!product) {
      console.error("❌ Product not found in Sanity");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("✅ Found product:", product.name, "File:", product.fileUrl);

    // Send email with CORRECT FORMAT
    console.log("📤 Sending email...");
    const emailResponse = await fetch("https://trimpulses.com/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        customerName, // ← NOW INCLUDED
        products: [
          {
            name: product.name,
            fileKey: product.fileUrl, // ← Changed from downloadUrl to fileKey
          },
        ],
        orderTotal, // ← NOW INCLUDED
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("❌ Email failed:", emailResponse.status, errorText);
      throw new Error("Failed to send email");
    }

    console.log("✅ Email sent successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
