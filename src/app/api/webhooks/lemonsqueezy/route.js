// app/api/webhooks/lemonsqueezy/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/lib/sanity";
import { saveOrder, writeClient } from "@/lib/sanityWrite";
import { Resend } from "resend";

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Internal "new sale" email to sales@. Never throws: a failed alert must not
// affect the customer email, the order save or the webhook response.
async function sendSaleAlert({ order, customerEmail, customerName, products, customerEmailSent, orderSaved }) {
  try {
    const attrs = order.attributes;
    const total = (attrs.total / 100).toFixed(2);
    const currency = attrs.currency || "EUR";
    const amount = currency === "EUR" ? `€${total}` : `${total} ${currency}`;
    const prefix = attrs.test_mode ? "[TEST] " : "";
    const dashboardUrl = attrs.identifier
      ? `https://app.lemonsqueezy.com/orders/${encodeURIComponent(attrs.identifier)}`
      : null;

    const { error } = await resend.emails.send({
      from: "Trim Pulses <orders@trimpulses.com>",
      to: ["sales@trimpulses.com"],
      replyTo: customerEmail,
      subject: `${prefix}New sale: ${amount} – ${customerEmail}`,
      html: `
        <h2>${prefix}New sale</h2>
        <p><strong>Order #:</strong> ${escapeHtml(attrs.order_number)} (LS id ${escapeHtml(order.id)})</p>
        <p><strong>Date:</strong> ${escapeHtml(
          new Date(attrs.created_at).toLocaleString("en-GB", {
            timeZone: "Europe/Lisbon",
            dateStyle: "medium",
            timeStyle: "short",
          }),
        )}</p>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)} &lt;${escapeHtml(customerEmail)}&gt;</p>
        <p><strong>Total:</strong> ${escapeHtml(total)} ${escapeHtml(currency)}</p>
        <p><strong>Products:</strong></p>
        <ul>${products.map((p) => `<li>${escapeHtml(p.name)}</li>`).join("")}</ul>
        <p><strong>Customer email sent:</strong> ${
          customerEmailSent
            ? "Yes"
            : '<span style="color:#dc2626;font-weight:bold;">NO – customer did not get their download links</span>'
        }</p>
        <p><strong>Order saved to account:</strong> ${orderSaved ? "Yes" : "NO"}</p>
        ${dashboardUrl ? `<p><a href="${dashboardUrl}">View order in LemonSqueezy</a></p>` : ""}
      `,
    });

    if (error) {
      console.error("⚠️ Sale alert NOT sent:", error.message || error);
    } else {
      console.log("📣 Sale alert sent to sales@");
    }
  } catch (alertError) {
    console.error("⚠️ Sale alert NOT sent:", alertError.message);
  }
}

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
    const customerName = order.attributes.user_name || "Customer";
    const orderTotal = (order.attributes.total / 100).toFixed(2);
    const variantId = order.attributes.first_order_item?.variant_id;
    const cartId = data.meta.custom_data?.cart_id;
    const customProductIds = data.meta.custom_data?.product_ids;

    console.log("✅ Order ID:", order.id);
    console.log("📧 Email:", customerEmail);
    console.log("👤 Name:", customerName);
    console.log("💰 Total:", orderTotal);
    console.log("🔍 Variant ID:", variantId);
    console.log("🛒 Cart ID:", cartId);
    console.log("🛒 Cart product IDs:", customProductIds);

    let products;
    let pendingCartId;

    if (cartId || customProductIds) {
      // Cart checkout: the product list was set by /api/cart-checkout,
      // either in a pendingCart document (cart_id) or inline (product_ids).
      let ids;

      if (cartId) {
        // Only accept our own private pendingCart documents, since this
        // document is deleted once the order is saved.
        const cart =
          typeof cartId === "string" && cartId.startsWith("carts.")
            ? await writeClient.fetch(
                `*[_id == $id && _type == "pendingCart"][0] { _id, productIds }`,
                { id: cartId },
              )
            : null;

        if (!cart) {
          console.error("❌ Pending cart not found in Sanity:", cartId);
          return NextResponse.json(
            { error: "Product not found" },
            { status: 404 },
          );
        }

        pendingCartId = cart._id;
        ids = [...new Set((cart.productIds || []).filter(Boolean))];
      } else {
        ids = [...new Set(customProductIds.split(",").filter(Boolean))];
      }

      console.log("📌 Querying Sanity for cart products...");
      products = await client.fetch(
        `*[_type == "product" && _id in $ids] { _id, name, price, fileUrl }`,
        { ids },
      );

      if (products.length !== ids.length) {
        console.error("❌ Some cart products not found in Sanity:", ids);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
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
        // CHANGED: now also fetches _id, so the order can reference the product
        `*[_type == "product" && lemonsqueezyVariantId == $variantId][0] { _id, name, fileUrl }`,
        { variantId: variantId.toString() },
      );

      if (!product) {
        console.error("❌ Product not found in Sanity");
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      products = [product];
    }

    const missingFile = products.find((p) => !p.fileUrl);
    if (missingFile) {
      console.error("❌ Product has no file:", missingFile.name);
      return NextResponse.json(
        { error: "Product file missing" },
        { status: 500 },
      );
    }

    console.log(
      "✅ Delivering:",
      products.map((p) => `${p.name} (${p.fileUrl})`).join(", "),
    );

    console.log("📤 Sending email...");
    // A failed customer email no longer stops here: we still save the order
    // and alert sales@ once, then answer 500 below so LemonSqueezy retries.
    let customerEmailSent = false;
    try {
      const emailResponse = await fetch(
        "https://www.trimpulses.com/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": WEBHOOK_SECRET,
          },
          body: JSON.stringify({
            customerEmail,
            customerName,
            products: products.map((p) => ({
              name: p.name,
              fileKey: p.fileUrl,
            })),
            orderTotal,
          }),
        },
      );

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error("❌ Email failed:", emailResponse.status, errorText);
      } else {
        customerEmailSent = true;
        console.log("✅ Email sent successfully");
      }
    } catch (emailError) {
      console.error("❌ Email failed:", emailError.message);
    }

    // Only alert sales@ the first time we see this order (not on retries).
    let isNewOrder = false;
    let orderSaved = false;
    try {
      isNewOrder = !(await writeClient.fetch(`defined(*[_id == $id][0]._id)`, {
        id: `orders.ls-${order.id}`,
      }));
    } catch (checkError) {
      console.error("⚠️ Could not check for existing order:", checkError.message);
    }

    // NEW: save the order for the customer account.
    // Wrapped in its own try/catch: if this fails, the customer already has
    // their email, so we log the problem and still answer 200 to LemonSqueezy.
    try {
      await saveOrder({
        lsOrder: order,
        customerEmail,
        customerName,
        products,
      });
      orderSaved = true;
      console.log("💾 Order saved to Sanity");

      // Keep the cart if the email failed: the retry needs it to resend links.
      if (pendingCartId && customerEmailSent) {
        try {
          await writeClient.delete(pendingCartId);
          console.log("🗑️ Pending cart deleted:", pendingCartId);
        } catch (deleteError) {
          console.error(
            "⚠️ Pending cart NOT deleted:",
            pendingCartId,
            deleteError.message,
          );
        }
      }
    } catch (saveError) {
      console.error("⚠️ Order NOT saved to Sanity:", saveError.message);
    }

    if (isNewOrder) {
      await sendSaleAlert({
        order,
        customerEmail,
        customerName,
        products,
        customerEmailSent,
        orderSaved,
      });
    }

    if (!customerEmailSent) {
      // Same response as before, so LemonSqueezy retries the customer email.
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
