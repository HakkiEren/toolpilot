import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks, getComparisonsByTool, getRelatedTools } from '@/lib/data';
import { generateToolReviewSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SEO, SITE_URL } from '@/lib/constants';
import { generateToolFAQs } from '@/lib/generated-faqs';
import { FAQSection } from '@/components/common/FAQSection';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';

// ============================================================
// TOOL PROFILE PAGE — Individual tool review (ENHANCED)
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map(({ categorySlug, toolSlug }) => ({
    category: categorySlug,
    tool: toolSlug,
  }));
}

interface PageProps {
  params: Promise<{ category: string; tool: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) return {};

  return {
    title: tool.metaTitle || `${tool.name} Review — Features, Pricing & Alternatives${SEO.titleSuffix}`,
    description: tool.metaDescription || `${tool.name}: ${tool.tagline}. Read our honest review with features, pricing plans, pros & cons.`,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}` },
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.tagline,
      url: `${SITE_URL}/${category}/${toolSlug}`,
      type: 'article',
      publishedTime: tool.createdAt,
      modifiedTime: tool.lastUpdated,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const [relatedLinks, comparisons, relatedTools] = await Promise.all([
    getRelatedLinks(tool),
    getComparisonsByTool(tool.id),
    getRelatedTools(tool, 6),
  ]);
  const year = new Date().getFullYear();

  const toolSchema = generateToolReviewSchema(tool, cat?.name || category);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: tool.name, url: `/${category}/${toolSlug}` },
  ]);

  // Generate dynamic FAQs for this tool
  const toolFAQs = generateToolFAQs({
    name: tool.name,
    tagline: tool.tagline,
    pricing: {
      hasFreeplan: tool.pricing.hasFreeplan,
      startingPrice: tool.pricing.startingPrice,
      freeTrialDays: tool.pricing.freeTrialDays,
      plans: tool.pricing.plans || [],
    },
    ratings: { overall: tool.ratings.overall },
    categorySlug: tool.categorySlug,
  });
  const faqSchema = generateFAQSchema(toolFAQs);

  // Rating label
  const ratingLabel = tool.ratings.overall >= 9 ? 'Excellent' : tool.ratings.overall >= 8 ? 'Very Good' : tool.ratings.overall >= 7 ? 'Good' : tool.ratings.overall >= 6 ? 'Decent' : 'Average';
  const ratingColor = tool.ratings.overall >= 8 ? 'text-green-600' : tool.ratings.overall >= 6 ? 'text-yellow-600' : 'text-red-600';

  // Feature entries from the features JSON
  const featureEntries = Object.entries(tool.features || {});

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: '' },
        ]} />

        {/* ========== HERO HEADER ========== */}
        <div className="mt-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={96} className="shadow-lg" priority />
            </div>

            {/* Title & Quick Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">
                  {tool.name}
                </h1>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  tool.ratings.overall >= 8 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  tool.ratings.overall >= 6 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {ratingLabel}
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{tool.tagline}</p>

              {/* Quick Stats Bar */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">
                  <span className="text-yellow-500 text-lg">&#9733;</span>
                  <span className="font-bold text-lg">{tool.ratings.overall.toFixed(1)}</span>
                  <span className="text-gray-400">/10</span>
                  {tool.ratings.reviewCount > 0 && (
                    <span className="text-gray-400 text-xs ml-1">({tool.ratings.reviewCount} reviews)</span>
                  )}
                </div>
                {tool.pricing.hasFreeplan && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium">
                    &#10003; Free Plan
                  </span>
                )}
                {tool.pricing.startingPrice && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium">
                    From ${tool.pricing.startingPrice}/mo
                  </span>
                )}
                {tool.pricing.freeTrialDays && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium">
                    {tool.pricing.freeTrialDays}-Day Trial
                  </span>
                )}
              </div>
            </div>

            {/* CTA Sidebar */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="glow-pulse inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Visit {tool.name} &#8599;
              </a>
              <Link
                href={`/${category}/${toolSlug}/pricing`}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                View Pricing
              </Link>
              <Link
                href={`/${category}/${toolSlug}/alternatives`}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                See Alternatives
              </Link>
            </div>
          </div>
        </div>

        {/* ========== RATING DASHBOARD ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Rating</h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Overall Score Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 flex items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-black ${ratingColor}`}>{tool.ratings.overall.toFixed(1)}</div>
                  <div className="text-[10px] text-gray-400 font-medium">OUT OF 10</div>
                </div>
              </div>
              <div className="flex-1">
                <div className={`text-xl font-bold ${ratingColor}`}>{ratingLabel}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Based on comprehensive analysis of features, pricing, ease of use, and customer feedback
                </p>
              </div>
            </div>

            {/* Individual Ratings */}
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { label: 'Ease of Use', score: tool.ratings.easeOfUse, icon: '&#128171;' },
                  { label: 'Features', score: tool.ratings.features, icon: '&#9881;' },
                  { label: 'Value for Money', score: tool.ratings.valueForMoney, icon: '&#128176;' },
                  { label: 'Customer Support', score: tool.ratings.support, icon: '&#128172;' },
                ].map(({ label, score, icon }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="text-xl w-8" dangerouslySetInnerHTML={{ __html: icon }} />
                    <span className="w-36 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full score-bar-animated ${
                          score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : score >= 4 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-bold text-sm">{score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== WHAT IS {TOOL} ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is {tool.name}?</h2>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>{tool.description}</p>
          </div>
        </section>

        {/* ========== AD: AFTER DESCRIPTION ========== */}
        <AdBanner />

        {/* ========== KEY FEATURES TABLE ========== */}
        {featureEntries.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Key Features</h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-5 text-left font-semibold text-gray-600 dark:text-gray-300">Feature</th>
                    <th className="py-3 px-5 text-left font-semibold text-gray-600 dark:text-gray-300">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {featureEntries.map(([key, value], idx) => {
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (s) => s.toUpperCase())
                      .replace(/has /i, '')
                      .replace(/_/g, ' ');

                    return (
                      <tr
                        key={key}
                        className={`border-t border-gray-100 dark:border-gray-800 ${
                          idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/30'
                        }`}
                      >
                        <td className="py-3 px-5 font-medium text-gray-800 dark:text-gray-200">{label}</td>
                        <td className="py-3 px-5">
                          {typeof value === 'boolean' ? (
                            <span className={value ? 'text-green-500 font-semibold' : 'text-red-400'}>
                              {value ? '&#10003; Yes' : '&#10007; No'}
                            </span>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== PROS & CONS (Enhanced) ========== */}
        {tool.prosConsContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Pros &amp; Cons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-200 dark:border-green-800/30">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                  <span className="text-xl">&#128077;</span> Pros
                </h3>
                <div className="prose dark:prose-invert max-w-none text-sm [&_li]:text-green-800 dark:[&_li]:text-green-300 [&_ul]:space-y-2">
                  <div dangerouslySetInnerHTML={{ __html: extractPros(tool.prosConsContent) }} />
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800/30">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                  <span className="text-xl">&#128078;</span> Cons
                </h3>
                <div className="prose dark:prose-invert max-w-none text-sm [&_li]:text-red-800 dark:[&_li]:text-red-300 [&_ul]:space-y-2">
                  <div dangerouslySetInnerHTML={{ __html: extractCons(tool.prosConsContent) }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========== AD: AFTER PROS/CONS ========== */}
        <AdInArticle />

        {/* ========== USE CASES ========== */}
        {tool.useCasesContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Best Use Cases for {tool.name}</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: tool.useCasesContent }} />
              </div>
            </div>
          </section>
        )}

        {/* ========== PRICING OVERVIEW ========== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{tool.name} Pricing</h2>
            <Link
              href={`/${category}/${toolSlug}/pricing`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Full pricing details &#8594;
            </Link>
          </div>

          {tool.pricing.plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {tool.pricing.plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative p-6 rounded-2xl border hover-lift transition-all ${
                    plan.isPopular
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-md">
                      &#11088; Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mt-1">{plan.name}</h3>
                  <div className="text-3xl font-bold mt-2 mb-4">
                    {plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {plan.price !== null && plan.price > 0 && (
                      <span className="text-sm font-normal text-gray-400">/mo</span>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                        {f}
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-blue-600 text-xs font-medium">
                        + {plan.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <p className="text-gray-500">Pricing information coming soon.</p>
            </div>
          )}
        </section>

        {/* ========== VS COMPETITORS ========== */}
        {comparisons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{tool.name} vs Competitors</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {comparisons.map((comp) => {
                const otherTool = comp.toolA.id === tool.id ? comp.toolB : comp.toolA;
                return (
                  <Link
                    key={comp.id}
                    href={`/${category}/compare/${comp.slug}`}
                    className="hover-lift flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                      {tool.name[0]}
                    </div>
                    <span className="text-gray-400 text-sm font-medium">vs</span>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400">
                      {otherTool.name[0]}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{tool.name} vs {otherTool.name}</span>
                      <div className="text-xs text-gray-400">
                        {tool.ratings.overall.toFixed(1)} vs {otherTool.ratings.overall.toFixed(1)}
                      </div>
                    </div>
                    <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">&#8594;</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ========== BEST FOR ========== */}
        {tool.bestForContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Who is {tool.name} Best For?</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-green-100 dark:border-gray-700">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: tool.bestForContent }} />
              </div>
            </div>
          </section>
        )}

        {/* ========== QUICK SUMMARY TABLE ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{tool.name} at a Glance</h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Category', cat?.name || category],
                  ['Overall Rating', `${tool.ratings.overall.toFixed(1)}/10 (${ratingLabel})`],
                  ['Free Plan', tool.pricing.hasFreeplan ? 'Yes' : 'No'],
                  ['Starting Price', tool.pricing.startingPrice ? `$${tool.pricing.startingPrice}/mo` : 'N/A'],
                  ['Free Trial', tool.pricing.freeTrialDays ? `${tool.pricing.freeTrialDays} days` : 'Not available'],
                  ['Best For', tool.bestForContent ? 'See details above' : tool.tagline],
                  ['Ease of Use', `${tool.ratings.easeOfUse.toFixed(1)}/10`],
                  ['Value for Money', `${tool.ratings.valueForMoney.toFixed(1)}/10`],
                  ['Customer Support', `${tool.ratings.support.toFixed(1)}/10`],
                  ['Last Updated', new Date(tool.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                ].map(([label, value], idx) => (
                  <tr key={label} className={`border-t border-gray-100 dark:border-gray-800 ${idx % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-800/20'}`}>
                    <td className="py-3 px-5 font-medium text-gray-700 dark:text-gray-300 w-1/3">{label}</td>
                    <td className="py-3 px-5 text-gray-800 dark:text-gray-200">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== EXPERT VERDICT ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Expert Verdict</h2>
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-6 md:p-8 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center">
                <span className={`text-2xl font-black ${ratingColor}`}>{tool.ratings.overall.toFixed(1)}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  {tool.name} — {ratingLabel} ({tool.ratings.overall.toFixed(1)}/10)
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tool.ratings.overall >= 8
                    ? `${tool.name} stands out as one of the strongest options in the ${cat?.name || 'tools'} category. With excellent scores across features (${tool.ratings.features.toFixed(1)}/10) and ease of use (${tool.ratings.easeOfUse.toFixed(1)}/10), it delivers genuine value for ${tool.pricing.hasFreeplan ? 'teams of all sizes, especially with its free plan' : `organizations willing to invest from $${tool.pricing.startingPrice}/mo`}. We recommend it for users who prioritize reliability and a mature feature set.`
                    : tool.ratings.overall >= 6
                      ? `${tool.name} is a solid contender in the ${cat?.name || 'tools'} space with room for growth. It scores well on features (${tool.ratings.features.toFixed(1)}/10) but could improve in some areas. ${tool.pricing.hasFreeplan ? 'The free plan makes it easy to evaluate before committing.' : `At $${tool.pricing.startingPrice}/mo, it offers reasonable value for what you get.`} Worth considering if its strengths align with your specific needs.`
                      : `${tool.name} offers a basic set of capabilities in the ${cat?.name || 'tools'} category. While it may work for specific use cases, there are stronger alternatives available. We recommend comparing it against top-rated competitors before committing.`
                  }
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Features', score: tool.ratings.features, emoji: '⚙️' },
                { label: 'Ease of Use', score: tool.ratings.easeOfUse, emoji: '🎯' },
                { label: 'Value', score: tool.ratings.valueForMoney, emoji: '💰' },
                { label: 'Support', score: tool.ratings.support, emoji: '💬' },
              ].map(({ label, score, emoji }) => (
                <div key={label} className="bg-white/70 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{emoji}</div>
                  <div className={`text-lg font-bold ${score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>{score.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== YOU MAY ALSO LIKE ========== */}
        {relatedTools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.id}
                  href={`/${rt.categorySlug}/${rt.slug}`}
                  className="group hover-lift flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all bg-white dark:bg-gray-900"
                >
                  <ToolLogo logoUrl={rt.logoUrl} name={rt.name} size={40} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate">{rt.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{rt.tagline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500 text-xs">&#9733;</span>
                      <span className="text-xs font-medium">{rt.ratings.overall.toFixed(1)}/10</span>
                      {rt.pricing.hasFreeplan && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">Free</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== FAQ SECTION ========== */}
        {toolFAQs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{tool.name} FAQ</h2>
            <FAQSection faqs={toolFAQs} />
          </section>
        )}

        {/* ========== INTERNAL LINKS ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools &amp; Comparisons</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* ========== FRESHNESS SIGNAL ========== */}
        <div className="text-sm text-gray-400 mt-8 flex items-center gap-2">
          <span>&#128197;</span>
          Last updated: {new Date(tool.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </article>
    </>
  );
}

// ============================================================
// HELPERS — Extract pros and cons from combined HTML content
// ============================================================

function extractPros(html: string): string {
  // Try to find content between Pros header and Cons header
  const prosMatch = html.match(/<h3[^>]*>.*?Pros.*?<\/h3>([\s\S]*?)(?=<h3|$)/i);
  if (prosMatch) return prosMatch[1];

  // Fallback: first <ul> is pros
  const firstUl = html.match(/<ul[\s\S]*?<\/ul>/i);
  if (firstUl) return firstUl[0];

  return html.split('</ul>')[0] + '</ul>' || html;
}

function extractCons(html: string): string {
  // Try to find content after Cons header
  const consMatch = html.match(/<h3[^>]*>.*?Cons.*?<\/h3>([\s\S]*?)$/i);
  if (consMatch) return consMatch[1];

  // Fallback: second <ul> is cons
  const uls = html.match(/<ul[\s\S]*?<\/ul>/gi);
  if (uls && uls.length >= 2) return uls[1];

  return '';
}
