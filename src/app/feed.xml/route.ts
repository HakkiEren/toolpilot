import { supabase } from '@/lib/supabase';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';

// ============================================================
// RSS FEED — Auto-discovery for blog readers, Google News, etc.
// Accessible at /feed.xml
// ============================================================

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  // Fetch latest blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, author, published_at, updated_at, category_slug')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  // Fetch latest tools
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, tagline, category_slug, created_at, last_updated')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20);

  const now = new Date().toUTCString();

  const blogItems = (posts || []).map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <author>${escapeXml(post.author || `${SITE_NAME} Editorial Team`)}</author>
      <category>${escapeXml(post.category_slug || 'guides')}</category>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
    </item>`).join('');

  const toolItems = (tools || []).map((tool) => `
    <item>
      <title>${escapeXml(tool.name)} Review — ${escapeXml(tool.tagline || '')}</title>
      <link>${SITE_URL}/${tool.category_slug}/${tool.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${tool.category_slug}/${tool.slug}</guid>
      <description>${escapeXml(`Read our expert review of ${tool.name}. ${tool.tagline || ''}`)}</description>
      <category>${escapeXml(tool.category_slug)}</category>
      <pubDate>${new Date(tool.created_at).toUTCString()}</pubDate>
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Tool Reviews &amp; Comparisons</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/opengraph-image</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${blogItems}
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
