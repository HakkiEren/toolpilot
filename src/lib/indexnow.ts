import { SITE_URL as _SITE_URL } from './constants';

// ============================================================
// IndexNow — Submit URLs for instant indexing
// Can be called from: API routes, server actions, cron jobs
// ============================================================

const SITE_URL = _SITE_URL.trim(); // Defensive: strip any trailing whitespace/newline from env
const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || '84d9f83f717bec0c6979844cdf5d2186';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

/**
 * Submit URLs to IndexNow for instant indexing by Bing, Yandex, etc.
 * @param urls - Array of full URLs or paths (paths will be prefixed with SITE_URL)
 * @returns Success status and number of URLs submitted
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  submitted: number;
  status: number;
  error?: string;
}> {
  if (!urls || urls.length === 0) {
    return { success: false, submitted: 0, status: 0, error: 'No URLs provided' };
  }

  // Normalize: convert paths to full URLs
  const fullUrls = urls.map((url) =>
    url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
  );

  // Deduplicate
  const uniqueUrls = [...new Set(fullUrls)];

  const siteHost = new URL(SITE_URL).host;

  const payload = {
    host: siteHost,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: uniqueUrls.slice(0, 10_000), // Max 10k per request
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      return {
        success: true,
        submitted: uniqueUrls.length,
        status: response.status,
      };
    }

    const errorText = await response.text().catch(() => '');
    return {
      success: false,
      submitted: 0,
      status: response.status,
      error: errorText || `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      success: false,
      submitted: 0,
      status: 0,
      error: (error as Error).message,
    };
  }
}

/**
 * Submit a single URL to IndexNow.
 * Convenience wrapper for submitToIndexNow.
 */
export async function indexNowSubmitUrl(url: string) {
  return submitToIndexNow([url]);
}

/**
 * Generate a list of all important URLs for bulk submission.
 * Useful for initial IndexNow setup or after major content updates.
 */
export function generateSiteUrls(data: {
  tools: { categorySlug: string; slug: string }[];
  comparisons: { categorySlug: string; slug: string }[];
  blogPosts: { slug: string }[];
  bestOfSlugs: string[];
}): string[] {
  const urls: string[] = [
    // Static pages
    SITE_URL,
    `${SITE_URL}/blog`,
    `${SITE_URL}/best`,
    `${SITE_URL}/glossary`,
    `${SITE_URL}/search`,
    `${SITE_URL}/contact`,
    // Category pages
    `${SITE_URL}/ai-tools`,
    `${SITE_URL}/saas`,
    `${SITE_URL}/ecommerce`,
    `${SITE_URL}/marketing`,
    `${SITE_URL}/hosting`,
    `${SITE_URL}/business`,
  ];

  // Tool pages
  for (const tool of data.tools) {
    urls.push(`${SITE_URL}/${tool.categorySlug}/${tool.slug}`);
  }

  // Comparison pages
  for (const comp of data.comparisons) {
    urls.push(`${SITE_URL}/${comp.categorySlug}/compare/${comp.slug}`);
  }

  // Blog posts
  for (const post of data.blogPosts) {
    urls.push(`${SITE_URL}/blog/${post.slug}`);
  }

  // Best-of pages
  for (const slug of data.bestOfSlugs) {
    urls.push(`${SITE_URL}/best/${slug}`);
  }

  return urls;
}
