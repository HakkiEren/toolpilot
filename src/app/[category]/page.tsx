import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsByCategory, getCategoryStats, getComparisonsByCategory, getBlogPosts } from '@/lib/data';
import { generateBreadcrumbSchema, generateFAQSchema, generateCollectionSchema, generateBuyersGuideSchema } from '@/lib/schema';
import { ToolLogo } from '@/components/common/ToolLogo';
import { CATEGORIES, CATEGORY_LIST, SITE_URL, SUBCATEGORIES } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FAQSection } from '@/components/common/FAQSection';
import { AdBanner, AdInArticle, AdMultiplex } from '@/components/ads/AdSlot';
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

  const [tools, stats, comparisons, allPosts] = await Promise.all([
    getToolsByCategory(category, 200),
    getCategoryStats(category),
    getComparisonsByCategory(category, 6),
    getBlogPosts(50),
  ]);

  // Filter blog posts related to this category
  const categoryPosts = allPosts.filter(p => p.categorySlug === category).slice(0, 3);
  const year = new Date().getFullYear();
  const categoryContent = getCategoryContent(category);
  const faqSchema = categoryContent ? generateFAQSchema(categoryContent.faqs) : null;

  const subcategories = SUBCATEGORIES[category] || [];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
  ]);

  const collectionSchema = generateCollectionSchema(
    cat.name,
    cat.slug,
    cat.description,
    tools
  );

  // Stats for hero
  const avgRating = tools.length > 0
    ? (tools.reduce((sum, t) => sum + t.ratings.overall, 0) / tools.length).toFixed(1)
    : '0';
  const freeCount = tools.filter(t => t.pricing.hasFreeplan).length;

  // Buyer's guide HowTo schema
  const buyersGuideSchema = categoryContent?.buyersGuide
    ? generateBuyersGuideSchema(cat.name, cat.slug, categoryContent.buyersGuide)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {buyersGuideSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buyersGuideSchema) }} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat.name, url: '' },
        ]} />

        {/* ========== CATEGORY HERO — Premium glassmorphism ========== */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-6 md:p-8">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-3xl border border-gray-200/50 dark:border-gray-700/50">
                  {cat.icon}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Best {cat.name} ({year})
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Expert reviews, ratings & comparisons</p>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-6">
                {cat.description}
              </p>

              {/* Stats Bar — Premium glassmorphism pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { value: stats.toolCount, label: 'Tools Reviewed', color: 'text-blue-600 dark:text-blue-400', bg: 'from-blue-100/80 to-blue-50/80 dark:from-blue-900/30 dark:to-blue-800/20' },
                  { value: stats.comparisonCount, label: 'Comparisons', color: 'text-purple-600 dark:text-purple-400', bg: 'from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-800/20' },
                  { value: avgRating, label: 'Avg Rating', color: 'text-green-600 dark:text-green-400', bg: 'from-green-100/80 to-green-50/80 dark:from-green-900/30 dark:to-green-800/20' },
                  { value: freeCount, label: 'Free Plans', color: 'text-orange-600 dark:text-orange-400', bg: 'from-orange-100/80 to-orange-50/80 dark:from-orange-900/30 dark:to-orange-800/20' },
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

        {/* ========== SUBCATEGORIES (AI Tools only) ========== */}
        {subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Browse by Type</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subcategories.map((sub) => {
                const subToolCount = tools.filter(t => t.subcategorySlug === sub.slug).length;
                return (
                  <Link
                    key={sub.slug}
                    href={`/best/${sub.slug}`}
                    className="group hover-lift p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                      {subToolCount > 0 && (
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                          {subToolCount} tools
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.description}</p>
                  </Link>
                );
              })}
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
                    className="group hover-lift shine-hover relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 transition-all card-animate"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Medal */}
                    <span className="absolute -top-3 -left-3 text-3xl" dangerouslySetInnerHTML={{ __html: medals[idx] }} />

                    <div className="flex items-center gap-3 mb-4 mt-2">
                      <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={56} className="shadow-sm" />
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
                              className={`h-full rounded-full score-bar-animated ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-medium">{score.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {tool.pricing.hasFreeplan ? '\u2713 Free plan' : tool.pricing.startingPrice != null ? `From $${tool.pricing.startingPrice}/mo` : 'Contact for pricing'}
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

        {/* ========== AD: AFTER TOP 3 ========== */}
        <AdBanner />

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
                className="group hover-lift flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-white dark:bg-gray-900 card-animate"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Rank */}
                <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-6 text-right mt-1">
                  {idx + 1}
                </span>

                {/* Logo */}
                <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Popular {cat.name} Comparisons</h2>
              <Link
                href={`/${category}/compare`}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View all comparisons &#8594;
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/${category}/compare/${comp.slug}`}
                  className="group hover-lift shine-hover p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ToolLogo logoUrl={comp.toolA.logoUrl} name={comp.toolA.name} size={32} />
                      <span className="text-xs font-bold text-orange-500">VS</span>
                      <ToolLogo logoUrl={comp.toolB.logoUrl} name={comp.toolB.name} size={32} />
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

        {/* ========== AD: AFTER COMPARISONS ========== */}
        <AdInArticle />

        {/* ========== AD: BEFORE BUYER'S GUIDE ========== */}
        <AdMultiplex className="mt-8" />

        {/* ========== BUYER'S GUIDE — Premium numbered cards ========== */}
        {categoryContent && (
          <section className="mt-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">{cat.name} Buyer&apos;s Guide ({year})</h2>
            </div>
            <div className="space-y-4">
              {categoryContent.buyersGuide.map((section, idx) => (
                <div key={idx} className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-black text-white shadow-md shadow-blue-500/20">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{section.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.text}</p>
                    </div>
                  </div>
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

        {/* ========== HOW WE EVALUATE — Premium dark card ========== */}
        {categoryContent && (
          <section className="mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  How We Evaluate {cat.name}
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm">{categoryContent.methodology}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Hands-on Testing', 'Feature Analysis', 'Pricing Review', 'User Feedback'].map(item => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== RELATED BLOG POSTS ========== */}
        {categoryPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{cat.name} Insights &amp; Guides</h2>
              <Link href="/blog" className="text-sm text-blue-600 font-medium hover:underline">
                All articles &#8594;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {categoryPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover-lift bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all overflow-hidden"
                >
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded-full mb-3 uppercase tracking-wide">
                      {cat.name}
                    </span>
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>By {post.author}</span>
                      <span>·</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
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
