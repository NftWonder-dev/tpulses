// app/api/cart-checkout/route.js
import { NextResponse } from "next/server";

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function POST(request) {
  try {
    const { cartItems, customerEmail } = await request.json();

    console.log("Cart items received:", cartItems);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Check if variant IDs exist
    const missingVariantId = cartItems.find(
      (item) => !item.lemonsqueezyVariantId,
    );
    if (missingVariantId) {
      console.error("Product missing variant ID:", missingVariantId);
      return NextResponse.json(
        {
          error: `Product "${missingVariantId.name}" is missing LemonSqueezy Variant ID in Sanity`,
        },
        { status: 400 },
      );
    }

    // Calculate total price for all products
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    console.log("==== STORING CART IN REDIS ====");
    console.log("Cart items count:", cartItems.length);
    console.log("Cart items details:", JSON.stringify(cartItems, null, 2));
    console.log("============================");

    console.log("Total price:", totalPrice);
    console.log(
      "Cart items:",
      cartItems.map((i) => ({ name: i.name, price: i.price })),
    );

    // Build checkout request
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
          },
          custom_price: Math.round(totalPrice * 100), // in cents
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
              id: cartItems[0].lemonsqueezyVariantId.toString(),
            },
          },
        },
      },
    };

    console.log(
      "Sending to LemonSqueezy:",
      JSON.stringify(requestBody, null, 2),
    );

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

    console.log("LemonSqueezy response:", data);

    if (!response.ok) {
      console.error("LemonSqueezy error:", data);
      throw new Error(data.errors?.[0]?.detail || "Failed to create checkout");
    }

    const checkoutId = data.data.id;
    const checkoutUrl = data.data.attributes.url;

    console.log("Checkout created:", checkoutId);

    // Store cart in Redis with checkoutId as key (expires in 24 hours)
    const redisKey = `cart:${cartItems[0].lemonsqueezyVariantId}`;
    const cartData = {
      cartItems,
      customerEmail,
      createdAt: new Date().toISOString(),
    };

    const redisResponse = await fetch(
      `${UPSTASH_REDIS_REST_URL}/set/${redisKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: JSON.stringify(cartData),
          ex: 86400, // 24 hours in seconds
        }),
      },
    );

    if (!redisResponse.ok) {
      console.error("Failed to store cart in Redis");
      throw new Error("Failed to store cart data");
    }

    console.log("==== REDIS STORAGE SUCCESS ====");
    console.log("Stored with key:", redisKey);
    console.log("Cart data stored:", JSON.stringify(cartData, null, 2));
    console.log("============================");

    console.log("Cart stored in Redis with key:", redisKey);

    return NextResponse.json({
      checkoutUrl,
      checkoutId,
    });
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout" },
      { status: 500 },
    );
  }
}
