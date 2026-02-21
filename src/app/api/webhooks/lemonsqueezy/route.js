// app/api/webhooks/lemonsqueezy/route.js - Query Sanity for product details
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { client } from "@/lib/sanity";

export async function POST(request) {
  try {
    console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
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

      // Extract customer info
      const customerEmail = orderData.attributes.user_email;
      const customerName = orderData.attributes.user_name;
      const orderTotal = (orderData.attributes.total / 100).toFixed(2);

      // Get variant ID(s) from order
      const variantId = orderData.attributes.first_order_item?.variant_id?.toString();
      
      console.log('Order variant ID:', variantId);

      if (!variantId) {
        console.error('No variant ID in order');
        return NextResponse.json({ error: 'No variant ID' }, { status: 400 });
      }

      // Query Sanity for product with this variant ID
      const query = `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] {
        name,
        fileUrl
      }`;

      const product = await client.fetch(query, { variantId });

      console.log('Product from Sanity:', product);

      if (!product) {
        console.error('Product not found in Sanity for variant:', variantId);
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      if (!product.fileUrl) {
        console.error('Product missing fileUrl:', product);
        return NextResponse.json({ error: 'Product missing file' }, { status: 400 });
      }

      const products = [{
        name: product.name,
        fileKey: product.fileUrl,
      }];

      console.log('Products to email:', products);
      console.log('Email payload:', {
        customerEmail,
        customerName,
        products,
        orderTotal,
      });

      // Send download email
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail,
          customerName,
          products,
          orderTotal,
        }),
      });

      const emailResult = await emailResponse.json();
      console.log('Email API response:', emailResponse.status, emailResult);

      if (!emailResponse.ok) {
        console.error('Email sending failed:', emailResult);
      } else {
        console.log('✅ Email sent successfully!');
      }

      console.log('✅ Order processed:', orderData.id);
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
