import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparisonsByCategory, getCategoryStats } from '@/lib/data';
import { generateBreadcrumbSchema, generateComparisonHubSchema } from '@/lib/schema';
import { CATEGORIES, CATEGORY_LIST, SITE_URL } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';

// ============================================================
// COMPARISON HUB PAGE — Lists all comparisons for a category
// ============================================================

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORY_LIST.map((cat) => ({ category: cat.slug }));
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return {};

  const year = new Date().getFullYear();
  return {
    title: `${cat.name} Comparisons (${year}) — Side-by-Side Tool Reviews`,
    description: `Compare the best ${cat.name.toLowerCase()} side by side. Detailed feature comparisons, pricing breakdowns, and expert verdicts to help you choose the right tool.`,
    alternates: { canonical: `${SITE_URL}/${cat.slug}/compare` },
    openGraph: {
      title: `${cat.name} Comparisons — Head-to-Head Reviews`,
      description: `Browse all ${cat.name.toLowerCase()} comparisons. Find which tool wins in features, pricing, and ease of use.`,
      url: `${SITE_URL}/${cat.slug}/compare`,
    },
  };
}

export default async function ComparisonHubPage({ params }: PageProps) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const [comparisons, stats] = await Promise.all([
    getComparisonsByCategory(category, 100),
    getCategoryStats(category),
  ]);

  const year = new Date().getFullYear();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
    { name: 'Comparisons', url: `/${cat.slug}/compare` },
  ]);

  const hubSchema = generateComparisonHubSchema(cat.name, cat.slug, comparisons);

  // Group comparisons by first tool letter for A-Z browsing
  const grouped = comparisons.reduce<Record<string, typeof comparisons>>((acc, comp) => {
    const letter = comp.toolA.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(comp);
    return acc;
  }, {});

  // Find most compared tools
  const toolMentions: Record<string, { name: string; count: number; slug: string }> = {};
  comparisons.forEach((comp) => {
    const keyA = comp.toolA.slug;
    const keyB = comp.toolB.slug;
    if (!toolMentions[keyA]) toolMentions[keyA] = { name: comp.toolA.name, count: 0, slug: comp.toolA.slug };
    if (!toolMentions[keyB]) toolMentions[keyB] = { name: comp.toolB.name, count: 0, slug: comp.toolB.slug };
    toolMentions[keyA].count++;
    toolMentions[keyB].count++;
  });
  const topComparedTools = Object.values(toolMentions)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat.name, url: `/${cat.slug}` },
          { name: 'Comparisons', url: '' },
        ]} />

        {/* Hero — Premium glassmorphism */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/40 dark:from-gray-900 dark:via-orange-950/10 dark:to-red-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-6 md:p-8">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-400/10 dark:bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 backdrop-blur-sm">VS BATTLES</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                {cat.name} Comparisons ({year})
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-6">
                Browse {comparisons.length} head-to-head comparisons across {stats.toolCount} {cat.name.toLowerCase()}.
                Each comparison includes detailed feature analysis, pricing breakdowns, and expert verdicts.
              </p>

              {/* Stats — Premium glassmorphism pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { value: comparisons.length, label: 'Comparisons', color: 'text-orange-600 dark:text-orange-400', bg: 'from-orange-100/80 to-orange-50/80 dark:from-orange-900/30 dark:to-orange-800/20' },
                  { value: stats.toolCount, label: 'Tools Covered', color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
                  { value: topComparedTools.length, label: 'Popular Tools', color: 'text-green-600 dark:text-green-400', bg: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
                ].map((stat, idx) => (
                  <div key={stat.label} className={`flex items-center gap-2.5 bg-gradient-to-r ${stat.bg} backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-white/50 dark:border-gray-700/50 card-animate`} style={{ animationDelay: `${idx * 80}ms` }}>
                    <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Most Compared Tools */}
        {topComparedTools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Most Compared {cat.name}</h2>
            <div className="flex flex-wrap gap-2">
              {topComparedTools.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${category}/${t.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-sm"
                >
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {t.name[0]}
                  </span>
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-gray-400">({t.count} comparisons)</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdBanner />

        {/* All Comparisons Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6">
            All {cat.name} Comparisons ({comparisons.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.map((comp, idx) => {
              const scoreA = comp.toolA.ratings.overall;
              const scoreB = comp.toolB.ratings.overall;
              const winner = scoreA > scoreB ? comp.toolA.name : scoreB > scoreA ? comp.toolB.name : 'Tie';

              return (
                <Link
                  key={comp.id}
                  href={`/${category}/compare/${comp.slug}`}
                  className="group hover-lift block p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 transition-all card-animate"
                  style={{ animationDelay: `${Math.min(idx * 30, 500)}ms` }}
                >
                  {/* Tool Logos */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ToolLogo logoUrl={comp.toolA.logoUrl} name={comp.toolA.name} size={40} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{comp.toolA.name}</span>
                        <span className="text-xs text-gray-400">{scoreA.toFixed(1)}/10</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-orange-500 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full">VS</span>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">{comp.toolB.name}</span>
                        <span className="text-xs text-gray-400">{scoreB.toFixed(1)}/10</span>
                      </div>
                      <ToolLogo logoUrl={comp.toolB.logoUrl} name={comp.toolB.name} size={40} />
                    </div>
                  </div>

                  {/* Intro */}
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{comp.introContent}</p>

                  {/* Winner + CTA */}
                  <div className="flex items-center justify-between">
                    {winner !== 'Tie' ? (
                      <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                        Winner: {winner}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full font-medium">
                        Close match
                      </span>
                    )}
                    <span className="text-xs text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                      Full comparison &#8594;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {comparisons.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No comparisons yet for {cat.name}</p>
            <p className="text-sm">We are currently creating comparisons for this category. Check back soon!</p>
          </div>
        )}

        <AdInArticle />

        {/* Cross-link to other category comparisons */}
        <section className="mt-12 mb-8">
          <h2 className="text-xl font-bold mb-4">Browse Comparisons by Category</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORY_LIST.filter((c) => c.slug !== category).map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/compare`}
                className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name[0]}
                </div>
                <div>
                  <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{c.name}</h3>
                  <p className="text-xs text-gray-400">View comparisons</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO text */}
        <section className="mt-8 mb-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold mb-3">How We Compare {cat.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              Our {cat.name.toLowerCase()} comparisons are based on hands-on testing and analysis across five key dimensions:
              features, ease of use, value for money, customer support, and overall performance. Each tool is rated on a 10-point
              scale, and our verdicts highlight the specific use cases where each tool excels.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you&apos;re a solo founder evaluating your first tool or an enterprise team comparing alternatives,
              our side-by-side comparisons give you the data you need to make an informed decision. All ratings and reviews
              are updated regularly to reflect the latest product changes and pricing updates.
            </p>
          </div>
        </section>

        {/* Freshness */}
        <div className="text-sm text-gray-400 mt-6 flex items-center gap-2">
          <span>&#128197;</span>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </>
  );
}
