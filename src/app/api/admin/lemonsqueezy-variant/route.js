// app/api/admin/lemonsqueezy-variant/route.js
// Creates or deletes a LemonSqueezy product+variant
import { NextResponse } from 'next/server'

const API_KEY = process.env.LEMONSQUEEZY_API_KEY
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID
const BASE = 'https://api.lemonsqueezy.com/v1'

const headers = {
  'Accept': 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
  'Authorization': `Bearer ${API_KEY}`,
}

// POST — create a product + variant in LemonSqueezy
export async function POST(request) {
  if (!API_KEY || !STORE_ID) {
    return NextResponse.json({ error: 'LEMONSQUEEZY_API_KEY or LEMONSQUEEZY_STORE_ID not configured' }, { status: 500 })
  }

  try {
    const { name, description, price } = await request.json()
    if (!name || price == null) return NextResponse.json({ error: 'Missing name or price' }, { status: 400 })

    // 1. Create the product
    const productRes = await fetch(`${BASE}/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          type: 'products',
          attributes: { name, description: description || '' },
          relationships: {
            store: { data: { type: 'stores', id: String(STORE_ID) } },
          },
        },
      }),
    })

    const productData = await productRes.json()
    if (!productRes.ok) {
      return NextResponse.json({ error: 'Failed to create LS product', detail: productData }, { status: productRes.status })
    }

    const productId = productData.data.id

    // 2. Create a variant for that product
    const priceInCents = Math.round(parseFloat(price) * 100)
    const variantRes = await fetch(`${BASE}/variants`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          type: 'variants',
          attributes: {
            name: 'Default',
            price: priceInCents,
            is_subscription: false,
            pay_what_you_want: false,
          },
          relationships: {
            product: { data: { type: 'products', id: String(productId) } },
          },
        },
      }),
    })

    const variantData = await variantRes.json()
    if (!variantRes.ok) {
      return NextResponse.json({ error: 'Failed to create LS variant', detail: variantData }, { status: variantRes.status })
    }

    const variantId = variantData.data.id

    return NextResponse.json({ productId, variantId: String(variantId) })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH — update variant price
export async function PATCH(request) {
  if (!API_KEY) return NextResponse.json({ error: 'LEMONSQUEEZY_API_KEY not configured' }, { status: 500 })

  try {
    const { variantId, price, name } = await request.json()
    if (!variantId) return NextResponse.json({ error: 'Missing variantId' }, { status: 400 })

    const attrs = {}
    if (price != null) attrs.price = Math.round(parseFloat(price) * 100)
    if (name) attrs.name = name

    const res = await fetch(`${BASE}/variants/${variantId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ data: { type: 'variants', id: String(variantId), attributes: attrs } }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: 'Failed to update variant', detail: data }, { status: res.status })
    return NextResponse.json({ variantId, updated: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — archive a LemonSqueezy product
export async function DELETE(request) {
  if (!API_KEY) return NextResponse.json({ error: 'LEMONSQUEEZY_API_KEY not configured' }, { status: 500 })

  try {
    const { productId } = await request.json()
    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })

    // LemonSqueezy doesn't support hard delete — we archive by setting status
    const res = await fetch(`${BASE}/products/${productId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        data: {
          type: 'products',
          id: String(productId),
          attributes: { status: 'draft' },
        },
      }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: 'Failed to archive LS product', detail: data }, { status: res.status })
    return NextResponse.json({ archived: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
