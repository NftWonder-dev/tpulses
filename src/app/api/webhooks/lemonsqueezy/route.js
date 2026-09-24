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
    const payload = await request.text();
    const signature = request.headers.get("x-signature");

    if (!verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    if (data.meta.event_name !== "order_created") {
      return NextResponse.json({ success: true });
    }

    const order = data.data;
    const customerEmail = order.attributes.customer_email;
    const variantId = order.attributes.first_order_item?.variant_id;

    console.log("Order created:", order.id);
    console.log("Variant ID:", variantId);

    if (!variantId) {
      console.error("No variant ID found");
      return NextResponse.json({ error: "No variant ID" }, { status: 400 });
    }

    // Query Sanity for product
    const product = await client.fetch(
      `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { name, fileUrl }`,
      { variantId: variantId.toString() },
    );

    if (!product) {
      console.error(`Product not found for variant ${variantId}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("Found product:", product.name);

    // Generate S3 signed URL
    const downloadResponse = await fetch(
      "https://trimpulses.com/api/download",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKey: product.fileUrl }),
      },
    );

    if (!downloadResponse.ok) {
      throw new Error("Failed to generate download URL");
    }

    const { downloadUrl } = await downloadResponse.json();

    // Send email
    const emailResponse = await fetch("https://trimpulses.com/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        products: [
          {
            name: product.name,
            downloadUrl,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}
