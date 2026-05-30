import { NextRequest, NextResponse } from 'next/server';
import { auditWebsite } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let validatedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validatedUrl = `https://${url}`;
    }

    // Check if it's a valid URL
    try {
      new URL(validatedUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const result = await auditWebsite(validatedUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to audit website' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SiteCheck Pro Audit API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/audit - Audit a website (body: { url: string })'
    }
  });
}
