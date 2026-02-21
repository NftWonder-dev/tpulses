// app/api/admin/s3-upload/route.js
// Generates a presigned S3 URL so the browser can upload directly to S3
import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET_NAME

// GET — generate presigned upload URL
export async function GET(request) {
  if (!BUCKET) return NextResponse.json({ error: 'AWS_S3_BUCKET_NAME not configured' }, { status: 500 })

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const contentType = searchParams.get('contentType') || 'application/zip'

  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    })
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    return NextResponse.json({ url, key })
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
