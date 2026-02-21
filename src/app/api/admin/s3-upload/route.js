// app/api/admin/s3-upload/route.js
// Handles S3 uploads server-side to avoid browser CORS issues
import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET_NAME

// POST — upload file directly through server (no CORS issues)
export async function POST(request) {
  if (!BUCKET) return NextResponse.json({ error: 'AWS_S3_BUCKET_NAME not configured' }, { status: 500 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const key = formData.get('key')

    if (!file || !key) return NextResponse.json({ error: 'Missing file or key' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/zip',
    }))

    return NextResponse.json({ key, success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — remove a file from S3
export async function DELETE(request) {
  if (!BUCKET) return NextResponse.json({ error: 'AWS_S3_BUCKET_NAME not configured' }, { status: 500 })

  try {
    const { key } = await request.json()
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
    return NextResponse.json({ deleted: key })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
