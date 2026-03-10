import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CATEGORY_LIST, CATEGORIES, SUBCATEGORIES, SEO } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { generateFAQSchema } from '@/lib/schema';
import { ToolLogo } from '@/components/common/ToolLogo';
import { RatingStars } from '@/components/common/RatingStars';
import { AdBanner, AdInArticle, AdMultiplex, AdNative } from '@/components/ads/AdSlot';
import { RecentlyViewed } from '@/components/common/RecentlyViewed';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';
import { ToolFinder } from '@/components/common/ToolFinder';
import { RevealOnScroll } from '@/components/common/RevealOnScroll';

export const revalidate = 3600;

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `${SITE_NAME} — Compare the Best Digital Tools in ${year}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Compare the Best Digital Tools in ${year}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: `${SITE_NAME} — Compare the Best Digital Tools in ${year}`,
    description: SITE_DESCRIPTION,
  },
};

export default async function HomePage() {
  // Parallel fetch all homepage data for maximum performance
  const [
    { data: trendingTools },
    { data: allTools },
    { data: latestComparisons },
    { data: latestPosts },
    { data: recentlyUpdated },
    { count: toolCount },
    { count: comparisonCount },
  ] = await Promise.all([
    // 1. Trending tools across ALL categories
    supabase
      .from('tools')
      .select('slug, name, category_slug, tagline, ratings_overall, logo_url, pricing')
      .eq('status', 'published')
      .order('ratings_overall', { ascending: false })
      .limit(9),
    // 2. All tools for "Popular by Category" section
    supabase
      .from('tools')
      .select('slug, name, category_slug, tagline, ratings_overall, logo_url')
      .eq('status', 'published')
      .order('ratings_overall', { ascending: false }),
    // 3. Latest comparisons
    supabase
      .from('comparisons')
      .select(`
        slug, category_slug, meta_title,
        tool_a:tools!comparisons_tool_a_id_fkey(name, slug, logo_url, ratings_overall),
        tool_b:tools!comparisons_tool_b_id_fkey(name, slug, logo_url, ratings_overall)
      `)
      .order('created_at', { ascending: false })
      .limit(8),
    // 4. Latest blog posts
    supabase
      .from('blog_posts')
      .select('slug, title, excerpt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
    // 5. Recently updated tools — freshness signal
    supabase
      .from('tools')
      .select('slug, name, category_slug, tagline, ratings_overall, logo_url, last_updated')
      .eq('status', 'published')
      .order('last_updated', { ascending: false })
      .limit(6),
    // 6. Tool count
    supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    // 7. Comparison count
    supabase
      .from('comparisons')
      .select('*', { count: 'exact', head: true }),
  ]);

  // Group tools by category
  const toolsByCategory: Record<string, typeof allTools> = {};
  (allTools || []).forEach((tool) => {
    if (!toolsByCategory[tool.category_slug]) {
      toolsByCategory[tool.category_slug] = [];
    }
    toolsByCategory[tool.category_slug]!.push(tool);
  });

  // ItemList schema for trending tools — enables ranking carousel in SERPs
  const trendingItemListSchema = trendingTools && trendingTools.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Trending Digital Tools',
    description: 'The highest rated digital tools across all categories, curated by ProPicked experts.',
    numberOfItems: trendingTools.length,
    itemListElement: trendingTools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.name,
      url: `${SITE_URL}/${tool.category_slug}/${tool.slug}`,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.tagline,
        applicationCategory: 'BusinessApplication',
        ...(tool.logo_url && { image: tool.logo_url }),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.ratings_overall,
          bestRating: 10,
          worstRating: 1,
          ratingCount: 1,
        },
      },
    })),
  } : null;

  return (
    <>
      {/* Trending Tools ItemList Schema */}
      {trendingItemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(trendingItemListSchema) }}
        />
      )}

      {/* ============================================================ */}
      {/* HERO SECTION — Premium gradient with animated blobs */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Updated for 2026 — {toolCount || 40}+ tools across {Object.keys(CATEGORIES).length} categories
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 gradient-text">
            Find the Right Tool
            <br />
            for Your Business
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Compare AI tools, SaaS platforms, e-commerce builders, marketing suites, and more.
            Data-driven, unbiased reviews. Zero sponsorships.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <Link
              href="/search"
              className="flex items-center gap-3 px-5 py-4 glass rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-400">Search tools, compare features, find pricing...</span>
            </Link>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <CategoryIcon icon={cat.icon} color={cat.color} /> {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-tools"
              className="glow-pulse inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Explore AI Tools
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Compare Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LIVE STATS — Glassmorphism gradient pills */}
      {/* ============================================================ */}
      <section className="relative border-y border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { end: toolCount || 40, suffix: '+', label: 'Tools Reviewed', icon: '🛠️', color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20' },
              { end: comparisonCount || 30, suffix: '+', label: 'Comparisons', icon: '⚖️', color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
              { end: Object.keys(CATEGORIES).length, suffix: '', label: 'Categories', icon: '📂', color: 'text-orange-600 dark:text-orange-400', bg: 'from-orange-100/80 to-orange-50/80 dark:from-orange-900/30 dark:to-orange-800/20' },
              { end: 100, suffix: '%', label: 'Independent', icon: '✅', color: 'text-green-600 dark:text-green-400', bg: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
            ].map((stat, idx) => (
              <div key={stat.label} className={`flex flex-col items-center p-5 bg-gradient-to-r ${stat.bg} backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className={`text-3xl md:text-4xl font-extrabold ${stat.color}`}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SOCIAL PROOF STRIP — Compact trust bar below stats */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              No sponsored rankings
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Verified pricing data
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Updated monthly
            </span>
          </div>
          <span className="hidden md:block w-px h-5 bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5 italic text-gray-400 dark:text-gray-500">
            <svg className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            &ldquo;Saved us weeks of research&rdquo; — Sarah C., VP Sales
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* QUICK BROWSE — Popular subcategory links for SEO crawling */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Quick Browse</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SUBCATEGORIES).flatMap(([catSlug, subs]) =>
            subs.slice(0, 3).map((sub) => (
              <Link
                key={sub.slug}
                href={`/best/${sub.slug}`}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                {sub.name}
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* RECENTLY VIEWED — Personalized browsing history */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <RecentlyViewed variant="strip" title="Recently Viewed" maxItems={8} />
      </div>

      {/* ============================================================ */}
      {/* TRENDING TOOLS — Top rated across all categories */}
      {/* ============================================================ */}
      <RevealOnScroll>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Trending Tools</h2>
            <p className="text-gray-500 mt-1">The highest rated tools across all categories</p>
          </div>
          <Link href="/search" className="text-blue-600 font-medium hover:underline text-sm">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(trendingTools || []).map((tool, i) => {
            const catInfo = CATEGORIES[tool.category_slug];
            return (
              <Link
                key={tool.slug}
                href={`/${tool.category_slug}/${tool.slug}`}
                className="group hover-lift flex items-start gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 transition-all duration-200 bg-white dark:bg-gray-900 card-animate"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex-shrink-0 relative">
                  <ToolLogo logoUrl={tool.logo_url || ''} name={tool.name} size={48} className="p-1" priority={i < 3} />
                  {i < 3 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-[10px] font-bold rounded-full flex items-center justify-center text-yellow-900">
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold group-hover:text-blue-600 transition-colors truncate">
                      {tool.name}
                    </h3>
                    <span className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
                      {tool.ratings_overall}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{tool.tagline}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${catInfo?.color || '#3B82F6'}15`,
                        color: catInfo?.color || '#3B82F6',
                      }}
                    >
                      {catInfo?.name || tool.category_slug}
                    </span>
                    {tool.pricing?.hasFreePlan && (
                      <span className="text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Free plan
                      </span>
                    )}
                    {tool.pricing?.startingPrice != null && tool.pricing.startingPrice > 0 && (
                      <span className="text-[10px] text-gray-400">
                        From ${tool.pricing.startingPrice}/mo
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </RevealOnScroll>

      {/* ============================================================ */}
      {/* POPULAR ALTERNATIVES — Target "[Tool] alternatives" search queries */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Popular Alternatives</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(trendingTools || []).slice(0, 8).map((tool) => (
            <Link
              key={`alt-${tool.slug}`}
              href={`/${tool.category_slug}/${tool.slug}/alternatives`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
            >
              {tool.name} Alternatives
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* RECENTLY UPDATED — Freshness signal for Google & users */}
      {/* ============================================================ */}
      {recentlyUpdated && recentlyUpdated.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-14 border-y border-gray-200/60 dark:border-gray-800/60">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600" />
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Fresh Data</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Recently Updated</h2>
                <p className="text-gray-500 mt-1">Reviews refreshed with the latest pricing and feature data</p>
              </div>
              <Link href="/changelog" className="text-green-600 font-medium hover:underline text-sm">
                View changelog →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyUpdated.map((tool, idx) => {
                const catInfo = CATEGORIES[tool.category_slug];
                const updatedDate = new Date(tool.last_updated);
                const daysAgo = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
                const freshnessLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : daysAgo <= 7 ? `${daysAgo}d ago` : updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <Link
                    key={tool.slug}
                    href={`/${tool.category_slug}/${tool.slug}`}
                    className="group hover-lift flex items-start gap-4 p-5 border border-gray-200/80 dark:border-gray-800 rounded-2xl hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 bg-white dark:bg-gray-900 card-animate"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <ToolLogo logoUrl={tool.logo_url} name={tool.name} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm group-hover:text-green-600 transition-colors truncate">{tool.name}</h3>
                        <span className="flex-shrink-0 text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">
                          {freshnessLabel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{tool.tagline}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="text-yellow-500">&#9733;</span>
                          <span className="font-semibold">{tool.ratings_overall.toFixed(1)}</span>
                        </span>
                        {catInfo && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                            {catInfo.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========== AD: AFTER RECENTLY UPDATED ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>

      {/* ============================================================ */}
      {/* POPULAR COMPARISONS — VS battles across categories */}
      {/* ============================================================ */}
      {latestComparisons && latestComparisons.length > 0 && (
        <RevealOnScroll>
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Popular Comparisons</h2>
                <p className="text-gray-500 mt-1">Head-to-head tool battles across all categories</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {latestComparisons.map((comp: Record<string, unknown>) => {
                const toolA = comp.tool_a as { name: string; slug: string; logo_url?: string; ratings_overall?: number } | null;
                const toolB = comp.tool_b as { name: string; slug: string; logo_url?: string; ratings_overall?: number } | null;
                const catSlug = comp.category_slug as string;
                const catInfo = CATEGORIES[catSlug];

                return (
                  <Link
                    key={comp.slug as string}
                    href={`/${catSlug}/compare/${comp.slug}`}
                    className="group hover-lift shine-hover relative p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 transition-all"
                  >
                    {/* Category badge */}
                    <span
                      className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${catInfo?.color || '#3B82F6'}15`,
                        color: catInfo?.color || '#3B82F6',
                      }}
                    >
                      {catInfo?.name || catSlug}
                    </span>

                    <div className="flex items-center gap-4">
                      {/* Tool A */}
                      <div className="flex items-center gap-2 flex-1">
                        <ToolLogo logoUrl={toolA?.logo_url || ''} name={toolA?.name || 'A'} size={32} className="p-0.5" />
                        <div>
                          <span className="font-bold text-sm text-blue-600">{toolA?.name || 'Tool A'}</span>
                          {toolA?.ratings_overall && (
                            <div className="text-[10px] text-gray-400">{toolA.ratings_overall}/10</div>
                          )}
                        </div>
                      </div>

                      {/* VS badge */}
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 rounded-full text-xs font-extrabold tracking-wider">
                        VS
                      </span>

                      {/* Tool B */}
                      <div className="flex items-center gap-2 flex-1 justify-end text-right">
                        <div>
                          <span className="font-bold text-sm text-purple-600">{toolB?.name || 'Tool B'}</span>
                          {toolB?.ratings_overall && (
                            <div className="text-[10px] text-gray-400">{toolB.ratings_overall}/10</div>
                          )}
                        </div>
                        <ToolLogo logoUrl={toolB?.logo_url || ''} name={toolB?.name || 'B'} size={32} className="p-0.5" />
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      View full comparison →
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        </RevealOnScroll>
      )}

      {/* ========== AD: AFTER COMPARISONS ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdInArticle />
      </div>

      {/* ============================================================ */}
      {/* BROWSE BY CATEGORY — Enhanced cards with tool counts */}
      {/* ============================================================ */}
      <RevealOnScroll>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Whether you need an AI assistant, CRM, website builder, or marketing platform — we have got you covered.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_LIST.map((cat) => {
              const catTools = toolsByCategory[cat.slug] || [];
              const topTools = catTools.slice(0, 3);
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group hover-lift shine-hover relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <CategoryIcon icon={cat.icon} color={cat.color} />
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                      {catTools.length} tools
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Top tools preview */}
                  {topTools.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      {topTools.map((t) => (
                        <span key={t.slug} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                          {t.name}
                        </span>
                      ))}
                      {catTools.length > 3 && (
                        <span className="text-xs text-gray-400">+{catTools.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore {cat.name} →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* ========== AD: AFTER BROWSE BY CATEGORY ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdNative />
      </div>

      {/* ============================================================ */}
      {/* POPULAR TOOLS BY CATEGORY — Tabbed view of top tools */}
      {/* ============================================================ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Top Rated Tools
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            The best tools in each category, based on expert reviews and user feedback.
          </p>

          <div className="space-y-8">
            {CATEGORY_LIST.map((cat) => {
              const catTools = (toolsByCategory[cat.slug] || []).slice(0, 4);
              if (catTools.length === 0) return null;

              return (
                <div key={cat.slug}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <CategoryIcon icon={cat.icon} color={cat.color} />
                    </div>
                    <h3 className="text-lg font-bold">{cat.name}</h3>
                    <Link href={`/${cat.slug}`} className="text-xs text-blue-600 hover:underline ml-auto">
                      View all →
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {catTools.map((tool, i) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.category_slug}/${tool.slug}`}
                        className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <ToolLogo logoUrl={tool.logo_url || ''} name={tool.name} size={40} className="p-1" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate">
                            {tool.name}
                          </div>
                          <RatingStars score={tool.ratings_overall || 0} size="xs" showScore />
                        </div>
                        {i === 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-bold">
                            #1
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LATEST BLOG POSTS */}
      {/* ============================================================ */}
      {latestPosts && latestPosts.length > 0 && (
        <RevealOnScroll>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Latest Insights</h2>
                <p className="text-gray-500 mt-1">Expert guides and analysis</p>
              </div>
              <Link href="/blog" className="text-blue-600 font-medium hover:underline text-sm">
                All articles →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestPosts.map((post, idx) => {
                const gradients = [
                  'from-blue-500 via-indigo-500 to-purple-600',
                  'from-emerald-500 via-teal-500 to-cyan-600',
                  'from-orange-500 via-rose-500 to-pink-600',
                ];
                const icons = [
                  <svg key="pen" className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
                  <svg key="chart" className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
                  <svg key="bulb" className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>,
                ];
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group hover-lift card-animate bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className={`relative h-32 bg-gradient-to-br ${gradients[idx % 3]} flex items-center justify-center`}>
                      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                      <div className="relative">{icons[idx % 3]}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        </RevealOnScroll>
      )}

      {/* ============================================================ */}
      {/* BROWSE SUBCATEGORIES — Deep links to all verticals */}
      {/* ============================================================ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Explore by Specialization
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Dive deeper into specific tool categories to find exactly what you need.
          </p>

          <div className="space-y-8">
            {CATEGORY_LIST.map((cat) => {
              const subs = SUBCATEGORIES[cat.slug] || [];
              if (subs.length === 0) return null;
              return (
                <div key={cat.slug}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <CategoryIcon icon={cat.icon} color={cat.color} />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">{cat.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subs.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/best/${sub.slug}`}
                        className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== AD: BEFORE HOW IT WORKS ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdMultiplex />
      </div>

      {/* ============================================================ */}
      {/* USE CASES — Target different audiences for engagement */}
      {/* ============================================================ */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Who Uses {SITE_NAME}?
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            From solo founders to enterprise teams, we help every type of decision-maker.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                emoji: '🚀',
                title: 'Startup Founders',
                desc: 'Find affordable tools that scale with your growth. Compare free plans and startup-friendly pricing.',
                cta: 'Explore SaaS Tools',
                href: '/saas',
                gradient: 'from-blue-500/10 to-blue-600/5',
              },
              {
                emoji: '📊',
                title: 'Marketing Teams',
                desc: 'Compare SEO, email, social, and analytics tools. Find the stack that maximizes your ROI.',
                cta: 'Marketing Tools',
                href: '/marketing',
                gradient: 'from-purple-500/10 to-purple-600/5',
              },
              {
                emoji: '💻',
                title: 'Developers',
                desc: 'Evaluate hosting, CI/CD, AI coding assistants, and DevOps platforms side by side.',
                cta: 'Hosting & Dev Tools',
                href: '/hosting',
                gradient: 'from-green-500/10 to-green-600/5',
              },
              {
                emoji: '🏢',
                title: 'Enterprise Buyers',
                desc: 'Compare enterprise-grade solutions with security, compliance, and support ratings.',
                cta: 'Business Tools',
                href: '/business',
                gradient: 'from-orange-500/10 to-orange-600/5',
              },
            ].map((useCase) => (
              <Link
                key={useCase.title}
                href={useCase.href}
                className={`group hover-lift p-6 rounded-2xl bg-gradient-to-br ${useCase.gradient} border border-gray-200 dark:border-gray-800 hover:border-blue-300 transition-all`}
              >
                <div className="text-3xl mb-3">{useCase.emoji}</div>
                <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors">{useCase.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{useCase.desc}</p>
                <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform inline-block">
                  {useCase.cta} &#8594;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SOCIAL PROOF — Testimonials and trust signals */}
      {/* ============================================================ */}
      <RevealOnScroll>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Trusted by Decision-Makers
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            See what our users say about finding the right tools with {SITE_NAME}.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'ProPicked saved our team weeks of research. The comparison tables made it easy to choose between HubSpot and Salesforce for our growing sales team.',
                name: 'Sarah Chen',
                role: 'VP of Sales, TechScale',
                avatar: 'SC',
                color: 'from-blue-500 to-blue-600',
              },
              {
                quote: 'Finally, a review site that does not feel like one big ad. The ratings are fair, the pricing data is accurate, and the pros/cons are genuinely helpful.',
                name: 'Marcus Rivera',
                role: 'CTO, LaunchPad Studios',
                avatar: 'MR',
                color: 'from-purple-500 to-purple-600',
              },
              {
                quote: 'We switched our entire marketing stack based on ProPicked recommendations. The ROI calculator alone saved us $2,400/year on unnecessary subscriptions.',
                name: 'Priya Patel',
                role: 'Marketing Director, GrowthBox',
                avatar: 'PP',
                color: 'from-green-500 to-green-600',
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift"
              >
                {/* Quote mark */}
                <div className="absolute -top-3 left-6 text-4xl text-blue-200 dark:text-blue-900 font-serif">&ldquo;</div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 mt-2">
                  {testimonial.quote}
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </RevealOnScroll>

      {/* ============================================================ */}
      {/* TRUST SIGNALS */}
      {/* ============================================================ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Trust {SITE_NAME}?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Our methodology ensures every review is fair, thorough, and useful.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Independent Reviews',
                desc: 'Zero sponsored content. We buy and test every tool ourselves.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Data-Driven Scores',
                desc: 'Ratings based on features, ease of use, value, and support quality.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Updated Monthly',
                desc: 'Pricing and features verified monthly. No stale, outdated info.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Real User Feedback',
                desc: 'Aggregated from thousands of verified user reviews and testimonials.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOOL FINDER — Interactive decision tree quiz */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ToolFinder />
      </div>

      {/* ============================================================ */}
      {/* NEWSLETTER SIGNUP — Lead capture banner */}
      {/* ============================================================ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <NewsletterSignup variant="banner" />
      </div>

      {/* ============================================================ */}
      {/* FAQ SECTION — SEO-rich content with FAQ schema */}
      {/* ============================================================ */}
      <HomeFAQ toolCount={toolCount || 40} comparisonCount={comparisonCount || 30} />

      {/* ============================================================ */}
      {/* QUICK ACCESS — Deep links to all resources for max internal linking */}
      {/* ============================================================ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Free Tools & Resources
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Calculators, guides, and research tools to help you make smarter software decisions.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Calculators */}
            <Link
              href="/calculators/roi"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl flex-shrink-0">💰</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">ROI Calculator</h3>
                <p className="text-xs text-gray-500 mt-0.5">Estimate return on your software investment</p>
              </div>
            </Link>
            <Link
              href="/calculators/email-marketing-roi"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl flex-shrink-0">📧</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Email Marketing ROI</h3>
                <p className="text-xs text-gray-500 mt-0.5">Calculate your email campaign profitability</p>
              </div>
            </Link>
            <Link
              href="/calculators/hosting-cost"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl flex-shrink-0">🖥️</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Hosting Cost Calculator</h3>
                <p className="text-xs text-gray-500 mt-0.5">Compare hosting plans by total cost</p>
              </div>
            </Link>
            <Link
              href="/calculators/ecommerce-profit"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl flex-shrink-0">🛒</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">E-commerce Profit Calculator</h3>
                <p className="text-xs text-gray-500 mt-0.5">Project your online store profitability</p>
              </div>
            </Link>
            <Link
              href="/calculators/ai-cost"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xl flex-shrink-0">🤖</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">AI Cost Estimator</h3>
                <p className="text-xs text-gray-500 mt-0.5">Estimate AI API and platform costs</p>
              </div>
            </Link>
            <Link
              href="/calculators/team-productivity"
              className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-xl flex-shrink-0">📊</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Team Productivity Calculator</h3>
                <p className="text-xs text-gray-500 mt-0.5">Measure productivity gains from new tools</p>
              </div>
            </Link>
          </div>

          {/* Extra resource links */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/best"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-xl">🏆</span>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">Best-Of Rankings</h3>
                <p className="text-[11px] text-gray-500">Curated top picks by category</p>
              </div>
            </Link>
            <Link
              href="/glossary"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-xl">📖</span>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Glossary</h3>
                <p className="text-[11px] text-gray-500">SaaS & tech terms explained</p>
              </div>
            </Link>
            <Link
              href="/blog"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/30 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-xl">📝</span>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">Blog & Guides</h3>
                <p className="text-[11px] text-gray-500">Expert insights & how-tos</p>
              </div>
            </Link>
            <Link
              href="/changelog"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/10 dark:to-fuchsia-900/10 border border-purple-200 dark:border-purple-800/30 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-xl">🔄</span>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Changelog</h3>
                <p className="text-[11px] text-gray-500">Latest site updates</p>
              </div>
            </Link>
          </div>

          {/* Comparison hub links per category */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Comparison Hubs
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/compare`}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  {cat.name} Comparisons
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS — HowTo schema for rich snippets */}
      {/* ============================================================ */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: `How to Find the Best Software with ${SITE_NAME}`,
              description: `Use ${SITE_NAME} to compare digital tools across AI, SaaS, E-commerce, Marketing, Hosting & Business in 3 simple steps.`,
              url: SITE_URL,
              totalTime: 'PT3M',
              step: [
                { '@type': 'HowToStep', position: 1, name: 'Search & Browse', text: 'Search by name or browse by category to discover tools that match your needs.' },
                { '@type': 'HowToStep', position: 2, name: 'Compare Side-by-Side', text: 'Use our comparison pages to evaluate features, pricing, and ratings between your top picks.' },
                { '@type': 'HowToStep', position: 3, name: 'Make Your Decision', text: 'Read expert reviews with pros, cons, and verdict to choose the perfect tool confidently.' },
              ],
            }),
          }}
        />
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              3 Simple Steps
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">How {SITE_NAME} Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Finding the perfect tool shouldn&apos;t be hard. Here&apos;s how we make it easy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Browse',
                description: 'Search by name or browse by category to discover tools that match your needs.',
                icon: '🔍',
                gradient: 'from-blue-500 to-cyan-400',
                link: '/search',
                cta: 'Start Searching',
              },
              {
                step: '02',
                title: 'Compare Side-by-Side',
                description: 'Use our comparison pages to evaluate features, pricing, and ratings between your top picks.',
                icon: '⚖️',
                gradient: 'from-purple-500 to-indigo-400',
                link: '/ai-tools/compare',
                cta: 'See Comparisons',
              },
              {
                step: '03',
                title: 'Make Your Decision',
                description: 'Read expert reviews with pros, cons, and verdict to choose the perfect tool confidently.',
                icon: '✅',
                gradient: 'from-green-500 to-emerald-400',
                link: '/best',
                cta: 'View Best-of Lists',
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center hover-lift card-animate"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Step number connector line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gray-200 dark:bg-gray-700 z-10" />
                )}
                {/* Step icon */}
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {item.icon}
                </div>
                {/* Step number */}
                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.cta} &#8594;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA SECTION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Ready to Find Your Perfect Tool?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Stop paying for the wrong software. Compare {toolCount || 40}+ tools side by side and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="glow-pulse inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
              >
                Search Tools
              </Link>
              <Link
                href="/ai-tools"
                className="inline-flex items-center justify-center px-10 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryIcon({ icon, color }: { icon: string; color: string }) {
  const icons: Record<string, string> = {
    brain: '🧠',
    cloud: '☁️',
    'shopping-cart': '🛒',
    megaphone: '📢',
    server: '🖥️',
    briefcase: '💼',
  };
  return <span style={{ color }}>{icons[icon] || '📦'}</span>;
}

const HOME_FAQS = [
  {
    question: 'How does ProPicked compare and rate tools?',
    answer: 'We evaluate every tool across five key dimensions, each weighted equally at 20%: Features & Functionality, Ease of Use, Pricing & Plans, Customer Support, and Value for Money. Our team tests each product hands-on, aggregates verified user reviews, and updates scores monthly to ensure accuracy. Read our full editorial policy for details.',
  },
  {
    question: 'Is ProPicked really independent and unbiased?',
    answer: 'Yes. ProPicked does not accept sponsored placements or paid reviews. Our revenue comes from display advertising and affiliate partnerships — we may earn a commission when you click through and purchase a tool, but this never influences our ratings or rankings. Every tool is scored using the same methodology. Read our editorial policy for full transparency.',
  },
  {
    question: 'How often are tool reviews updated?',
    answer: 'We update pricing, features, and ratings on a monthly basis. When a tool releases a major update or changes its pricing, we re-evaluate and adjust our scores within 48 hours to keep information current.',
  },
  {
    question: 'Can I compare more than two tools at once?',
    answer: 'Our comparison pages are designed for detailed head-to-head matchups between two tools. However, you can use our category pages and Best Of lists to compare multiple tools side by side using our comparison tables that show ratings, pricing, and key features.',
  },
  {
    question: 'What categories of tools does ProPicked cover?',
    answer: 'ProPicked covers six major categories: AI Tools (writing, image, coding, chatbots), SaaS (CRM, project management, HR), E-commerce (store builders, payments, shipping), Marketing (SEO, email, social media), Web Hosting (shared, VPS, cloud, WordPress), and Business Tools (accounting, legal, productivity, cybersecurity).',
  },
  {
    question: 'How do I find the best tool for my specific needs?',
    answer: 'Start with our Search page to find tools by name or feature. Then browse our Best Of lists for curated recommendations by subcategory. Use our comparison pages to do detailed side-by-side analysis between your top picks. Each tool review includes a "Best For" section to help match tools to specific use cases.',
  },
  {
    question: 'What is the best AI tool for beginners in 2026?',
    answer: 'For beginners, we recommend starting with tools that offer free plans and intuitive interfaces. ChatGPT and Claude are top picks for general AI assistants, Canva for AI-powered design, and Jasper for AI writing. Visit our Best AI Tools page for the full ranking with beginner-friendly filters.',
  },
  {
    question: 'How much does business software cost on average?',
    answer: 'Business software pricing varies widely by category. CRM tools range from free (HubSpot CRM) to $150+/user/month (Salesforce Enterprise). Project management tools typically cost $5-30/user/month. Our pricing pages break down every plan tier, hidden fees, and annual vs monthly billing to help you find the best value.',
  },
  {
    question: 'Does ProPicked offer free tools and calculators?',
    answer: 'Yes! ProPicked offers six free calculators: ROI Calculator, Email Marketing ROI, Hosting Cost Calculator, E-commerce Profit Calculator, AI Cost Estimator, and Team Productivity Calculator. We also provide a comprehensive software glossary with 60+ terms explained and expert-written buying guides for every category.',
  },
  {
    question: 'How do I switch from one tool to another without losing data?',
    answer: 'Most modern SaaS tools offer data export features (CSV, API, native integrations). Our tool reviews include a "Migration" section when applicable, covering data portability, import/export options, and integration with popular platforms. Check the specific tool review for step-by-step migration guidance.',
  },
];

function HomeFAQ({ toolCount, comparisonCount }: { toolCount: number; comparisonCount: number }) {
  const faqSchema = generateFAQSchema(
    HOME_FAQS.map((f) => ({ question: f.question, answer: f.answer }))
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Everything you need to know about using {SITE_NAME} to find the perfect tools.
        </p>

        <div className="space-y-4">
          {HOME_FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover-lift"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 font-semibold text-left">
                <span className="pr-4">{faq.question}</span>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 md:px-6 md:pb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
