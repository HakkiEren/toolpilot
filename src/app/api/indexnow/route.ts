import { NextResponse } from 'next/server';
import { SITE_URL as _SITE_URL } from '@/lib/constants';

const SITE_URL = _SITE_URL.trim();

// ============================================================
// IndexNow API — Instant URL indexing for Bing, Yandex & others
// POST /api/indexnow { urls: string[] }
// Requires INDEXNOW_API_KEY env variable (or falls back to static key)
// ============================================================

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || '84d9f83f717bec0c6979844cdf5d2186';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_URLS_PER_REQUEST = 10_000;

// Simple bearer token for protecting the endpoint
const API_SECRET = process.env.INDEXNOW_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  // Auth check — prevent unauthorized submissions
  const authHeader = request.headers.get('authorization');
  if (API_SECRET && authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { urls } = body as { urls?: string[] };

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'urls array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (urls.length > MAX_URLS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Maximum ${MAX_URLS_PER_REQUEST} URLs per request` },
        { status: 400 }
      );
    }

    // Ensure all URLs belong to our domain
    const siteHost = new URL(SITE_URL).host;
    const invalidUrls = urls.filter((url) => {
      try {
        return new URL(url).host !== siteHost;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      return NextResponse.json(
        { error: 'All URLs must belong to the site domain', invalidUrls: invalidUrls.slice(0, 5) },
        { status: 422 }
      );
    }

    // Submit to IndexNow
    const payload = {
      host: siteHost,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      return NextResponse.json(
        { error: 'Rate limited by IndexNow', retryAfter },
        { status: 429 }
      );
    }

    // IndexNow returns 200 or 202 on success
    if (response.ok || response.status === 202) {
      return NextResponse.json({
        success: true,
        submitted: urls.length,
        status: response.status,
      });
    }

    // Error response
    const errorText = await response.text().catch(() => 'Unknown error');
    return NextResponse.json(
      { error: 'IndexNow submission failed', status: response.status, detail: errorText },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', detail: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/indexnow — health check
export async function GET() {
  return NextResponse.json({
    service: 'IndexNow',
    status: 'ready',
    keyVerification: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
  });
}
