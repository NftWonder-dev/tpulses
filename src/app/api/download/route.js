// app/api/download/route.js - API route for generating secure download links
import { NextResponse } from 'next/server';
import { generateDownloadUrl } from '@/lib/s3';

const PUBLIC_PREFIX = 'products/free-pack/';

export async function POST(request) {
  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Only free files may be downloaded publicly. Paid files are delivered
    // through the order email after LemonSqueezy confirms payment.
    if (
      typeof fileKey !== 'string' ||
      !fileKey.startsWith(PUBLIC_PREFIX) ||
      fileKey.includes('..')
    ) {
      return NextResponse.json(
        { error: 'File not available' },
        { status: 403 }
      );
    }

    // Generate presigned URL (valid for 1 hour)
    const downloadUrl = await generateDownloadUrl(fileKey, 3600);

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download link' },
      { status: 500 }
    );
  }
}
