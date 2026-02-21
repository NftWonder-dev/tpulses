// app/api/webhooks/lemonsqueezy/route.js - Handle LemonSqueezy webhooks
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle order_created event
    if (event.meta.event_name === "order_created") {
      const orderData = event.data;
      const customData =
        orderData.attributes.first_order_item?.custom_data || {};

      // Extract customer info
      const customerEmail = orderData.attributes.user_email;
      const customerName = orderData.attributes.user_name;
      const orderTotal = (orderData.attributes.total / 100).toFixed(2); // Convert cents to euros

      // Parse custom data (it's now a stringified array)
      let products = [];
      try {
        const customArray = JSON.parse(
          orderData.attributes.first_order_item?.custom || "[]",
        );
        const customDataParsed = customArray[0]
          ? JSON.parse(customArray[0])
          : {};
        products = customDataParsed.products || [];
      } catch (error) {
        console.error("Error parsing custom data:", error);
        // Fallback - try to get from old format
        products = customData?.products || [];
      }

      console.log("Products to email:", products);

      // Send download email
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail,
          customerName,
          products: products.map((p) => ({
            name: p.name,
            fileKey: p.fileKey,
          })),
          orderTotal,
        }),
      });

      console.log("✅ Order processed:", orderData.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
