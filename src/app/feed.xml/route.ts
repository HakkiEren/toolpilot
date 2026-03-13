import { supabase } from '@/lib/supabase';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CATEGORIES } from '@/lib/constants';

// ============================================================
// RSS FEED — Auto-discovery for blog readers, Google News,
// Google Discover, and feed aggregators.
// Accessible at /feed.xml
// Covers: blog posts, tool reviews, and comparisons
// Enhanced: content:encoded for richer previews, proper
// lastBuildDate from actual content, category labels
// ============================================================

export const revalidate = 3600; // Regenerate RSS feed every 1 hour

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCategoryLabel(slug: string): string {
  const cat = Object.values(CATEGORIES).find(c => c.slug === slug);
  return cat?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export async function GET() {
  // Fetch all content types in parallel
  const [postsResult, toolsResult, comparisonsResult] = await Promise.all([
    // Latest blog posts
    supabase
      .from('blog_posts')
      .select('slug, title, excerpt, author, published_at, updated_at, category_slug')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50),
    // Latest tools
    supabase
      .from('tools')
      .select('slug, name, tagline, category_slug, created_at, last_updated')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20),
    // Latest comparisons
    supabase
      .from('comparisons')
      .select('slug, category_slug, meta_title, meta_description, created_at, last_updated')
      .order('created_at', { ascending: false })
      .limit(30),
  ]);

  const posts = postsResult.data || [];
  const tools = toolsResult.data || [];
  const comparisons = comparisonsResult.data || [];

  // Compute lastBuildDate from most recent content across all types
  const allDates = [
    ...posts.map(p => p.updated_at || p.published_at),
    ...tools.map(t => t.last_updated || t.created_at),
    ...comparisons.map(c => c.last_updated || c.created_at),
  ].filter(Boolean).map(d => new Date(d).getTime());
  const lastBuildDate = allDates.length > 0
    ? new Date(Math.max(...allDates)).toUTCString()
    : new Date().toUTCString();

  const blogItems = posts.map((post) => {
    const catLabel = getCategoryLabel(post.category_slug || '');
    const pubDate = new Date(post.published_at).toUTCString();
    const excerpt = escapeXml(post.excerpt || '');
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${excerpt}</description>
      <content:encoded><![CDATA[<p>${post.excerpt || ''}</p><p><a href="${SITE_URL}/blog/${post.slug}">Read full article on ${SITE_NAME}</a></p>]]></content:encoded>
      <dc:creator>${escapeXml(post.author || `${SITE_NAME} Editorial Team`)}</dc:creator>
      <category>Blog</category>
      ${catLabel ? `<category>${escapeXml(catLabel)}</category>` : ''}
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('');

  const toolItems = tools.map((tool) => {
    const catLabel = getCategoryLabel(tool.category_slug);
    const pubDate = new Date(tool.created_at).toUTCString();
    return `
    <item>
      <title>${escapeXml(tool.name)} Review — ${escapeXml(tool.tagline || '')}</title>
      <link>${SITE_URL}/${tool.category_slug}/${tool.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${tool.category_slug}/${tool.slug}</guid>
      <description>${escapeXml(`Expert review of ${tool.name}. ${tool.tagline || ''}`)}</description>
      <content:encoded><![CDATA[<p>Expert review of <strong>${tool.name}</strong>: ${tool.tagline || ''}</p><p><a href="${SITE_URL}/${tool.category_slug}/${tool.slug}">Read the full ${tool.name} review on ${SITE_NAME}</a></p>]]></content:encoded>
      <dc:creator>${escapeXml(`${SITE_NAME} Editorial Team`)}</dc:creator>
      <category>Reviews</category>
      <category>${escapeXml(catLabel)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('');

  const comparisonItems = comparisons.map((comp) => {
    const catLabel = getCategoryLabel(comp.category_slug);
    const pubDate = new Date(comp.created_at).toUTCString();
    const title = comp.meta_title || comp.slug.replace(/-/g, ' ');
    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/${comp.category_slug}/compare/${comp.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${comp.category_slug}/compare/${comp.slug}</guid>
      <description>${escapeXml(comp.meta_description || `Side-by-side comparison with features, pricing, and expert verdicts.`)}</description>
      <content:encoded><![CDATA[<p>${comp.meta_description || 'Side-by-side comparison with features, pricing, and expert verdicts.'}</p><p><a href="${SITE_URL}/${comp.category_slug}/compare/${comp.slug}">View full comparison on ${SITE_NAME}</a></p>]]></content:encoded>
      <dc:creator>${escapeXml(`${SITE_NAME} Editorial Team`)}</dc:creator>
      <category>Comparisons</category>
      <category>${escapeXml(catLabel)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Tool Reviews &amp; Comparisons</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>hello@propicked.com (${escapeXml(SITE_NAME)} Editorial Team)</managingEditor>
    <webMaster>hello@propicked.com (${escapeXml(SITE_NAME)})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(SITE_NAME)}. All rights reserved.</copyright>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/opengraph-image</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${blogItems}
    ${comparisonItems}
    ${toolItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
