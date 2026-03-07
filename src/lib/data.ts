import { supabase } from './supabase';
import type {
  Tool,
  Comparison,
  Category,
  Subcategory,
  BlogPost,
  InternalLink,
  FAQ,
} from '@/types';
import { CATEGORIES, LIMITS } from './constants';

// ============================================================
// DATA ACCESS LAYER
// All Supabase queries centralized here for ISR compatibility
// ============================================================

// --- Tools ---

export async function getToolBySlug(
  categorySlug: string,
  toolSlug: string
): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('slug', toolSlug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return mapToolRow(data);
}

export async function getToolsByCategory(
  categorySlug: string,
  limit = 50,
  offset = 0
): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return data.map(mapToolRow);
}

export async function getToolsBySubcategory(
  categorySlug: string,
  subcategorySlug: string,
  limit = 50
): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('subcategory_slug', subcategorySlug)
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapToolRow);
}

export async function getRelatedTools(
  tool: Tool,
  limit = 6
): Promise<Tool[]> {
  // First try same subcategory, then same category
  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('category_slug', tool.categorySlug)
    .eq('status', 'published')
    .neq('id', tool.id)
    .order('ratings_overall', { ascending: false })
    .limit(limit);

  if (!data) return [];
  return data.map(mapToolRow);
}

export async function getAllToolSlugs(): Promise<
  { categorySlug: string; toolSlug: string }[]
> {
  const { data, error } = await supabase
    .from('tools')
    .select('slug, category_slug')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .limit(LIMITS.BUILD_TIME_TOOLS);

  if (error || !data) return [];
  return data.map((row) => ({
    categorySlug: row.category_slug,
    toolSlug: row.slug,
  }));
}

// --- Comparisons ---

export async function getComparison(
  categorySlug: string,
  comparisonSlug: string
): Promise<Comparison | null> {
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(*),
      tool_b:tools!comparisons_tool_b_id_fkey(*)
    `)
    .eq('category_slug', categorySlug)
    .eq('slug', comparisonSlug)
    .single();

  if (error || !data) return null;
  return mapComparisonRow(data);
}

export async function getComparisonsByTool(toolId: string): Promise<Comparison[]> {
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(*),
      tool_b:tools!comparisons_tool_b_id_fkey(*)
    `)
    .or(`tool_a_id.eq.${toolId},tool_b_id.eq.${toolId}`)
    .limit(10);

  if (error || !data) return [];
  return data.map(mapComparisonRow);
}

export async function getAllComparisonSlugs(): Promise<
  { categorySlug: string; comparisonSlug: string }[]
> {
  const { data, error } = await supabase
    .from('comparisons')
    .select('slug, category_slug')
    .order('created_at', { ascending: false })
    .limit(LIMITS.BUILD_TIME_COMPARISONS);

  if (error || !data) return [];
  return data.map((row) => ({
    categorySlug: row.category_slug,
    comparisonSlug: row.slug,
  }));
}

// --- Internal Linking (CRITICAL for pSEO) ---

export async function getRelatedLinks(
  tool: Tool,
  limit = LIMITS.INTERNAL_LINKS_PER_PAGE.max
): Promise<InternalLink[]> {
  const links: InternalLink[] = [];

  // 1. Parent category (hub) link
  const cat = CATEGORIES[tool.categorySlug];
  if (cat) {
    links.push({
      url: `/${cat.slug}`,
      text: cat.name,
      type: 'hub',
    });
  }

  // 2-4. Parallel fetch: siblings, comparisons, cross-category links
  const [{ data: siblings }, { data: comparisons }, { data: crossLinks }] = await Promise.all([
    supabase
      .from('tools')
      .select('slug, name, category_slug')
      .eq('category_slug', tool.categorySlug)
      .eq('status', 'published')
      .neq('id', tool.id)
      .order('ratings_overall', { ascending: false })
      .limit(3),
    supabase
      .from('comparisons')
      .select('slug, category_slug')
      .or(`tool_a_id.eq.${tool.id},tool_b_id.eq.${tool.id}`)
      .limit(3),
    supabase
      .from('tools')
      .select('slug, name, category_slug')
      .neq('category_slug', tool.categorySlug)
      .eq('status', 'published')
      .limit(2),
  ]);

  if (siblings) {
    for (const s of siblings) {
      links.push({
        url: `/${s.category_slug}/${s.slug}`,
        text: s.name,
        type: 'sibling',
      });
    }
  }

  if (comparisons) {
    for (const c of comparisons) {
      links.push({
        url: `/${c.category_slug}/compare/${c.slug}`,
        text: `Compare ${c.slug.replace(/-vs-/g, ' vs ')}`,
        type: 'comparison',
      });
    }
  }

  if (crossLinks) {
    for (const l of crossLinks) {
      links.push({
        url: `/${l.category_slug}/${l.slug}`,
        text: l.name,
        type: 'cross-category',
      });
    }
  }

  return links.slice(0, limit);
}

// --- Blog ---

/**
 * Get blog posts that mention a specific tool (via relatedToolSlugs)
 * Used for tool→blog cross-linking on tool detail pages
 */
export async function getRelatedBlogPosts(
  categorySlug: string,
  toolSlug: string,
  limit = 3
): Promise<BlogPost[]> {
  const pattern = `${categorySlug}/${toolSlug}`;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .contains('related_tool_slugs', [pattern])
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    // Fallback: get posts from the same category
    const { data: catPosts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('category_slug', categorySlug)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (!catPosts) return [];
    return catPosts.map(mapBlogRow);
  }
  return data.map(mapBlogRow);
}

/**
 * Get related comparisons for a comparison page (comparisons involving the same tools)
 * Used for comparison→comparison cross-linking
 */
export async function getRelatedComparisons(
  comparison: Comparison,
  limit = 4
): Promise<Comparison[]> {
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(*),
      tool_b:tools!comparisons_tool_b_id_fkey(*)
    `)
    .eq('category_slug', comparison.categorySlug)
    .neq('id', comparison.id)
    .or(`tool_a_id.eq.${comparison.toolA.id},tool_b_id.eq.${comparison.toolA.id},tool_a_id.eq.${comparison.toolB.id},tool_b_id.eq.${comparison.toolB.id}`)
    .limit(limit);

  if (error || !data) {
    // Fallback: any comparisons from same category
    const { data: catComps } = await supabase
      .from('comparisons')
      .select(`
        *,
        tool_a:tools!comparisons_tool_a_id_fkey(*),
        tool_b:tools!comparisons_tool_b_id_fkey(*)
      `)
      .eq('category_slug', comparison.categorySlug)
      .neq('id', comparison.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!catComps) return [];
    return catComps.map(mapComparisonRow);
  }
  return data.map(mapComparisonRow);
}

export async function getBlogPosts(limit = 10): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapBlogRow);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return mapBlogRow(data);
}

// --- Category Stats ---

export async function getComparisonsByCategory(
  categorySlug: string,
  limit = 8
): Promise<Comparison[]> {
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(*),
      tool_b:tools!comparisons_tool_b_id_fkey(*)
    `)
    .eq('category_slug', categorySlug)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapComparisonRow);
}

export async function getCategoryStats(
  categorySlug: string
): Promise<{ toolCount: number; comparisonCount: number }> {
  const [tools, comparisons] = await Promise.all([
    supabase
      .from('tools')
      .select('id', { count: 'exact', head: true })
      .eq('category_slug', categorySlug)
      .eq('status', 'published'),
    supabase
      .from('comparisons')
      .select('id', { count: 'exact', head: true })
      .eq('category_slug', categorySlug),
  ]);

  return {
    toolCount: tools.count || 0,
    comparisonCount: comparisons.count || 0,
  };
}

// ============================================================
// ROW MAPPERS (Supabase snake_case → TypeScript camelCase)
// ============================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapToolRow(row: any): Tool {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    subcategorySlug: row.subcategory_slug,
    tagline: row.tagline || '',
    description: row.description || '',
    logoUrl: row.logo_url || '',
    websiteUrl: row.website_url || '',
    pricing: row.pricing || { hasFreeplan: false, freeTrialDays: null, startingPrice: null, currency: 'USD', plans: [] },
    features: row.features || {},
    ratings: {
      overall: row.ratings_overall || 0,
      easeOfUse: row.ratings_ease_of_use || 0,
      features: row.ratings_features || 0,
      valueForMoney: row.ratings_value || 0,
      support: row.ratings_support || 0,
      reviewCount: row.review_count || 0,
    },
    prosConsContent: row.pros_cons_content || '',
    useCasesContent: row.use_cases_content || '',
    bestForContent: row.best_for_content || '',
    metaTitle: row.meta_title || `${row.name} Review — Features, Pricing & Alternatives`,
    metaDescription: row.meta_description || '',
    lastUpdated: row.last_updated || row.updated_at || '',
    createdAt: row.created_at || '',
    status: row.status || 'draft',
  };
}

function mapComparisonRow(row: any): Comparison {
  return {
    id: row.id,
    slug: row.slug,
    categorySlug: row.category_slug,
    toolA: mapToolRow(row.tool_a),
    toolB: mapToolRow(row.tool_b),
    introContent: row.intro_content || '',
    verdictContent: row.verdict_content || '',
    migrationContent: row.migration_content || '',
    scenarioContent: row.scenario_content || '',
    featureMatrix: row.feature_matrix || [],
    faqs: row.faqs || [],
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    lastUpdated: row.last_updated || row.updated_at || '',
  };
}

function mapBlogRow(row: any): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content || '',
    categorySlug: row.category_slug || null,
    author: row.author || 'ProPicked Team',
    publishedAt: row.published_at || '',
    updatedAt: row.updated_at || '',
    metaTitle: row.meta_title || row.title,
    metaDescription: row.meta_description || row.excerpt || '',
    relatedToolSlugs: row.related_tool_slugs || [],
    relatedComparisonSlugs: row.related_comparison_slugs || [],
  };
}
