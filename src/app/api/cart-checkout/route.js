// app/api/cart-checkout/route.js
import { NextResponse } from "next/server";

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

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
