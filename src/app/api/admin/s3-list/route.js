// app/api/admin/s3-list/route.js
// Lists all objects in the S3 bucket for the admin dashboard
import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function GET(request) {
  const bucket = process.env.AWS_S3_BUCKET_NAME

  if (!bucket) {
    return NextResponse.json(
      { error: 'AWS_S3_BUCKET_NAME not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get('prefix') || 'products/'

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: 200,
    })

    const response = await s3.send(command)

    const files = (response.Contents || [])
      .filter(obj => !obj.Key.endsWith('/')) // exclude "folders"
      .map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        etag: obj.ETag,
      }))
      .sort((a, b) => a.key.localeCompare(b.key))

    return NextResponse.json({
      files,
      bucket,
      prefix,
      isTruncated: response.IsTruncated,
      count: files.length,
    })
  } catch (err) {
    console.error('S3 list error:', err)
    return NextResponse.json(
      { error: 'S3 listing failed', detail: err.message },
      { status: 500 }
    )
  }
}
