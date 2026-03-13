import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { SITE_URL, CATEGORY_LIST, SUBCATEGORIES } from '@/lib/constants';
import { getAllGlossaryTermSlugs } from '@/lib/glossary-data';
import { getTeamMembers } from '@/lib/authors';

// ============================================================
// SITEMAP INDEX — splits into multiple sitemaps for 15,000+ pages
// Next.js auto-generates /sitemap.xml as index pointing to
// /sitemap/0.xml, /sitemap/1.xml, etc.
// ============================================================

export const revalidate = 3600; // Regenerate sitemap every 1 hour

const URLS_PER_SITEMAP = 5000;

/**
 * Generate sitemap IDs.
 * Sitemap 0: static + categories + tools + blog + glossary (~2000 URLs)
 * Sitemap 1+: comparison pages in batches of 5000
 */
export async function generateSitemaps() {
  // Count total comparisons
  const { count } = await supabase
    .from('comparisons')
    .select('id', { count: 'exact', head: true });

  const totalComparisons = count || 0;
  const comparisonSitemaps = Math.ceil(totalComparisons / URLS_PER_SITEMAP);

  // Sitemap 0 = everything except comparisons
  // Sitemap 1..N = comparison pages
  return Array.from({ length: 1 + comparisonSitemaps }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // Sitemap 0: static pages, categories, tools, blog, glossary
  if (id === 0) {
    return buildCoreSitemap();
  }

  // Sitemap 1+: comparison pages in batches
  const offset = (id - 1) * URLS_PER_SITEMAP;
  return buildComparisonSitemap(offset, URLS_PER_SITEMAP);
}

// ============================================================
// CORE SITEMAP (id=0): static + categories + tools + blog
// ============================================================
async function buildCoreSitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();
  const weeklyDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthlyDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Static pages
  entries.push(
    { url: SITE_URL, lastModified: weeklyDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: monthlyDate, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: monthlyDate, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/calculators`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/calculators/roi`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/email-marketing-roi`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/hosting-cost`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/ecommerce-profit`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/ai-cost`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/calculators/team-productivity`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/glossary`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.6 },
    ...getAllGlossaryTermSlugs().map((slug) => ({
      url: `${SITE_URL}/glossary/${slug}`,
      lastModified: monthlyDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/editorial-policy`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/badges`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about/team`, lastModified: monthlyDate, changeFrequency: 'monthly', priority: 0.5 },
    ...getTeamMembers().map((m) => ({
      url: `${SITE_URL}/about/team/${m.slug}`,
      lastModified: monthlyDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/changelog`, lastModified: weeklyDate, changeFrequency: 'weekly', priority: 0.5 },
  );

  // 2. Category pages + comparison hub pages
  for (const cat of CATEGORY_LIST) {
    entries.push({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: weeklyDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
    entries.push({
      url: `${SITE_URL}/${cat.slug}/compare`,
      lastModified: weeklyDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // 3. Best-of index + subcategory pages
  entries.push({
    url: `${SITE_URL}/best`,
    lastModified: weeklyDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  });
  for (const subs of Object.values(SUBCATEGORIES)) {
    for (const sub of subs) {
      entries.push({
        url: `${SITE_URL}/best/${sub.slug}`,
        lastModified: weeklyDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // 4. Tool pages (with alternatives + pricing sub-pages)
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, category_slug, last_updated')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false });

  if (tools) {
    for (const tool of tools) {
      entries.push({
        url: `${SITE_URL}/${tool.category_slug}/${tool.slug}`,
        lastModified: new Date(tool.last_updated),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
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
// COMPARISON SITEMAPS (id=1+): batched by 5000
// ============================================================
async function buildComparisonSitemap(offset: number, limit: number): Promise<MetadataRoute.Sitemap> {
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, category_slug, last_updated')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (!comparisons) return [];

  return comparisons.map((comp) => ({
    url: `${SITE_URL}/${comp.category_slug}/compare/${comp.slug}`,
    lastModified: new Date(comp.last_updated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
}
