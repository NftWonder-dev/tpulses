// app/api/cart-checkout/route.js - Create LemonSqueezy checkout for cart
import { NextResponse } from 'next/server';

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

export async function POST(request) {
  try {
    const { cartItems, customerEmail } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Prepare checkout data with multiple products
    const checkoutItems = cartItems.map(item => ({
      variant_id: parseInt(item.lemonsqueezyVariantId),
      quantity: 1,
    }));

    // Create custom data for webhook (product details for email)
    const customData = {
      products: cartItems.map(item => ({
        name: item.name,
        fileKey: item.fileUrl,
      })),
    };

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_options: {
              embed: false,
              media: false,
              logo: true,
            },
            checkout_data: {
              email: customerEmail || undefined,
              custom: customData,
            },
            product_options: {
              enabled_variants: checkoutItems.map(item => item.variant_id),
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: checkoutItems[0].variant_id.toString(), // Primary variant
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('LemonSqueezy error:', data);
      throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout');
    }

    return NextResponse.json({ 
      checkoutUrl: data.data.attributes.url,
      checkoutId: data.data.id,
    });
  } catch (error) {
    console.error('Cart checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
