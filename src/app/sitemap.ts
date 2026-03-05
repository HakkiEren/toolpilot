import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_URL, CATEGORY_LIST, SUBCATEGORIES, LIMITS } from '@/lib/constants';

// ============================================================
// DYNAMIC SITEMAP GENERATION
// Next.js automatically serves this as /sitemap.xml
// For 50K+ pages, use generateSitemaps() to split
// ============================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // 1. Static pages
  entries.push(
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/sitemap-html`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    // Calculator pages
    { url: `${SITE_URL}/calculators/roi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/email-marketing-roi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/hosting-cost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/ecommerce-profit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/ai-cost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/team-productivity`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  );

  // 2. Category pages + comparison hub pages
  for (const cat of CATEGORY_LIST) {
    entries.push({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    entries.push({
      url: `${SITE_URL}/${cat.slug}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 3. Best-of / subcategory pages
  for (const [catSlug, subs] of Object.entries(SUBCATEGORIES)) {
    for (const sub of subs) {
      entries.push({
        url: `${SITE_URL}/${catSlug}/best/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 4. Tool pages
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, category_slug, last_updated')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .limit(LIMITS.SITEMAP_MAX_URLS);

  if (tools) {
    for (const tool of tools) {
      entries.push({
        url: `${SITE_URL}/${tool.category_slug}/${tool.slug}`,
        lastModified: new Date(tool.last_updated),
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // Tool sub-pages
      entries.push({
        url: `${SITE_URL}/${tool.category_slug}/${tool.slug}/alternatives`,
        lastModified: new Date(tool.last_updated),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      entries.push({
        url: `${SITE_URL}/${tool.category_slug}/${tool.slug}/pricing`,
        lastModified: new Date(tool.last_updated),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // 4. Comparison pages
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, category_slug, last_updated')
    .order('created_at', { ascending: false })
    .limit(LIMITS.SITEMAP_MAX_URLS);

  if (comparisons) {
    for (const comp of comparisons) {
      entries.push({
        url: `${SITE_URL}/${comp.category_slug}/compare/${comp.slug}`,
        lastModified: new Date(comp.last_updated),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // 5. Blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (posts) {
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}

// ============================================================
// For 50K+ pages: uncomment this to generate multiple sitemaps
// ============================================================
// export async function generateSitemaps() {
//   const { count } = await supabase
//     .from('tools')
//     .select('id', { count: 'exact', head: true })
//     .eq('status', 'published');
//
//   const totalPages = (count || 0) * 3; // tools + alternatives + pricing
//   const sitemapCount = Math.ceil(totalPages / LIMITS.SITEMAP_MAX_URLS);
//
//   return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
// }
