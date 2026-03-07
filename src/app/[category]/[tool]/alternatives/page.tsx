import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getToolsByCategory, getToolsBySubcategory, getAllToolSlugs, getComparisonsByTool } from '@/lib/data';
import { generateBreadcrumbSchema, generateBestOfItemListSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SITE_URL, SEO, SITE_NAME } from '@/lib/constants';
import { FAQSection } from '@/components/common/FAQSection';
import type { FAQ } from '@/types';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdInArticle, AdMultiplex } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import { ShareButtons } from '@/components/common/ShareButtons';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { TableOfContents } from '@/components/common/TableOfContents';

// ============================================================
// ALTERNATIVES PAGE — ENHANCED with comparison table
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

  const year = new Date().getFullYear();
  const title = `Best ${tool.name} Alternatives in ${year}${SEO.titleSuffix}`;
  const description = `Looking for ${tool.name} alternatives? Compare the top ${tool.name} competitors with ratings (${tool.ratings.overall.toFixed(1)}/10), pricing${tool.pricing.startingPrice ? ` from $${tool.pricing.startingPrice}/mo` : ''}, and features side-by-side.`;

  // Check for alternatives to noindex if none exist
  const alts = await getToolsBySubcategory(category, tool.subcategorySlug, 2);
  const hasAlts = alts.filter(t => t.id !== tool.id).length > 0;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}/alternatives` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${category}/${toolSlug}/alternatives`,
      type: 'article',
      publishedTime: tool.createdAt,
      modifiedTime: tool.lastUpdated,
      authors: ['ToolPilot Editorial Team'],
    },
    ...(!hasAlts && { robots: { index: false, follow: true } }),
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const year = new Date().getFullYear();
  const [alternatives, comparisons] = await Promise.all([
    getToolsBySubcategory(category, tool.subcategorySlug, 20),
    getComparisonsByTool(tool.id),
  ]);
  const filtered = alternatives.filter((t) => t.id !== tool.id);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: tool.name, url: `/${category}/${toolSlug}` },
    { name: 'Alternatives', url: `/${category}/${toolSlug}/alternatives` },
  ]);

  // ItemList schema for ranking rich snippets
  const itemListSchema = filtered.length > 0 ? generateBestOfItemListSchema(
    `Best ${tool.name} Alternatives (${year})`,
    `/${category}/${toolSlug}/alternatives`,
    filtered.map(t => ({ name: t.name, slug: t.slug, categorySlug: t.categorySlug, ratings: t.ratings, logoUrl: t.logoUrl }))
  ) : null;

  // Dynamic FAQs for alternatives page
  const altFaqs: FAQ[] = [
    {
      question: `What is the best alternative to ${tool.name}?`,
      answer: filtered.length > 0
        ? `The top-rated alternative to ${tool.name} is ${filtered[0].name} with a score of ${filtered[0].ratings.overall.toFixed(1)}/10. ${filtered[0].pricing.hasFreeplan ? 'It offers a free plan, making it easy to try.' : filtered[0].pricing.startingPrice ? `Plans start at $${filtered[0].pricing.startingPrice}/mo.` : ''}`
        : `We are currently evaluating alternatives to ${tool.name}. Check back soon for updated recommendations.`,
    },
    {
      question: `Is there a free alternative to ${tool.name}?`,
      answer: (() => {
        const freeAlts = filtered.filter(a => a.pricing.hasFreeplan);
        return freeAlts.length > 0
          ? `Yes! ${freeAlts.length} free alternatives to ${tool.name} are available: ${freeAlts.slice(0, 3).map(a => `${a.name} (${a.ratings.overall.toFixed(1)}/10)`).join(', ')}. These offer free plans you can start using right away.`
          : `Currently, none of the reviewed ${tool.name} alternatives offer a free plan. ${tool.pricing.hasFreeplan ? `However, ${tool.name} itself has a free plan you can use.` : `Consider looking at our full ${cat?.name || 'category'} reviews for budget-friendly options.`}`;
      })(),
    },
    {
      question: `How many alternatives to ${tool.name} are there?`,
      answer: `We have reviewed and compared ${filtered.length} alternatives to ${tool.name} in the ${cat?.name || 'tools'} category. Each has been evaluated on features, ease of use, pricing, and customer support.`,
    },
  ];
  const faqSchema = generateFAQSchema(altFaqs);

  // TOC items for navigation
  const tocItems = [
    ...(filtered.length > 0 ? [{ id: 'comparison-table', label: 'Quick Comparison', icon: '\uD83D\uDCCA' }] : []),
    ...(filtered.length > 0 ? [{ id: 'detailed-reviews', label: 'Detailed Reviews', icon: '\uD83D\uDD0D' }] : []),
    ...(filtered.length > 0 ? [{ id: 'why-switch', label: 'Why People Switch', icon: '\uD83D\uDCA1' }] : []),
    { id: 'switching-checklist', label: 'Before You Switch', icon: '\u2705' },
    ...(comparisons.length > 0 ? [{ id: 'head-to-head', label: 'Head-to-Head', icon: '\u2694\uFE0F' }] : []),
    { id: 'alternatives-faq', label: 'FAQ', icon: '\u2753' },
  ];

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: `/${category}/${toolSlug}` },
          { name: 'Alternatives', url: '' },
        ]} />

        {/* ========== HERO — Premium glassmorphism ========== */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/40 dark:from-gray-900 dark:via-orange-950/10 dark:to-red-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-6 md:p-8">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400/10 dark:bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 backdrop-blur-sm">ALTERNATIVES</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Best {tool.name} Alternatives ({year})
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mb-2">
                {tool.name} scores {tool.ratings.overall.toFixed(1)}/10 in our review{tool.pricing.hasFreeplan ? ' and offers a free plan' : tool.pricing.startingPrice ? ` with plans starting at $${tool.pricing.startingPrice}/mo` : ''}.
                {tool.ratings.overall >= 8
                  ? ` While it excels in features (${tool.ratings.features.toFixed(1)}/10) and ease of use (${tool.ratings.easeOfUse.toFixed(1)}/10), it may not be the best fit for every team or budget.`
                  : tool.ratings.overall >= 6
                    ? ` It performs well in some areas but has room for improvement in ${tool.ratings.support < 7 ? 'customer support' : tool.ratings.valueForMoney < 7 ? 'value for money' : 'overall features'}.`
                    : ` There are several stronger alternatives worth considering for better features and value.`
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We compared {filtered.length} {cat?.name.toLowerCase() || 'tools'} alternatives below, ranked by overall score.
                {filtered.length > 0 && filtered[0].ratings.overall > tool.ratings.overall
                  ? ` ${filtered[0].name} leads with ${filtered[0].ratings.overall.toFixed(1)}/10.`
                  : filtered.length > 0
                    ? ` ${tool.name} currently leads this category — but the alternatives below offer different strengths.`
                    : ''
                }
              </p>
            </div>
          </div>
        </div>

        {/* Current Tool Card — Elevated glassmorphism */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl p-6 mb-10 border border-blue-200/60 dark:border-gray-700/60 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
            <span>&#128270;</span> Currently Evaluating
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg scale-110" />
                <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={56} className="shadow-lg relative" priority />
              </div>
              <div>
                <h2 className="text-xl font-bold">{tool.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{tool.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <span className="text-yellow-500">&#9733;</span> <strong>{tool.ratings.overall.toFixed(1)}</strong>/10
              </div>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                {tool.pricing.hasFreeplan ? '\u2713 Free plan' : tool.pricing.startingPrice != null ? `From $${tool.pricing.startingPrice}/mo` : 'Contact for pricing'}
              </div>
              <Link
                href={`/${category}/${toolSlug}`}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full px-5 py-2 font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/25"
              >
                Full Review &#8594;
              </Link>
              {tool.websiteUrl && (
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-full px-5 py-2 font-medium hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-200/50 dark:border-gray-700/50"
                >
                  Visit Site &#8599;
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ========== TABLE OF CONTENTS ========== */}
        <div className="mb-8">
          <TableOfContents items={tocItems} title="Alternatives Guide" />
        </div>

        {/* Quick Comparison Table — With logos */}
        {filtered.length > 0 && (
          <section id="comparison-table" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} vs Alternatives at a Glance</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Tool</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Free Plan</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Starting Price</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Ease of Use</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300">Value</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current tool row (highlighted) */}
                  <tr className="bg-blue-50/50 dark:bg-blue-900/10 border-t border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={24} />
                        <span className="font-semibold text-blue-700 dark:text-blue-400">{tool.name}</span>
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">YOU</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">{tool.ratings.overall.toFixed(1)}</td>
                    <td className="py-3 px-4 text-center">{tool.pricing.hasFreeplan ? '\u2713' : '\u2717'}</td>
                    <td className="py-3 px-4 text-center">{tool.pricing.startingPrice ? `$${tool.pricing.startingPrice}` : 'N/A'}</td>
                    <td className="py-3 px-4 text-center">{tool.ratings.easeOfUse.toFixed(1)}</td>
                    <td className="py-3 px-4 text-center">{tool.ratings.valueForMoney.toFixed(1)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Current</span>
                    </td>
                  </tr>
                  {/* Alternative rows */}
                  {filtered.map((alt, idx) => (
                    <tr key={alt.id} className={`border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/30 dark:bg-gray-800/10' : ''}`}>
                      <td className="py-3 px-4">
                        <Link href={`/${category}/${alt.slug}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <ToolLogo logoUrl={alt.logoUrl} name={alt.name} size={24} />
                          <span className="font-medium">{alt.name}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={alt.ratings.overall > tool.ratings.overall ? 'text-green-600 font-bold' : alt.ratings.overall < tool.ratings.overall ? 'text-red-500' : 'font-medium'}>
                          {alt.ratings.overall.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={alt.pricing.hasFreeplan ? 'text-green-500' : 'text-gray-400'}>
                          {alt.pricing.hasFreeplan ? '\u2713' : '\u2717'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {alt.pricing.startingPrice ? `$${alt.pricing.startingPrice}` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-center">{alt.ratings.easeOfUse.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center">{alt.ratings.valueForMoney.toFixed(1)}</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/${category}/${alt.slug}`}
                          className="text-xs text-blue-600 hover:underline font-medium"
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

        {/* ========== AD: AFTER TABLE ========== */}
        <AdBanner />

        {/* Detailed Alternative Cards */}
        <section id="detailed-reviews" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">Detailed Alternative Reviews</h2>
          <div className="space-y-5">
            {filtered.map((alt, idx) => {
              const isBetter = alt.ratings.overall > tool.ratings.overall;
              const isCheaper = (alt.pricing.startingPrice || 999) < (tool.pricing.startingPrice || 999);

              return (
                <div
                  key={alt.id}
                  className="hover-lift bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-200 dark:hover:border-blue-800 transition-all card-animate"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        idx < 3 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                        #{idx + 1}
                      </div>
                      <ToolLogo logoUrl={alt.logoUrl} name={alt.name} size={48} />
                      <div>
                        <h3 className="text-lg font-bold">{alt.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{alt.tagline}</p>
                      </div>
                    </div>

                    {/* Quick Badges */}
                    <div className="flex flex-wrap gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        alt.ratings.overall >= 8 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        alt.ratings.overall >= 6 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        &#9733; {alt.ratings.overall.toFixed(1)}/10
                      </div>
                      {isBetter && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          &#9650; HIGHER RATED
                        </span>
                      )}
                      {isCheaper && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          &#128176; MORE AFFORDABLE
                        </span>
                      )}
                      {alt.pricing.hasFreeplan && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          FREE PLAN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comparison Mini-Grid */}
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Ease of Use', thisScore: alt.ratings.easeOfUse, baseScore: tool.ratings.easeOfUse },
                        { label: 'Features', thisScore: alt.ratings.features, baseScore: tool.ratings.features },
                        { label: 'Value', thisScore: alt.ratings.valueForMoney, baseScore: tool.ratings.valueForMoney },
                        { label: 'Support', thisScore: alt.ratings.support, baseScore: tool.ratings.support },
                      ].map(({ label, thisScore, baseScore }) => (
                        <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                          <div className="text-xs text-gray-400 mb-1">{label}</div>
                          <div className={`text-lg font-bold ${thisScore > baseScore ? 'text-green-600' : thisScore < baseScore ? 'text-orange-500' : ''}`}>
                            {thisScore.toFixed(1)}
                          </div>
                          {thisScore !== baseScore && (
                            <div className={`text-[10px] font-medium ${thisScore > baseScore ? 'text-green-500' : 'text-orange-400'}`}>
                              {thisScore > baseScore ? `+${(thisScore - baseScore).toFixed(1)} vs ${tool.name}` : `${(thisScore - baseScore).toFixed(1)} vs ${tool.name}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-5 flex flex-wrap gap-3">
                    {alt.websiteUrl && (
                      <a
                        href={alt.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md shadow-green-600/20"
                      >
                        Try {alt.name} &#8599;
                      </a>
                    )}
                    <Link
                      href={`/${category}/${alt.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Full Review &#8594;
                    </Link>
                    <Link
                      href={`/${category}/${alt.slug}/pricing`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      View Pricing
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <p className="text-gray-400 text-lg mb-4">No alternatives listed yet.</p>
            <Link href={`/${category}`} className="text-blue-600 hover:underline">
              Browse all {cat?.name || category} tools &#8594;
            </Link>
          </div>
        )}

        {/* ========== AD: AFTER DETAILED CARDS ========== */}
        <AdInArticle />

        {/* ========== WHY PEOPLE SWITCH ========== */}
        {filtered.length > 0 && (
          <section id="why-switch" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Why People Look for {tool.name} Alternatives</h2>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-orange-100 dark:border-gray-700">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    icon: '💰',
                    title: 'Pricing Concerns',
                    desc: `${tool.name} ${tool.pricing.startingPrice ? `starts at $${tool.pricing.startingPrice}/mo which` : 'pricing'} may not fit every budget. ${filtered.filter(a => a.pricing.hasFreeplan).length} alternatives offer free plans.`,
                  },
                  {
                    icon: '⚡',
                    title: 'Feature Gaps',
                    desc: `Some users need capabilities ${tool.name} doesn't offer. Top-rated alternatives score up to ${filtered.length > 0 ? Math.max(...filtered.map(a => a.ratings.features)).toFixed(1) : '9.0'}/10 on features.`,
                  },
                  {
                    icon: '🎯',
                    title: 'Better Fit',
                    desc: `Different tools excel for different use cases. ${filtered[0]?.name || 'Top alternatives'} may be a better match for your specific workflow and team size.`,
                  },
                ].map((reason) => (
                  <div key={reason.title} className="bg-white/70 dark:bg-gray-900/50 rounded-xl p-4">
                    <div className="text-2xl mb-2">{reason.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{reason.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{reason.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== SWITCHING CHECKLIST ========== */}
        <section id="switching-checklist" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Before You Switch: Key Considerations</h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <ul className="space-y-3">
              {[
                `Review your current ${tool.name} data export options — ensure you can migrate your content and configurations.`,
                `Compare pricing tiers carefully — factor in hidden costs like add-ons, transaction fees, and per-user charges.`,
                `Test the alternative with a free trial before committing — most tools in this category offer 14-30 day trials.`,
                `Check integration compatibility — make sure the alternative works with your existing tech stack.`,
                `Consider the learning curve — switching costs include time spent training your team on the new tool.`,
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600">{idx + 1}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========== HEAD-TO-HEAD COMPARISONS ========== */}
        {comparisons.length > 0 && (
          <section id="head-to-head" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Head-to-Head Comparisons</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {comparisons.slice(0, 6).map((comp) => {
                const otherTool = comp.toolA.id === tool.id ? comp.toolB : comp.toolA;
                const thisScore = comp.toolA.id === tool.id ? comp.toolA.ratings.overall : comp.toolB.ratings.overall;
                const otherScore = comp.toolA.id === tool.id ? comp.toolB.ratings.overall : comp.toolA.ratings.overall;
                return (
                  <Link
                    key={comp.id}
                    href={`/${category}/compare/${comp.slug}`}
                    className="group hover-lift flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-white dark:bg-gray-900"
                  >
                    <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
                    <span className="text-xs font-bold text-orange-500">VS</span>
                    <ToolLogo logoUrl={otherTool.logoUrl} name={otherTool.name} size={32} />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm block truncate group-hover:text-blue-600 transition-colors">
                        {tool.name} vs {otherTool.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className={`font-bold ${thisScore >= otherScore ? 'text-green-600' : 'text-gray-500'}`}>{thisScore.toFixed(1)}</span>
                        <span>vs</span>
                        <span className={`font-bold ${otherScore >= thisScore ? 'text-green-600' : 'text-gray-500'}`}>{otherScore.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className="text-blue-600 text-sm group-hover:translate-x-1 transition-transform">&#8594;</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ========== ALTERNATIVES FAQ ========== */}
        {altFaqs.length > 0 && (
          <section id="alternatives-faq" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Alternatives FAQ</h2>
            <FAQSection faqs={altFaqs} />
          </section>
        )}

        {/* ========== AD: BEFORE FOOTER ========== */}
        <AdMultiplex />

        {/* Freshness Signal — Enhanced trust badge */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span>&#128197;</span>
              <span>Last updated: {new Date(tool.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
              <span>&#9989;</span>
              <span>Pricing verified</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
              <span>&#128202;</span>
              <span>Independent review by {SITE_NAME}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButtons
              url={`${SITE_URL}/${category}/${toolSlug}/alternatives`}
              title={`Best ${tool.name} Alternatives in ${year}`}
              description={`Compare the top ${tool.name} competitors`}
            />
            <CopyLinkButton url={`${SITE_URL}/${category}/${toolSlug}/alternatives`} />
          </div>
        </div>
      </article>
    </>
  );
}
