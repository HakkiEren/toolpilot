import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const revalidate = 3600;

export default async function HomePage() {
  // Fetch trending tools for the hero section
  const { data: trendingTools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, tagline, ratings_overall, pricing')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false })
    .limit(6);

  // Fetch latest comparisons
  const { data: latestComparisons } = await supabase
    .from('comparisons')
    .select(`
      slug, category_slug, meta_title,
      tool_a:tools!comparisons_tool_a_id_fkey(name),
      tool_b:tools!comparisons_tool_b_id_fkey(name)
    `)
    .order('created_at', { ascending: false })
    .limit(4);

  // Fetch latest blog posts
  const { data: latestPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <>
      {/* Hero Section — Animated gradient */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
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
            Updated for 2026 — Now with AI Agent comparisons
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Find the Right Tool
            <br />
            for Your Business
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Compare AI tools, SaaS platforms, and digital products with data-driven, unbiased reviews.
            Zero sponsorships. Just honest analysis.
          </p>

          {/* Search Bar in Hero */}
          <div className="max-w-xl mx-auto mb-10">
            <Link
              href="/search"
              className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 transition-all group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-400">Search AI tools, compare features, find pricing...</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-tools"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              🧠 Explore AI Tools
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📚 Read Our Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Counter */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { end: 500, suffix: '+', label: 'Tools Compared', icon: '🛠️' },
              { end: 25, suffix: '+', label: 'Comparisons', icon: '⚖️' },
              { end: 12, suffix: '', label: 'Categories', icon: '📂' },
              { end: 100, suffix: '%', label: 'Unbiased', icon: '✅' },
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

      {/* 🔥 Trending Tools */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">🔥 Trending AI Tools</h2>
            <p className="text-gray-500 mt-1">The most popular tools right now</p>
          </div>
          <Link href="/ai-tools" className="text-blue-600 font-medium hover:underline text-sm">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(trendingTools || []).map((tool, i) => (
            <Link
              key={tool.slug}
              href={`/${tool.category_slug}/${tool.slug}`}
              className="group flex items-start gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold group-hover:text-blue-600 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <span className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded font-semibold">
                    ⭐ {tool.ratings_overall}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{tool.tagline}</p>
                <div className="flex gap-2 mt-2">
                  {tool.pricing?.hasFreeplan && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Free plan
                    </span>
                  )}
                  {tool.pricing?.startingPrice && (
                    <span className="text-xs text-gray-400">
                      From ${tool.pricing.startingPrice}/mo
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Whether you need an AI assistant, CRM, website builder, or marketing platform — we have got you covered.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <CategoryIcon icon={cat.icon} color={cat.color} />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore {cat.name} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Comparisons */}
      {latestComparisons && latestComparisons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">⚖️ Latest Comparisons</h2>
              <p className="text-gray-500 mt-1">Head-to-head tool battles</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {latestComparisons.map((comp: Record<string, unknown>) => {
              const toolA = comp.tool_a as { name: string } | null;
              const toolB = comp.tool_b as { name: string } | null;
              return (
                <Link
                  key={comp.slug as string}
                  href={`/${comp.category_slug}/compare/${comp.slug}`}
                  className="group flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-bold text-blue-600">{toolA?.name || 'Tool A'}</span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full text-xs font-bold">
                      VS
                    </span>
                    <span className="font-bold text-purple-600">{toolB?.name || 'Tool B'}</span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">📝 Latest Insights</h2>
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
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
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

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How {SITE_NAME} Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Choose a Category',
                desc: 'Browse AI tools, SaaS, e-commerce platforms, marketing tools, hosting providers and more.',
              },
              {
                step: '02',
                icon: '⚖️',
                title: 'Compare Side by Side',
                desc: 'See features, pricing, pros & cons in detailed comparison tables. No sponsored rankings.',
              },
              {
                step: '03',
                icon: '🏆',
                title: 'Make the Right Choice',
                desc: 'Get recommendations based on your team size, budget, and specific use case.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-blue-600 mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Stop paying for the wrong software. Compare tools side by side and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                🔍 Search Tools
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
