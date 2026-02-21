// lib/lemonsqueezy.js - LemonSqueezy integration
const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;

/**
 * Create a checkout session for a product
 * @param {string} productId - LemonSqueezy product ID
 * @param {string} customerEmail - Customer's email
 * @param {object} customData - Custom data to pass (e.g., product details for webhook)
 */
export async function createCheckout(productId, customerEmail, customData = {}) {
  try {
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
            checkout_data: {
              email: customerEmail,
              custom: customData,
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
                id: productId,
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout');
    }

    return {
      checkoutUrl: data.data.attributes.url,
      checkoutId: data.data.id,
    };
  } catch (error) {
    console.error('LemonSqueezy checkout error:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(payload, signature) {
  const crypto = require('crypto');
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  return digest === signature;
}
