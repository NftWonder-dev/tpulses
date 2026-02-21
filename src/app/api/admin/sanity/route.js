// app/api/admin/sanity/route.js
// Handles both READ (POST with query) and WRITE (PUT with mutations) to Sanity
import { NextResponse } from 'next/server'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ji82q30h'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.env.SANITY_API_TOKEN

// READ — GROQ query
export async function POST(request) {
  try {
    const { query, params = {} } = await request.json()
    if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

    const q = encodeURIComponent(query)
    const p = Object.keys(params).length
      ? '&' + Object.entries(params).map(([k, v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`).join('&')
      : ''

    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${q}${p}`
    const res = await fetch(url)
    const data = await res.json()
    return NextResponse.json({ result: data.result })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// WRITE — mutations (create, patch, delete)
export async function PUT(request) {
  if (!TOKEN) return NextResponse.json({ error: 'SANITY_API_TOKEN not configured' }, { status: 500 })

  try {
    const { mutations } = await request.json()
    if (!mutations) return NextResponse.json({ error: 'Missing mutations' }, { status: 400 })

    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.description || 'Mutation failed', detail: data }, { status: res.status })
    return NextResponse.json({ result: data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
