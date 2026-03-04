import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsByCategory, getCategoryStats, getComparisonsByCategory } from '@/lib/data';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, CATEGORY_LIST, SITE_URL, AI_SUBCATEGORIES } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FAQSection } from '@/components/common/FAQSection';
import { getCategoryContent } from '@/lib/category-content';

// ============================================================
// Category Hub Page — ENHANCED with stats, filters, better grid
// ============================================================

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

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: `${SITE_URL}/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  const [tools, stats, comparisons] = await Promise.all([
    getToolsByCategory(category, 50),
    getCategoryStats(category),
    getComparisonsByCategory(category, 6),
  ]);
  const year = new Date().getFullYear();
  const categoryContent = getCategoryContent(category);
  const faqSchema = categoryContent ? generateFAQSchema(categoryContent.faqs) : null;

  const subcategories = category === 'ai-tools' ? AI_SUBCATEGORIES : [];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
  ]);

  // Stats for hero
  const avgRating = tools.length > 0
    ? (tools.reduce((sum, t) => sum + t.ratings.overall, 0) / tools.length).toFixed(1)
    : '0';
  const freeCount = tools.filter(t => t.pricing.hasFreeplan).length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat.name, url: '' },
        ]} />

        {/* ========== CATEGORY HERO ========== */}
        <div className="mt-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{cat.icon}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              Best {cat.name} ({year})
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-6">
            {cat.description}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-blue-600">{stats.toolCount}</span>
              <span className="text-sm text-blue-700 dark:text-blue-400">Tools Reviewed</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-purple-600">{stats.comparisonCount}</span>
              <span className="text-sm text-purple-700 dark:text-purple-400">Comparisons</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-green-600">{avgRating}</span>
              <span className="text-sm text-green-700 dark:text-green-400">Avg Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-orange-600">{freeCount}</span>
              <span className="text-sm text-orange-700 dark:text-orange-400">Free Plans</span>
            </div>
          </div>
        </div>

        {/* ========== SUBCATEGORIES (AI Tools only) ========== */}
        {subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Browse by Type</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/${category}/best/${sub.slug}`}
                  className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all"
                >
                  <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== TOP 3 SPOTLIGHT ========== */}
        {tools.length >= 3 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Top 3 {cat.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tools.slice(0, 3).map((tool, idx) => {
                const medals = ['&#129351;', '&#129352;', '&#129353;'];
                return (
                  <Link
                    key={tool.id}
                    href={`/${category}/${tool.slug}`}
                    className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                  >
                    {/* Medal */}
                    <span className="absolute -top-3 -left-3 text-3xl" dangerouslySetInnerHTML={{ __html: medals[idx] }} />

                    <div className="flex items-center gap-3 mb-4 mt-2">
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-14 h-14 rounded-xl shadow-sm" loading="lazy" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                          {tool.name[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">&#9733;</span>
                          <span className="font-bold">{tool.ratings.overall.toFixed(1)}</span>
                          <span className="text-gray-400">/10</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{tool.tagline}</p>

                    {/* Mini rating bars */}
                    <div className="space-y-2">
                      {[
                        { label: 'Features', score: tool.ratings.features },
                        { label: 'Ease of Use', score: tool.ratings.easeOfUse },
                        { label: 'Value', score: tool.ratings.valueForMoney },
                      ].map(({ label, score }) => (
                        <div key={label} className="flex items-center gap-2 text-xs">
                          <span className="w-20 text-gray-400">{label}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-medium">{score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {tool.pricing.hasFreeplan ? '\u2713 Free plan' : `From $${tool.pricing.startingPrice}/mo`}
                      </span>
                      <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                        Review &#8594;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ========== ALL TOOLS GRID ========== */}
        <section>
          <h2 className="text-xl font-bold mb-6">
            All {cat.name} ({tools.length} reviewed)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, idx) => (
              <Link
                key={tool.id}
                href={`/${category}/${tool.slug}`}
                className="group flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all bg-white dark:bg-gray-900"
              >
                {/* Rank */}
                <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-6 text-right mt-1">
                  {idx + 1}
                </span>

                {/* Logo */}
                {tool.logoUrl ? (
                  <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-10 h-10 rounded-lg flex-shrink-0" loading="lazy" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-400 flex-shrink-0">
                    {tool.name[0]}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-blue-600 transition-colors truncate">
                      {tool.name}
                    </h3>
                    <span className="flex items-center gap-0.5 text-sm flex-shrink-0">
                      <span className="text-yellow-500">&#9733;</span>
                      <span className="font-medium">{tool.ratings.overall.toFixed(1)}</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{tool.tagline}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    {tool.pricing.hasFreeplan && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">
                        Free
                      </span>
                    )}
                    {tool.pricing.startingPrice && (
                      <span className="text-gray-400">
                        From ${tool.pricing.startingPrice}/mo
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {tools.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No tools listed yet in {cat.name}</p>
            <p className="text-sm">We are currently adding tools to this category. Check back soon!</p>
          </div>
        )}

        {/* ========== FEATURED COMPARISONS ========== */}
        {comparisons.length > 0 && (
          <section className="mt-16 mb-12">
            <h2 className="text-xl font-bold mb-6">Popular {cat.name} Comparisons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/${category}/compare/${comp.slug}`}
                  className="group p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600">
                        {comp.toolA.name[0]}
                      </div>
                      <span className="text-xs font-bold text-orange-500">VS</span>
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600">
                        {comp.toolB.name[0]}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{comp.toolA.ratings.overall.toFixed(1)} vs {comp.toolB.ratings.overall.toFixed(1)}</span>
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">
                    {comp.toolA.name} vs {comp.toolB.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{comp.introContent}</p>
                  <span className="text-xs text-blue-600 font-medium mt-2 inline-block group-hover:translate-x-1 transition-transform">
                    Compare &#8594;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== BUYER'S GUIDE ========== */}
        {categoryContent && (
          <section className="mt-12 mb-12">
            <h2 className="text-2xl font-bold mb-6">{cat.name} Buyer&apos;s Guide ({year})</h2>
            <div className="space-y-8">
              {categoryContent.buyersGuide.map((section, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== KEY FACTORS TO CONSIDER ========== */}
        {categoryContent && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Key Factors When Choosing {cat.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryContent.keyFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{factor.factor}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== HOW WE EVALUATE ========== */}
        {categoryContent && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                How We Evaluate {cat.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{categoryContent.methodology}</p>
            </div>
          </section>
        )}

        {/* ========== CATEGORY FAQ ========== */}
        {categoryContent && categoryContent.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{cat.name} FAQ</h2>
            <FAQSection faqs={categoryContent.faqs} />
          </section>
        )}

        {/* Freshness Signal */}
        <div className="text-sm text-gray-400 mt-8 flex items-center gap-2">
          <span>&#128197;</span>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </>
  );
}
