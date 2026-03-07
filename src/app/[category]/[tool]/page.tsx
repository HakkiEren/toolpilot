import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks, getComparisonsByTool, getRelatedTools, getRelatedBlogPosts } from '@/lib/data';
import { generateToolReviewSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SEO, SITE_URL, SITE_NAME, SUBCATEGORIES } from '@/lib/constants';
import { generateToolFAQs } from '@/lib/generated-faqs';
import { FAQSection } from '@/components/common/FAQSection';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { AdBanner, AdInArticle, AdMultiplex, AdSidebar } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import { ShareButtons } from '@/components/common/ShareButtons';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { TableOfContents } from '@/components/common/TableOfContents';

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
      authors: [`${SITE_NAME} Editorial Team`],
      section: CATEGORIES[category]?.name || category,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const [relatedLinks, comparisons, relatedTools, relatedPosts] = await Promise.all([
    getRelatedLinks(tool),
    getComparisonsByTool(tool.id),
    getRelatedTools(tool, 6),
    getRelatedBlogPosts(category, toolSlug, 3),
  ]);
  const year = new Date().getFullYear();

  // Find which best-of subcategories this tool appears in
  const toolSubcategories = (SUBCATEGORIES[category] || []).filter(
    (sub) => tool.subcategorySlug === sub.slug
  );

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
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: '' },
        ]} />

        {/* ========== HERO HEADER — Premium glassmorphism card ========== */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-6 md:p-8">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-start gap-6">
              {/* Logo with glow effect */}
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl scale-110" />
                <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={96} className="shadow-xl relative" priority />
              </div>

              {/* Title & Quick Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {tool.name}
                  </h1>
                  <span className={`text-sm font-bold px-3.5 py-1 rounded-full shadow-sm ${
                    tool.ratings.overall >= 8 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 shadow-green-200/50' :
                    tool.ratings.overall >= 6 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 shadow-yellow-200/50' :
                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 shadow-red-200/50'
                  }`}>
                    {ratingLabel}
                  </span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-5 max-w-2xl">{tool.tagline}</p>

                {/* Quick Stats Bar — Pill chips with icons */}
                <div className="flex flex-wrap gap-2.5 text-sm">
                  <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                    <span className="text-yellow-500 text-lg">&#9733;</span>
                    <span className="font-black text-lg">{tool.ratings.overall.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                    {tool.ratings.reviewCount > 0 && (
                      <span className="text-gray-400 text-xs ml-1">({tool.ratings.reviewCount})</span>
                    )}
                  </div>
                  {tool.pricing.hasFreeplan && (
                    <span className="inline-flex items-center px-3.5 py-2 bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold backdrop-blur-sm">
                      &#10003; Free Plan
                    </span>
                  )}
                  {tool.pricing.startingPrice && (
                    <span className="inline-flex items-center px-3.5 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold backdrop-blur-sm">
                      From ${tool.pricing.startingPrice}/mo
                    </span>
                  )}
                  {tool.pricing.freeTrialDays && (
                    <span className="inline-flex items-center px-3.5 py-2 bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {tool.pricing.freeTrialDays}-Day Trial
                    </span>
                  )}
                </div>

                {/* Best-of Badges — Shows which rankings this tool appears in */}
                {toolSubcategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {toolSubcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/best/${sub.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors backdrop-blur-sm"
                      >
                        <span>🏆</span>
                        Best {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Sidebar — Vertical action stack */}
              <div className="flex-shrink-0 flex flex-col gap-2.5">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="glow-pulse inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
                >
                  Visit {tool.name} &#8599;
                </a>
                <Link
                  href={`/${category}/${toolSlug}/pricing`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
                >
                  View Pricing
                </Link>
                <Link
                  href={`/${category}/${toolSlug}/alternatives`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
                >
                  See Alternatives
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========== TABLE OF CONTENTS — Collapsible on mobile, always visible on desktop ========== */}
        <div className="mb-8">
          <TableOfContents
            items={[
              { id: 'tldr', label: 'TL;DR Summary', icon: '⚡' },
              { id: 'rating', label: 'Our Rating', icon: '⭐' },
              { id: 'about', label: `What is ${tool.name}?`, icon: '📖' },
              ...(featureEntries.length > 0 ? [{ id: 'features', label: 'Key Features', icon: '⚙️' }] : []),
              ...(tool.prosConsContent ? [{ id: 'pros-cons', label: 'Pros & Cons', icon: '⚖️' }] : []),
              { id: 'pricing', label: 'Pricing', icon: '💰' },
              ...(comparisons.length > 0 ? [{ id: 'competitors', label: 'vs Competitors', icon: '🥊' }] : []),
              { id: 'verdict', label: 'Expert Verdict', icon: '🏆' },
              ...(toolFAQs.length > 0 ? [{ id: 'faq', label: 'FAQ', icon: '❓' }] : []),
            ]}
          />
        </div>

        {/* ========== TL;DR SUMMARY BOX — AI Overview + Passage Ranking optimized ========== */}
        <div id="tldr" className="mb-10 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/30 scroll-mt-24">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">TL;DR</span>
            <div className="flex-1 h-px bg-blue-200/50 dark:bg-blue-800/30" />
          </div>
          <p data-speakable="true" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {tool.name} is {tool.ratings.overall >= 8 ? 'a top-rated' : tool.ratings.overall >= 6 ? 'a solid' : 'an'} {cat?.name?.toLowerCase() || 'digital'} tool rated {tool.ratings.overall.toFixed(1)}/10.{' '}
            {tool.pricing.hasFreeplan ? 'It offers a free plan, making it accessible for individuals and small teams.' : tool.pricing.startingPrice ? `Plans start at $${tool.pricing.startingPrice}/mo.` : 'Contact sales for pricing.'}{' '}
            Key strengths: features ({tool.ratings.features.toFixed(1)}/10) and ease of use ({tool.ratings.easeOfUse.toFixed(1)}/10).{' '}
            {tool.ratings.overall >= 8 ? 'Highly recommended for most use cases.' : tool.ratings.overall >= 6 ? 'Worth considering if its strengths align with your needs.' : 'Consider comparing with top-rated alternatives.'}
          </p>
        </div>

        {/* ========== RATING DASHBOARD — Premium donut + gradient bars ========== */}
        <section id="rating" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">Our Rating</h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            {/* Overall Score Header — Donut chart */}
            <div className="bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0 relative">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                    strokeDasharray={`${(tool.ratings.overall / 10) * 264} 264`}
                    strokeLinecap="round"
                    className={tool.ratings.overall >= 8 ? 'text-green-500' : tool.ratings.overall >= 6 ? 'text-yellow-500' : 'text-red-500'}
                    stroke="currentColor"
                    style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-black ${ratingColor}`}>{tool.ratings.overall.toFixed(1)}</div>
                    <div className="text-[10px] text-gray-400 font-semibold tracking-wider">OUT OF 10</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className={`text-xl font-bold ${ratingColor}`}>{ratingLabel}</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  Based on comprehensive analysis of features, pricing, ease of use, and customer feedback
                </p>
                {tool.ratings.reviewCount > 0 && (
                  <div className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.round(tool.ratings.overall / 2) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>&#9733;</span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({tool.ratings.reviewCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Ratings — Enhanced gradient bars */}
            <div className="p-6 md:p-8">
              <div className="space-y-5">
                {[
                  { label: 'Ease of Use', score: tool.ratings.easeOfUse, icon: '🎯', gradient: 'from-blue-500 to-cyan-400' },
                  { label: 'Features', score: tool.ratings.features, icon: '⚙️', gradient: 'from-purple-500 to-indigo-400' },
                  { label: 'Value for Money', score: tool.ratings.valueForMoney, icon: '💰', gradient: 'from-green-500 to-emerald-400' },
                  { label: 'Customer Support', score: tool.ratings.support, icon: '💬', gradient: 'from-orange-500 to-amber-400' },
                ].map(({ label, score, icon, gradient }) => (
                  <div key={label} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                      </div>
                      <span className={`text-sm font-black ${score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>{score.toFixed(1)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full score-bar-animated bg-gradient-to-r ${gradient}`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== WHAT IS {TOOL} ========== */}
        <section id="about" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-4">What is {tool.name}?</h2>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>{tool.description}</p>
          </div>
        </section>

        {/* ========== AD: AFTER DESCRIPTION ========== */}
        <AdBanner />

        {/* ========== KEY FEATURES TABLE — Premium card grid ========== */}
        {featureEntries.length > 0 && (
          <section id="features" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {featureEntries.map(([key, value], idx) => {
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (s) => s.toUpperCase())
                  .replace(/has /i, '')
                  .replace(/_/g, ' ');

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors"
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                      typeof value === 'boolean'
                        ? value ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    }`}>
                      {typeof value === 'boolean' ? (value ? '✓' : '✗') : '⚡'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</div>
                      {typeof value !== 'boolean' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{String(value)}</div>
                      )}
                    </div>
                    {typeof value === 'boolean' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        value ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                        {value ? 'Yes' : 'No'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========== PROS & CONS (Enhanced) ========== */}
        {tool.prosConsContent && (
          <section id="pros-cons" className="mb-12 scroll-mt-24">
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
        <section id="pricing" className="mb-12 scroll-mt-24">
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

        {/* ========== VS COMPETITORS — With real logos ========== */}
        {comparisons.length > 0 && (
          <section id="competitors" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} vs Competitors</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {comparisons.map((comp) => {
                const otherTool = comp.toolA.id === tool.id ? comp.toolB : comp.toolA;
                const thisTool = comp.toolA.id === tool.id ? comp.toolA : comp.toolB;
                const isWinner = thisTool.ratings.overall > otherTool.ratings.overall;
                return (
                  <Link
                    key={comp.id}
                    href={`/${category}/compare/${comp.slug}`}
                    className="hover-lift flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group bg-white dark:bg-gray-900"
                  >
                    <ToolLogo logoUrl={thisTool.logoUrl} name={thisTool.name} size={36} />
                    <div className="vs-divider !w-8 !h-8 !text-[10px]">VS</div>
                    <ToolLogo logoUrl={otherTool.logoUrl} name={otherTool.name} size={36} />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm block truncate">{tool.name} vs {otherTool.name}</span>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className={`font-bold ${isWinner ? 'text-green-600' : 'text-gray-500'}`}>{thisTool.ratings.overall.toFixed(1)}</span>
                        <span className="text-gray-300">vs</span>
                        <span className={`font-bold ${!isWinner ? 'text-green-600' : 'text-gray-500'}`}>{otherTool.ratings.overall.toFixed(1)}</span>
                      </div>
                    </div>
                    <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform flex-shrink-0">&#8594;</span>
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

        {/* ========== AT A GLANCE — Info card grid ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{tool.name} at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Category', value: cat?.name || category, icon: '📂' },
              { label: 'Rating', value: `${tool.ratings.overall.toFixed(1)}/10`, icon: '⭐' },
              { label: 'Free Plan', value: tool.pricing.hasFreeplan ? 'Yes ✓' : 'No', icon: '🆓' },
              { label: 'From', value: tool.pricing.startingPrice ? `$${tool.pricing.startingPrice}/mo` : 'N/A', icon: '💵' },
              { label: 'Trial', value: tool.pricing.freeTrialDays ? `${tool.pricing.freeTrialDays} days` : 'N/A', icon: '⏱️' },
              { label: 'Ease of Use', value: `${tool.ratings.easeOfUse.toFixed(1)}/10`, icon: '🎯' },
              { label: 'Features', value: `${tool.ratings.features.toFixed(1)}/10`, icon: '⚙️' },
              { label: 'Value', value: `${tool.ratings.valueForMoney.toFixed(1)}/10`, icon: '💰' },
              { label: 'Support', value: `${tool.ratings.support.toFixed(1)}/10`, icon: '💬' },
              { label: 'Updated', value: new Date(tool.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: '📅' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 text-center hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== EXPERT VERDICT — Dark premium card ========== */}
        <section id="verdict" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">Expert Verdict</h2>
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-5 mb-6">
              <div className="flex-shrink-0 relative">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle
                    cx="30" cy="30" r="24" fill="none" strokeWidth="5"
                    strokeDasharray={`${(tool.ratings.overall / 10) * 151} 151`}
                    strokeLinecap="round"
                    className={tool.ratings.overall >= 8 ? 'text-green-400' : tool.ratings.overall >= 6 ? 'text-yellow-400' : 'text-red-400'}
                    stroke="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black">{tool.ratings.overall.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {tool.name} — {ratingLabel}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {tool.ratings.overall >= 8
                    ? `${tool.name} stands out as one of the strongest options in the ${cat?.name || 'tools'} category. With excellent scores across features (${tool.ratings.features.toFixed(1)}/10) and ease of use (${tool.ratings.easeOfUse.toFixed(1)}/10), it delivers genuine value for ${tool.pricing.hasFreeplan ? 'teams of all sizes, especially with its free plan' : `organizations willing to invest from $${tool.pricing.startingPrice}/mo`}. We recommend it for users who prioritize reliability and a mature feature set.`
                    : tool.ratings.overall >= 6
                      ? `${tool.name} is a solid contender in the ${cat?.name || 'tools'} space with room for growth. It scores well on features (${tool.ratings.features.toFixed(1)}/10) but could improve in some areas. ${tool.pricing.hasFreeplan ? 'The free plan makes it easy to evaluate before committing.' : `At $${tool.pricing.startingPrice}/mo, it offers reasonable value for what you get.`} Worth considering if its strengths align with your specific needs.`
                      : `${tool.name} offers a basic set of capabilities in the ${cat?.name || 'tools'} category. While it may work for specific use cases, there are stronger alternatives available. We recommend comparing it against top-rated competitors before committing.`
                  }
                </p>
              </div>
            </div>
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Features', score: tool.ratings.features, emoji: '⚙️' },
                { label: 'Ease of Use', score: tool.ratings.easeOfUse, emoji: '🎯' },
                { label: 'Value', score: tool.ratings.valueForMoney, emoji: '💰' },
                { label: 'Support', score: tool.ratings.support, emoji: '💬' },
              ].map(({ label, score, emoji }) => (
                <div key={label} className="bg-white/5 backdrop-blur-sm rounded-xl p-3.5 text-center border border-white/10">
                  <div className="text-lg mb-1">{emoji}</div>
                  <div className={`text-xl font-black ${score >= 8 ? 'text-green-400' : score >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>{score.toFixed(1)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== AD: MULTIPLEX BEFORE RELATED ========== */}
        <AdMultiplex />

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

        {/* ========== RELATED BLOG POSTS — Tool→Blog cross-linking ========== */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                All articles &#8594;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover-lift bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all overflow-hidden"
                >
                  <div className="p-5">
                    {post.categorySlug && (
                      <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded-full mb-3 uppercase tracking-wide">
                        {CATEGORIES[post.categorySlug]?.name || post.categorySlug}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>📅</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== FAQ SECTION ========== */}
        {toolFAQs.length > 0 && (
          <section id="faq" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">{tool.name} FAQ</h2>
            <FAQSection faqs={toolFAQs} />
          </section>
        )}

        {/* ========== INTERNAL LINKS ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools &amp; Comparisons</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* ========== AD: STICKY SIDEBAR (Desktop) ========== */}
        <div className="hidden lg:block fixed right-4 top-32 z-30" style={{ maxWidth: '300px' }}>
          <AdSidebar />
        </div>

        {/* ========== FRESHNESS SIGNAL — Enhanced trust badge ========== */}
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
              <span>Independent review by <Link href="/about/team" className="hover:text-blue-500 transition-colors">{SITE_NAME} Team</Link></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButtons
              url={`${SITE_URL}/${category}/${toolSlug}`}
              title={`${tool.name} Review — Features, Pricing & Alternatives`}
              description={tool.tagline}
            />
            <CopyLinkButton url={`${SITE_URL}/${category}/${toolSlug}`} />
          </div>
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
