// app/api/download/route.js - API route for generating secure download links
import { NextResponse } from 'next/server';
import { generateDownloadUrl } from '@/lib/s3';

export async function POST(request) {
  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
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
