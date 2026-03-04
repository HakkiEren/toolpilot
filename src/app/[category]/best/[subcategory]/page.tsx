import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsBySubcategory } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, AI_SUBCATEGORIES, SITE_URL, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// Best-of Subcategory Page — ENHANCED with comparison table,
// winner spotlight, quick stats, and better card design
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return AI_SUBCATEGORIES.map((sub) => ({
    category: 'ai-tools',
    subcategory: sub.slug,
  }));
}

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

function getSubcategory(categorySlug: string, subcategorySlug: string) {
  if (categorySlug === 'ai-tools') {
    return AI_SUBCATEGORIES.find((s) => s.slug === subcategorySlug) || null;
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = CATEGORIES[category];
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) return {};

  const year = new Date().getFullYear();
  const title = `Best ${sub.name} in ${year} — Compare & Choose | ToolPilot`;
  const description = `Compare the best ${sub.name.toLowerCase()} in ${year}. Unbiased reviews, real pricing, feature comparisons to help you pick the right tool.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${cat.slug}/best/${sub.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/${cat.slug}/best/${sub.slug}`, type: 'website' },
  };
}

export default async function BestSubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  const cat = CATEGORIES[category];
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) notFound();

  const tools = await getToolsBySubcategory(category, subcategory, 50);
  const year = new Date().getFullYear();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
    { name: `Best ${sub.name}`, url: `/${cat.slug}/best/${sub.slug}` },
  ]);

  // Stats
  const avgRating = tools.length > 0
    ? (tools.reduce((sum, t) => sum + t.ratings.overall, 0) / tools.length).toFixed(1)
    : '0';
  const freeCount = tools.filter(t => t.pricing.hasFreeplan).length;
  const topTool = tools[0];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat.name, url: `/${cat.slug}` },
          { name: `Best ${sub.name}`, url: '' },
        ]} />

        {/* ========== HERO SECTION ========== */}
        <div className="mt-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best {sub.name} in {year}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-6">
            {sub.description} Compare features, pricing, and ratings to find the
            perfect {sub.name.toLowerCase()} for your needs.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2">
              <span className="text-xl font-bold text-blue-600">{tools.length}</span>
              <span className="text-sm text-blue-700 dark:text-blue-400">Tools Compared</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-2">
              <span className="text-xl font-bold text-green-600">{avgRating}</span>
              <span className="text-sm text-green-700 dark:text-green-400">Avg Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-2">
              <span className="text-xl font-bold text-orange-600">{freeCount}</span>
              <span className="text-sm text-orange-700 dark:text-orange-400">Free Plans</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-500">Updated</span>
              <span className="text-sm font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* ========== WINNER SPOTLIGHT ========== */}
        {topTool && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl border border-yellow-200 dark:border-yellow-800/30 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">&#127942;</span>
                <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-400">
                  Top Pick: {topTool.name}
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex items-center gap-4">
                  {topTool.logoUrl ? (
                    <img src={topTool.logoUrl} alt={`${topTool.name} logo`} className="w-16 h-16 rounded-xl shadow-md" loading="lazy" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-white">
                      {topTool.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-yellow-700 dark:text-yellow-400">
                        {topTool.ratings.overall.toFixed(1)}
                      </span>
                      <span className="text-gray-400">/10</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {topTool.ratings.reviewCount} reviews
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{topTool.tagline}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topTool.pricing.hasFreeplan && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        Free Plan
                      </span>
                    )}
                    {topTool.pricing.startingPrice !== null && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                        From ${topTool.pricing.startingPrice}/mo
                      </span>
                    )}
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                      #{`1`} in {sub.name}
                    </span>
                  </div>
                  <Link
                    href={`/${category}/${topTool.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white rounded-xl text-sm font-bold hover:bg-yellow-700 transition-colors shadow-sm"
                  >
                    Read Full Review &#8594;
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== COMPARISON TABLE ========== */}
        {tools.length >= 2 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Quick Comparison</h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">#</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Tool</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Free Plan</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Ease of Use</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Value</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {tools.slice(0, 10).map((tool, idx) => (
                    <tr
                      key={tool.id}
                      className={`border-t border-gray-100 dark:border-gray-800 ${idx === 0 ? 'bg-yellow-50/50 dark:bg-yellow-900/5' : idx % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-800/10' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${idx < 3 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {idx === 0 ? '\u{1F947}' : idx === 1 ? '\u{1F948}' : idx === 2 ? '\u{1F949}' : `#${idx + 1}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {tool.logoUrl ? (
                            <img src={tool.logoUrl} alt={tool.name} className="w-7 h-7 rounded" loading="lazy" />
                          ) : (
                            <div className="w-7 h-7 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                              {tool.name[0]}
                            </div>
                          )}
                          <span className="font-semibold">{tool.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${tool.ratings.overall >= 8 ? 'text-green-600' : tool.ratings.overall >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {tool.ratings.overall.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {tool.pricing.hasFreeplan ? (
                          <span className="text-green-600 font-semibold">&#10003;</span>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">&#10007;</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {tool.pricing.startingPrice !== null ? `$${tool.pricing.startingPrice}/mo` : 'Custom'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium">{tool.ratings.easeOfUse.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-medium">{tool.ratings.valueForMoney.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/${category}/${tool.slug}`}
                          className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                        >
                          Review &#8594;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== ALL TOOLS GRID ========== */}
        {tools.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">
              All {sub.name} ({tools.length} reviewed)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Link
                  key={tool.id}
                  href={`/${category}/${tool.slug}`}
                  className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all bg-white dark:bg-gray-900"
                >
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                    }`}>
                      #{index + 1}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-12 h-12 rounded-xl shadow-sm" loading="lazy" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                        {tool.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">&#9733;</span>
                        <span className="font-bold">{tool.ratings.overall.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">({tool.ratings.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{tool.tagline}</p>

                  {/* Mini Rating Bars */}
                  <div className="space-y-1.5 mb-4">
                    {[
                      { label: 'Features', score: tool.ratings.features },
                      { label: 'Ease of Use', score: tool.ratings.easeOfUse },
                      { label: 'Value', score: tool.ratings.valueForMoney },
                    ].map(({ label, score }) => (
                      <div key={label} className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-gray-400">{label}</span>
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="w-7 text-right font-medium">{score.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {tool.pricing.hasFreeplan
                        ? '\u2713 Free plan'
                        : tool.pricing.startingPrice
                          ? `From $${tool.pricing.startingPrice}/mo`
                          : 'Contact for pricing'}
                    </span>
                    <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      Review &#8594;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">&#128270;</div>
            <p className="text-lg mb-2">No {sub.name.toLowerCase()} listed yet</p>
            <p className="text-sm mb-6">We are currently reviewing tools in this subcategory. Check back soon!</p>
            <Link
              href={`/${category}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              &#8592; Back to {cat.name}
            </Link>
          </div>
        )}

        {/* ========== RELATED SUBCATEGORIES ========== */}
        {category === 'ai-tools' && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Browse Other AI Categories</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AI_SUBCATEGORIES.filter(s => s.slug !== subcategory).slice(0, 8).map((s) => (
                <Link
                  key={s.slug}
                  href={`/${category}/best/${s.slug}`}
                  className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all"
                >
                  <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{s.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Category */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link
            href={`/${category}`}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            &#8592; Browse all {cat.name}
          </Link>
          <div className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </>
  );
}
