import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CATEGORIES, CATEGORY_LIST, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';
import { GLOSSARY_TERMS, groupTermsByCategory } from '@/lib/glossary-data';

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
      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50/40 to-blue-50/30 dark:from-gray-900 dark:via-gray-900/40 dark:to-blue-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10 mb-12 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gray-400/10 dark:bg-gray-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100/80 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 text-xs font-semibold mb-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            Full Site Navigation
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            <span className="gradient-text">Site Map</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Browse all {totalTools}+ tool reviews, {totalComparisons}+ comparisons,
            and {totalPosts}+ blog posts on {SITE_NAME}.
          </p>

          {/* Quick stats — gradient pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { value: totalTools, label: 'Tool Reviews', color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20' },
              { value: totalComparisons, label: 'Comparisons', color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
              { value: totalPosts, label: 'Blog Posts', color: 'text-green-600 dark:text-green-400', bg: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
            ].map((stat, idx) => (
              <div key={stat.label} className={`flex items-center gap-2.5 bg-gradient-to-r ${stat.bg} backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-white/50 dark:border-gray-700/50 card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</span>
              </div>
            ))}
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
        <a href="#glossary" className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-full text-sm font-medium hover:bg-cyan-100 transition-colors">
          📖 Glossary
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
            { href: '/best', label: 'Best Of Hub' },
            { href: '/glossary', label: 'Tech Glossary' },
            { href: '/calculators', label: 'Calculators Hub' },
            { href: '/about', label: 'About Us' },
            { href: '/about/team', label: 'Our Team' },
            { href: '/contact', label: 'Contact' },
            { href: '/changelog', label: 'Changelog' },
            { href: '/calculators/roi', label: 'ROI Calculator' },
            { href: '/calculators/email-marketing-roi', label: 'Email Marketing ROI' },
            { href: '/calculators/hosting-cost', label: 'Hosting Cost Calculator' },
            { href: '/calculators/saas-metrics', label: 'SaaS Metrics Calculator' },
            { href: '/calculators/social-media-roi', label: 'Social Media ROI' },
            { href: '/calculators/ab-testing', label: 'A/B Testing Calculator' },
            { href: '/editorial-policy', label: 'Editorial Policy' },
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
                      href={`/best/${sub.slug}`}
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

      {/* ============================================================ */}
      {/* GLOSSARY TERMS */}
      {/* ============================================================ */}
      <section id="glossary" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="text-xl">📖</span> Glossary Terms ({GLOSSARY_TERMS.length})
        </h2>

        <div className="space-y-8">
          {Object.entries(groupTermsByCategory(GLOSSARY_TERMS)).map(([category, terms]) => (
            <div key={category}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                {category}
                <span className="text-sm font-normal text-gray-400">({terms.length})</span>
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {terms.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                  >
                    {term.term}
                  </Link>
                ))}
              </div>
            </div>
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
