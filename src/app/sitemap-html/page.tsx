import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CATEGORIES, CATEGORY_LIST, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';

// ============================================================
// HTML SITEMAP PAGE — Full site map for users & crawlers
// ============================================================

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Sitemap — Browse All Pages | ${SITE_NAME}`,
  description: `Browse the complete ${SITE_NAME} sitemap. Find all tool reviews, comparisons, best-of lists, and blog posts in one place.`,
  alternates: { canonical: `${SITE_URL}/sitemap-html` },
};

export default async function SitemapPage() {
  // Fetch all tools grouped by category
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, category_slug')
    .eq('status', 'published')
    .order('name');

  // Fetch all comparisons grouped by category
  const { data: comparisons } = await supabase
    .from('comparisons')
    .select('slug, category_slug, meta_title')
    .order('slug');

  // Fetch all blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Group tools by category
  const toolsByCategory: Record<string, { slug: string; name: string }[]> = {};
  (tools || []).forEach((t) => {
    if (!toolsByCategory[t.category_slug]) toolsByCategory[t.category_slug] = [];
    toolsByCategory[t.category_slug].push(t);
  });

  // Group comparisons by category
  const compsByCategory: Record<string, { slug: string; title: string }[]> = {};
  (comparisons || []).forEach((c) => {
    if (!compsByCategory[c.category_slug]) compsByCategory[c.category_slug] = [];
    compsByCategory[c.category_slug].push({
      slug: c.slug,
      title: c.meta_title || c.slug.split('-vs-').map((s: string) => s.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' vs '),
    });
  });

  const totalTools = tools?.length || 0;
  const totalComparisons = comparisons?.length || 0;
  const totalPosts = posts?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-4">
          Site Map
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Browse all {totalTools}+ tool reviews, {totalComparisons}+ comparisons,
          and {totalPosts}+ blog posts on {SITE_NAME}.
        </p>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="glass rounded-xl px-5 py-3 card-animate" style={{ animationDelay: '0ms' }}>
            <span className="text-2xl font-bold text-blue-600">{totalTools}</span>
            <span className="text-sm text-gray-500 ml-2">Tool Reviews</span>
          </div>
          <div className="glass rounded-xl px-5 py-3 card-animate" style={{ animationDelay: '100ms' }}>
            <span className="text-2xl font-bold text-purple-600">{totalComparisons}</span>
            <span className="text-sm text-gray-500 ml-2">Comparisons</span>
          </div>
          <div className="glass rounded-xl px-5 py-3 card-animate" style={{ animationDelay: '200ms' }}>
            <span className="text-2xl font-bold text-green-600">{totalPosts}</span>
            <span className="text-sm text-gray-500 ml-2">Blog Posts</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <a href="#tools" className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
          🛠️ Tool Reviews
        </a>
        <a href="#comparisons" className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
          ⚖️ Comparisons
        </a>
        <a href="#best-of" className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-full text-sm font-medium hover:bg-yellow-100 transition-colors">
          🏆 Best Of Lists
        </a>
        <a href="#blog" className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
          📝 Blog Posts
        </a>
        <a href="#pages" className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          📄 Other Pages
        </a>
      </div>

      {/* ============================================================ */}
      {/* MAIN PAGES */}
      {/* ============================================================ */}
      <section id="pages" className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-xl">📄</span> Main Pages
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/', label: 'Home' },
            { href: '/search', label: 'Search Tools' },
            { href: '/blog', label: 'Blog' },
            { href: '/about', label: 'About Us' },
            { href: '/contact', label: 'Contact' },
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/sitemap-html', label: 'Sitemap' },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* CATEGORIES */}
      {/* ============================================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-xl">📂</span> Categories
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORY_LIST.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 transition-all hover-lift"
            >
              <h3 className="font-bold mb-1" style={{ color: cat.color }}>{cat.name}</h3>
              <p className="text-xs text-gray-500">{toolsByCategory[cat.slug]?.length || 0} tools reviewed</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOOL REVIEWS BY CATEGORY */}
      {/* ============================================================ */}
      <section id="tools" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-xl">🛠️</span> All Tool Reviews ({totalTools})
        </h2>

        <div className="space-y-10">
          {CATEGORY_LIST.map((cat) => {
            const catTools = toolsByCategory[cat.slug] || [];
            if (catTools.length === 0) return null;

            return (
              <div key={cat.slug}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  <span className="text-sm font-normal text-gray-400">({catTools.length})</span>
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {catTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${cat.slug}/${tool.slug}`}
                      className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPARISONS BY CATEGORY */}
      {/* ============================================================ */}
      <section id="comparisons" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-xl">⚖️</span> All Comparisons ({totalComparisons})
        </h2>

        <div className="space-y-10">
          {CATEGORY_LIST.map((cat) => {
            const catComps = compsByCategory[cat.slug] || [];
            if (catComps.length === 0) return null;

            return (
              <div key={cat.slug}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  <span className="text-sm font-normal text-gray-400">({catComps.length})</span>
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {catComps.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/${cat.slug}/compare/${comp.slug}`}
                      className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      {comp.slug.split('-vs-').map((s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' vs ')}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* BEST OF LISTS */}
      {/* ============================================================ */}
      <section id="best-of" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-xl">🏆</span> Best Of Lists
        </h2>

        <div className="space-y-8">
          {CATEGORY_LIST.map((cat) => {
            const subs = SUBCATEGORIES[cat.slug] || [];
            if (subs.length === 0) return null;

            return (
              <div key={cat.slug}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {subs.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/${cat.slug}/best/${sub.slug}`}
                      className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      Best {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* BLOG POSTS */}
      {/* ============================================================ */}
      <section id="blog" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-xl">📝</span> Blog Posts ({totalPosts})
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {(posts || []).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              {post.title}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer note */}
      <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-400">
          This sitemap was last updated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
          For the machine-readable XML sitemap, visit{' '}
          <a href="/sitemap.xml" className="text-blue-500 hover:underline">/sitemap.xml</a>.
        </p>
      </div>
    </div>
  );
}
