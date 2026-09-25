// app/api/cart-checkout/route.js
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
// Generic "Trim Pulses order" variant used for every cart checkout.
// Falls back to the first product's variant until it is configured.
const LEMONSQUEEZY_CART_VARIANT_ID = process.env.LEMONSQUEEZY_CART_VARIANT_ID;

export async function POST(request) {
  try {
    const { productIds, customerEmail } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Each digital product is charged once, however many times it is in the cart.
    const uniqueIds = [...new Set(productIds.filter((id) => typeof id === "string"))];

    // Prices come from Sanity, never from the browser.
    const products = await client.fetch(
      `*[_type == "product" && _id in $ids] { _id, name, price, lemonsqueezyVariantId }`,
      { ids: uniqueIds },
    );

    if (products.length !== uniqueIds.length) {
      return NextResponse.json(
        { error: "Some products in your cart are no longer available" },
        { status: 400 },
      );
    }

    const invalid = products.find(
      (p) => typeof p.price !== "number" || p.price <= 0,
    );
    if (invalid) {
      console.error("Product has no valid price:", invalid);
      return NextResponse.json(
        { error: `Product "${invalid.name}" has no valid price` },
        { status: 400 },
      );
    }

    const variantId =
      LEMONSQUEEZY_CART_VARIANT_ID ||
      products.find((p) => p.lemonsqueezyVariantId)?.lemonsqueezyVariantId;

    if (!variantId) {
      console.error("No LemonSqueezy variant available for checkout");
      return NextResponse.json(
        { error: "Checkout is not configured" },
        { status: 500 },
      );
    }

    const totalCents = products.reduce(
      (sum, p) => sum + Math.round(p.price * 100),
      0,
    );

    console.log(
      "Checkout:",
      products.map((p) => ({ id: p._id, name: p.name, price: p.price })),
      "Total cents:",
      totalCents,
    );

    const requestBody = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          checkout_data: {
            email: customerEmail || undefined,
            // Read back by the webhook to know which files to deliver.
            custom: {
              product_ids: products.map((p) => p._id).join(","),
            },
          },
          custom_price: totalCents,
          product_options: {
            redirect_url: "https://trimpulses.com/order-success",
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId.toString(),
            },
          },
        },
      },
    };

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("LemonSqueezy error:", data);
      throw new Error(data.errors?.[0]?.detail || "Failed to create checkout");
    }

    return NextResponse.json({
      checkoutUrl: data.data.attributes.url,
      checkoutId: data.data.id,
    });
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout" },
      { status: 500 },
    );
  }
}
