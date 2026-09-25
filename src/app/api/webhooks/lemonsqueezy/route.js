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
    const customProductIds = data.meta.custom_data?.product_ids;

    console.log("✅ Order ID:", order.id);
    console.log("📧 Email:", customerEmail);
    console.log("👤 Name:", customerName);
    console.log("💰 Total:", orderTotal);
    console.log("🔍 Variant ID:", variantId);
    console.log("🛒 Cart product IDs:", customProductIds);

    let products;

    if (customProductIds) {
      // Cart checkout: the product list was set by /api/cart-checkout.
      const ids = [...new Set(customProductIds.split(",").filter(Boolean))];

      console.log("📌 Querying Sanity for cart products...");
      products = await client.fetch(
        `*[_type == "product" && _id in $ids] { _id, name, price, fileUrl }`,
        { ids },
      );

      if (products.length !== ids.length) {
        console.error("❌ Some cart products not found in Sanity:", ids);
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      // Checkout links can carry extra custom data, so make sure the amount
      // paid (before discounts and tax) covers every product we deliver.
      const expectedCents = products.reduce(
        (sum, p) => sum + Math.round((p.price || 0) * 100),
        0,
      );
      if (order.attributes.subtotal < expectedCents) {
        console.error(
          "❌ Paid subtotal does not cover products:",
          order.attributes.subtotal,
          "<",
          expectedCents,
        );
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }
    } else {
      // Single-product checkout: look the product up by its variant.
      if (!variantId) {
        console.error("❌ No variant ID");
        return NextResponse.json({ error: "No variant ID" }, { status: 400 });
      }

      console.log("📌 Querying Sanity...");
      const product = await client.fetch(
        `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { name, fileUrl }`,
        { variantId: variantId.toString() },
      );

      if (!product) {
        console.error("❌ Product not found in Sanity");
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      products = [product];
    }

    const missingFile = products.find((p) => !p.fileUrl);
    if (missingFile) {
      console.error("❌ Product has no file:", missingFile.name);
      return NextResponse.json({ error: "Product file missing" }, { status: 500 });
    }

    console.log(
      "✅ Delivering:",
      products.map((p) => `${p.name} (${p.fileUrl})`).join(", "),
    );

    // Send email with CORRECT FORMAT
    console.log("📤 Sending email...");
    const emailResponse = await fetch("https://www.trimpulses.com/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        customerEmail,
        customerName, // ← NOW INCLUDED
        products: products.map((p) => ({
          name: p.name,
          fileKey: p.fileUrl,
        })),
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
