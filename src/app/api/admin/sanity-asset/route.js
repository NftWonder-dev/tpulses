// app/api/admin/sanity-asset/route.js
// Uploads an image to Sanity's asset pipeline and returns the asset reference
import { NextResponse } from 'next/server'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ji82q30h'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

export async function POST(request) {
  if (!TOKEN) return NextResponse.json({ error: 'SANITY_API_TOKEN not configured' }, { status: 500 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const contentType = file.type || 'image/jpeg'
    const filename = file.name || 'upload.jpg'

    const url = `https://${PROJECT_ID}.api.sanity.io/v1/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `Bearer ${TOKEN}`,
      },
      body: buffer,
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: 'Upload failed', detail: data }, { status: res.status })

    return NextResponse.json({
      assetId: data.document._id,
      url: data.document.url,
      // Sanity image reference format
      ref: {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.document._id },
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
