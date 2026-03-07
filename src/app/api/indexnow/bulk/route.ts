import { NextResponse } from 'next/server';
import { submitToIndexNow, generateSiteUrls } from '@/lib/indexnow';
import { getAllToolSlugs, getAllComparisonSlugs, getBlogPosts } from '@/lib/data';
import { SUBCATEGORIES } from '@/lib/constants';

// ============================================================
// IndexNow Bulk Submit — Submit ALL site URLs at once
// POST /api/indexnow/bulk
// Use after major content updates or initial setup
// ============================================================

const API_SECRET = process.env.INDEXNOW_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  if (API_SECRET && authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all content slugs from database
    const [toolSlugs, compSlugs, blogPosts] = await Promise.all([
      getAllToolSlugs(),
      getAllComparisonSlugs(),
      getBlogPosts(200),
    ]);

    // Collect all best-of slugs from constants
    const bestOfSlugs = Object.values(SUBCATEGORIES)
      .flat()
      .map((sub) => sub.slug);

    // Generate all URLs
    const allUrls = generateSiteUrls({
      tools: toolSlugs.map((s) => ({ categorySlug: s.categorySlug, slug: s.toolSlug })),
      comparisons: compSlugs.map((s) => ({ categorySlug: s.categorySlug, slug: s.comparisonSlug })),
      blogPosts: blogPosts.map((p) => ({ slug: p.slug })),
      bestOfSlugs,
    });

    // IndexNow allows max 10,000 per request — batch if needed
    const batchSize = 10_000;
    const results = [];

    for (let i = 0; i < allUrls.length; i += batchSize) {
      const batch = allUrls.slice(i, i + batchSize);
      const result = await submitToIndexNow(batch);
      results.push(result);

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < allUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const totalSubmitted = results.reduce((sum, r) => sum + r.submitted, 0);
    const allSuccess = results.every((r) => r.success);

    return NextResponse.json({
      success: allSuccess,
      totalUrls: allUrls.length,
      totalSubmitted,
      batches: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Bulk submission failed', detail: (error as Error).message },
      { status: 500 }
    );
  }
}
