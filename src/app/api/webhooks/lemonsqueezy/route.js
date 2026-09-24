// app/api/webhooks/lemonsqueezy/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/lib/sanity";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Verify webhook signature
function verifyWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

// Get cart from Redis
async function getCartFromRedis(checkoutId) {
  const redisKey = `checkout:${checkoutId}`;

  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${redisKey}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch from Redis");
    return null;
  }

  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}

// Delete cart from Redis after processing
async function deleteCartFromRedis(checkoutId) {
  const redisKey = `checkout:${checkoutId}`;

  await fetch(`${UPSTASH_REDIS_REST_URL}/del/${redisKey}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
}

export async function POST(request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-signature");

    // Verify signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Only process order_created events
    if (data.meta.event_name !== "order_created") {
      return NextResponse.json({ success: true });
    }

    const order = data.data;
    const checkoutId = order.attributes.checkout_id; // Get checkout ID from order

    console.log("Order created:", order.id);
    console.log("Checkout ID:", checkoutId);

    // Get cart from Redis
    const cartData = await getCartFromRedis(checkoutId);

    if (!cartData) {
      console.error("Cart not found in Redis for checkout:", checkoutId);
      return NextResponse.json(
        { error: "Cart data not found" },
        { status: 400 },
      );
    }

    const { cartItems, customerEmail } = cartData;

    console.log(
      "Cart items from Redis:",
      cartItems.map((i) => i.name),
    );
    console.log("Customer email:", customerEmail);

    // Process all cart items
    const products = [];

    for (const item of cartItems) {
      console.log("Processing product:", item.name);

      // Query Sanity for product by variant ID
      const product = await client.fetch(
        `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { name, fileUrl }`,
        { variantId: item.lemonsqueezyVariantId.toString() },
      );

      if (!product) {
        console.warn(
          `Product not found for variant ${item.lemonsqueezyVariantId}`,
        );
        continue;
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
        console.error(`Failed to generate download URL for ${product.name}`);
        continue;
      }

      const { downloadUrl } = await downloadResponse.json();

      products.push({
        name: product.name,
        downloadUrl,
      });
    }

    if (products.length === 0) {
      console.error("No products were processed");
      return NextResponse.json(
        { error: "No products processed" },
        { status: 400 },
      );
    }

    console.log(
      "Sending email with products:",
      products.map((p) => p.name),
    );

    // Send ONE email with all products
    const emailResponse = await fetch("https://trimpulses.com/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        products, // ← All products in one email
      }),
    });

    if (!emailResponse.ok) {
      console.error("Failed to send email");
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully to:", customerEmail);

    // Clean up Redis after successful processing
    await deleteCartFromRedis(checkoutId);
    console.log("Cart deleted from Redis");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 },
    );
  }
}
