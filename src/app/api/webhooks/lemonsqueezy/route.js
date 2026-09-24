// app/api/webhooks/lemonsqueezy/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/lib/sanity";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function verifyWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

async function getCartFromRedis(redisKey) {
  console.log("📦 Fetching from Redis with key:", redisKey);

  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${redisKey}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  console.log("Redis response status:", response.status);
  const data = await response.json();
  console.log("Redis response data:", data);

  if (data.result) {
    const cartData = JSON.parse(JSON.parse(data.result)); // ← PARSE TWICE!
    console.log("✅ Cart retrieved from Redis:", cartData);
    return cartData;
  }

  console.log("❌ No cart data found in Redis");
  return null;
}

async function deleteCartFromRedis(redisKey) {
  await fetch(`${UPSTASH_REDIS_REST_URL}/del/${redisKey}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  console.log("🗑️ Deleted cart from Redis:", redisKey);
}

export async function POST(request) {
  try {
    console.log("🔔 WEBHOOK RECEIVED");

    const payload = await request.text();
    const signature = request.headers.get("x-signature");

    if (!verifyWebhookSignature(payload, signature)) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = JSON.parse(payload);
    console.log("Webhook event:", data.meta.event_name);

    if (data.meta.event_name !== "order_created") {
      console.log("⏭️ Skipping non-order_created event");
      return NextResponse.json({ success: true });
    }

    const order = data.data;
    console.log("📋 Order ID:", order.id);
    console.log("💰 Order total:", order.attributes.total);
    console.log("📧 Customer email:", order.attributes.customer_email);

    // Get first variant ID
    const firstVariantId = order.attributes.first_order_item?.variant_id;
    console.log("🔍 First variant ID:", firstVariantId);

    if (!firstVariantId) {
      console.error("❌ No variant ID found");
      return NextResponse.json({ error: "No variant ID" }, { status: 400 });
    }

    // Get cart from Redis
    const redisKey = `cart:${firstVariantId}`;
    const cartData = await getCartFromRedis(redisKey);

    if (!cartData) {
      console.error("❌ Cart not found in Redis for key:", redisKey);
      console.error("Available keys would start with 'cart:'");
      return NextResponse.json({ error: "Cart not found" }, { status: 400 });
    }

    const { cartItems, customerEmail } = cartData;
    console.log("📦 Cart items count:", cartItems.length);
    console.log(
      "📦 Cart items:",
      cartItems.map((i) => i.name),
    );

    // Process all products
    const products = [];

    for (const item of cartItems) {
      console.log(`\n🔄 Processing: ${item.name}`);
      console.log(`   Variant ID: ${item.lemonsqueezyVariantId}`);
      console.log(`   File URL: ${item.fileUrl}`);

      // Query Sanity
      console.log(`   📌 Querying Sanity...`);
      const product = await client.fetch(
        `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { name, fileUrl }`,
        { variantId: item.lemonsqueezyVariantId.toString() },
      );

      if (!product) {
        console.error(`   ❌ Product not found in Sanity`);
        continue;
      }

      console.log(`   ✅ Found in Sanity: ${product.name}`);

      // Generate download URL
      console.log(`   🔗 Generating S3 URL...`);
      const downloadResponse = await fetch(
        "https://trimpulses.com/api/download",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileKey: product.fileUrl }),
        },
      );

      if (!downloadResponse.ok) {
        console.error(`   ❌ Failed to generate download URL`);
        continue;
      }

      const { downloadUrl } = await downloadResponse.json();
      console.log(`   ✅ Download URL generated`);

      products.push({
        name: product.name,
        downloadUrl,
      });
    }

    console.log(`\n📧 Prepared products for email:`, products.length);

    if (products.length === 0) {
      console.error("❌ No products to email");
      return NextResponse.json({ error: "No products" }, { status: 400 });
    }

    // Send email
    console.log(`📤 Sending email to: ${customerEmail}`);
    const emailResponse = await fetch("https://trimpulses.com/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        products,
      }),
    });

    if (!emailResponse.ok) {
      console.error("❌ Failed to send email");
      const errorData = await emailResponse.text();
      console.error("Email API error:", errorData);
      throw new Error("Failed to send email");
    }

    console.log("✅ Email sent successfully");

    // Cleanup
    await deleteCartFromRedis(redisKey);

    console.log("\n✅ WEBHOOK COMPLETED SUCCESSFULLY\n");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
