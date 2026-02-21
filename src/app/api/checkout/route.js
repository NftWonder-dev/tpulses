// app/api/checkout/route.js - Create LemonSqueezy checkout
import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/lemonsqueezy';

export async function POST(request) {
  try {
    const { productId, customerEmail, productName, fileKey } = await request.json();

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create checkout session with custom data for webhook
    const { checkoutUrl } = await createCheckout(productId, customerEmail, {
      productName,
      fileKey,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
