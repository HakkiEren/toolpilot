import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST, CATEGORIES, SUBCATEGORIES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { generateFAQSchema } from '@/lib/schema';
import { ToolLogo } from '@/components/common/ToolLogo';
import { AdBanner, AdInArticle, AdMultiplex, AdNative } from '@/components/ads/AdSlot';

export const revalidate = 3600;

export default async function HomePage() {
  // Fetch trending tools across ALL categories
  const { data: trendingTools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, tagline, ratings_overall, logo_url, pricing')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .limit(9);

  // Fetch tools by category for "Popular by Category" section
  const { data: allTools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, tagline, ratings_overall, logo_url')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false });

  // Group tools by category
  const toolsByCategory: Record<string, typeof allTools> = {};
  (allTools || []).forEach((tool) => {
    if (!toolsByCategory[tool.category_slug]) {
      toolsByCategory[tool.category_slug] = [];
    }
    toolsByCategory[tool.category_slug]!.push(tool);
  });

  // Fetch latest comparisons across ALL categories
  const { data: latestComparisons } = await supabase
    .from('comparisons')
    .select(`
      slug, category_slug, meta_title,
      tool_a:tools!comparisons_tool_a_id_fkey(name, slug, logo_url, ratings_overall),
      tool_b:tools!comparisons_tool_b_id_fkey(name, slug, logo_url, ratings_overall)
    `)
    .order('created_at', { ascending: false })
    .limit(8);

  // Fetch latest blog posts
  const { data: latestPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  // Count totals for stats
  const { count: toolCount } = await supabase
    .from('tools')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: comparisonCount } = await supabase
    .from('comparisons')
    .select('*', { count: 'exact', head: true });

  return (
    <>
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
      {/* LIVE STATS — Dynamic numbers from database */}
      {/* ============================================================ */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { end: toolCount || 40, suffix: '+', label: 'Tools Reviewed', icon: '🛠️' },
              { end: comparisonCount || 30, suffix: '+', label: 'Comparisons', icon: '⚖️' },
              { end: Object.keys(CATEGORIES).length, suffix: '', label: 'Categories', icon: '📂' },
              { end: 100, suffix: '%', label: 'Independent', icon: '✅' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRENDING TOOLS — Top rated across all categories */}
      {/* ============================================================ */}
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
                  <ToolLogo logoUrl={tool.logo_url || ''} name={tool.name} size={48} className="p-1" />
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
                    {tool.pricing?.startingPrice && (
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

      {/* ========== AD: AFTER TRENDING TOOLS ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner />
      </div>

      {/* ============================================================ */}
      {/* POPULAR COMPARISONS — VS battles across categories */}
      {/* ============================================================ */}
      {latestComparisons && latestComparisons.length > 0 && (
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
      )}

      {/* ========== AD: AFTER COMPARISONS ========== */}
      <div className="max-w-7xl mx-auto px-4">
        <AdInArticle />
      </div>

      {/* ============================================================ */}
      {/* BROWSE BY CATEGORY — Enhanced cards with tool counts */}
      {/* ============================================================ */}
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
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex">
                              {[...Array(5)].map((_, si) => (
                                <svg
                                  key={si}
                                  className={`w-3 h-3 ${si < Math.round((tool.ratings_overall || 0) / 2) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{tool.ratings_overall}</span>
                          </div>
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
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover-lift bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all"
                >
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="p-5">
                    <h3 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <div className="text-xs text-gray-400 mt-3">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
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
      {/* HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How {SITE_NAME} Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a Category',
                desc: 'Browse AI tools, SaaS, e-commerce platforms, marketing tools, hosting providers and business software.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02',
                title: 'Compare Side by Side',
                desc: 'See features, pricing, pros & cons in detailed comparison tables. No sponsored rankings.',
                color: 'from-purple-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Make the Right Choice',
                desc: 'Get recommendations based on your team size, budget, and specific use case.',
                color: 'from-green-500 to-green-600',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover-lift card-animate" style={{ animationDelay: `${parseInt(item.step) * 150}ms` }}>
                <div className={`inline-flex w-14 h-14 items-center justify-center bg-gradient-to-r ${item.color} text-white rounded-2xl text-lg font-bold mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      {/* FAQ SECTION — SEO-rich content with FAQ schema */}
      {/* ============================================================ */}
      <HomeFAQ toolCount={toolCount || 40} comparisonCount={comparisonCount || 30} />

      {/* ============================================================ */}
      {/* CTA SECTION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Tool?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Stop paying for the wrong software. Compare {toolCount || 40}+ tools side by side and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="glow-pulse inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Search Tools
              </Link>
              <Link
                href="/ai-tools"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
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
    question: 'How does ToolPilot compare and rate tools?',
    answer: 'We evaluate every tool across four key dimensions: Features (30%), Ease of Use (25%), Value for Money (25%), and Customer Support (20%). Our team tests each product hands-on, aggregates verified user reviews, and updates scores monthly to ensure accuracy.',
  },
  {
    question: 'Is ToolPilot really independent and unbiased?',
    answer: 'Yes. ToolPilot does not accept sponsored placements or paid reviews. Our revenue comes from advertising, not from the tools we review. This ensures our ratings and recommendations remain 100% independent and data-driven.',
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
    question: 'What categories of tools does ToolPilot cover?',
    answer: 'ToolPilot covers six major categories: AI Tools (writing, image, coding, chatbots), SaaS (CRM, project management, HR), E-commerce (store builders, payments, shipping), Marketing (SEO, email, social media), Web Hosting (shared, VPS, cloud, WordPress), and Business Tools (accounting, legal, productivity, cybersecurity).',
  },
  {
    question: 'How do I find the best tool for my specific needs?',
    answer: 'Start with our Search page to find tools by name or feature. Then browse our Best Of lists for curated recommendations by subcategory. Use our comparison pages to do detailed side-by-side analysis between your top picks. Each tool review includes a "Best For" section to help match tools to specific use cases.',
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
