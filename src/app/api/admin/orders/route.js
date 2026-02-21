// app/api/admin/orders/route.js
// Proxies LemonSqueezy orders list to the admin dashboard (avoids CORS issues)
import { NextResponse } from 'next/server'

export async function GET(request) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  const storeId = process.env.LEMONSQUEEZY_STORE_ID

  if (!apiKey) {
    return NextResponse.json(
      { error: 'LEMONSQUEEZY_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '50'

    const url = new URL('https://api.lemonsqueezy.com/v1/orders')
    url.searchParams.set('page[number]', page)
    url.searchParams.set('page[size]', perPage)
    url.searchParams.set('sort', '-created_at')
    if (storeId) url.searchParams.set('filter[store_id]', storeId)

    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 60 }, // cache for 1 minute
    })

    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json(
        { error: `LemonSqueezy API error: ${res.status}`, detail: body },
        { status: res.status }
      )
    }

    const data = await res.json()

    // Shape the response for the dashboard
    return NextResponse.json({
      orders: data.data || [],
      meta: data.meta || {},
      links: data.links || {},
    })
  } catch (err) {
    console.error('Admin orders error:', err)
    return NextResponse.json(
      { error: 'Internal server error', detail: err.message },
      { status: 500 }
    )
  }
}
