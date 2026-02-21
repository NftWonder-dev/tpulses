// app/api/admin/sanity/route.js
// Proxies GROQ queries to Sanity server-side, avoiding browser CORS issues.
import { NextResponse } from 'next/server'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ji82q30h'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = '2024-01-01'

export async function POST(request) {
  try {
    const { query, params = {} } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const q = encodeURIComponent(query)
    const p = Object.keys(params).length
      ? '&' + Object.entries(params)
          .map(([k, v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`)
          .join('&')
      : ''

    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${q}${p}`

    const res = await fetch(url)
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Sanity error: ${res.status}`, detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({ result: data.result })
  } catch (err) {
    console.error('Sanity proxy error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
