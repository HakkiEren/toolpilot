import type { Metadata } from 'next';
import type { Tool } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks, getComparisonsByTool, getRelatedTools, getRelatedBlogPosts } from '@/lib/data';
import { generateToolReviewSchema, generateProductSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SEO, SITE_URL, SITE_NAME, SUBCATEGORIES } from '@/lib/constants';
import { generateToolFAQs } from '@/lib/generated-faqs';
import { FAQSection } from '@/components/common/FAQSection';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EditorialBadge } from '@/components/common/EditorialBadge';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { AdBanner, AdInArticle, AdMultiplex, AdSidebar } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import { ShareButtons } from '@/components/common/ShareButtons';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { GlossaryLinkedText } from '@/components/common/GlossaryLinkedText';
import { extractProsList, extractConsList, extractUseCaseTitles, extractBestForPersonas, getDescriptionHighlight } from '@/lib/content-extractor';
import { TableOfContents } from '@/components/common/TableOfContents';
import { RecordToolView } from '@/components/common/RecentlyViewed';
import { StickyMobileCTA } from '@/components/common/StickyMobileCTA';
import { NewsletterSignup } from '@/components/common/NewsletterSignup';

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
  if (!tool) notFound();

  const catName = CATEGORIES[category]?.name || category;
  const title = tool.metaTitle || `${tool.name} Review — Features, Pricing & Alternatives${SEO.titleSuffix}`;
  const description = tool.metaDescription || `${tool.name}: ${tool.tagline}. Read our honest review with features, pricing plans, pros & cons.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}` },
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.tagline,
      url: `${SITE_URL}/${category}/${toolSlug}`,
      type: 'article',
      siteName: SITE_NAME,
      locale: SEO.locale,
      publishedTime: tool.createdAt,
      modifiedTime: tool.lastUpdated,
      authors: [`${SITE_NAME} Editorial Team`],
      section: catName,
      tags: [tool.name, catName, 'review', 'software comparison', ...(tool.pricing.hasFreeplan ? ['free plan'] : [])],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO.twitterHandle,
      title,
      description,
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
  const productSchema = generateProductSchema(tool, cat?.name || category);
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
    description: tool.description,
    prosConsContent: tool.prosConsContent,
    useCasesContent: tool.useCasesContent,
    bestForContent: tool.bestForContent,
  });
  const faqSchema = generateFAQSchema(toolFAQs);

  // Rating label
  const ratingLabel = tool.ratings.overall >= 9 ? 'Excellent' : tool.ratings.overall >= 8 ? 'Very Good' : tool.ratings.overall >= 7 ? 'Good' : tool.ratings.overall >= 6 ? 'Decent' : 'Average';
  const ratingColor = tool.ratings.overall >= 8 ? 'text-green-600' : tool.ratings.overall >= 6 ? 'text-yellow-600' : 'text-red-600';

  // Feature entries from the features JSON
  const featureEntries = Object.entries(tool.features || {});

  return (
    <>
      <RecordToolView tool={{
        slug: tool.slug,
        categorySlug: tool.categorySlug,
        name: tool.name,
        logoUrl: tool.logoUrl,
        rating: tool.ratings.overall,
        tagline: tool.tagline,
        hasFree: tool.pricing.hasFreeplan,
      }} />
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: '' },
        ]} />
        <div className="mt-2">
          <EditorialBadge lastUpdated={tool.lastUpdated} />
        </div>

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
                <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={96} className="shadow-xl relative" priority websiteUrl={tool.websiteUrl} />
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
                  {tool.pricing.startingPrice != null && tool.pricing.startingPrice > 0 && (
                    <span className="inline-flex items-center px-3.5 py-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold backdrop-blur-sm">
                      From ${tool.pricing.startingPrice}/mo
                    </span>
                  )}
                  {tool.pricing.freeTrialDays && (
                    <span className="inline-flex items-center px-3.5 py-2 bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {tool.pricing.freeTrialDays}-Day Trial
                    </span>
                  )}
                  <time dateTime={tool.lastUpdated} className="inline-flex items-center px-3.5 py-2 bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium backdrop-blur-sm">
                    Updated {new Date(tool.lastUpdated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </time>
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
                <p className="text-[10px] text-gray-400/70 dark:text-gray-500/70 text-center mt-1 leading-tight">
                  We may earn a commission · <Link href="/editorial-policy" className="underline hover:text-gray-500 transition-colors">Editorial policy</Link>
                </p>
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
              { id: 'ideal-for', label: 'Who Should Use It?', icon: '🎯' },
              { id: 'pricing', label: 'Pricing', icon: '💰' },
              ...(relatedTools.length > 0 ? [{ id: 'scorecard', label: 'Competitor Scorecard', icon: '📊' }] : []),
              ...(comparisons.length > 0 ? [{ id: 'competitors', label: 'vs Competitors', icon: '🥊' }] : []),
              { id: 'verdict', label: 'Expert Verdict', icon: '🏆' },
              { id: 'get-started', label: 'Getting Started', icon: '🚀' },
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
            {(() => {
              const pros = extractProsList(tool.prosConsContent);
              const desc = getDescriptionHighlight(tool.description);
              const topPro = pros.length > 0 ? pros[0].charAt(0).toLowerCase() + pros[0].slice(1) : '';
              const tier = tool.ratings.overall >= 8.5 ? 'one of the top-rated' : tool.ratings.overall >= 7.5 ? 'a strong' : tool.ratings.overall >= 6 ? 'a decent' : 'an';
              const pricePart = tool.pricing.hasFreeplan
                ? `It has a free plan, so you can try it without risk.`
                : tool.pricing.startingPrice
                  ? `Plans start at $${tool.pricing.startingPrice}/mo.`
                  : 'Check their site for current pricing.';
              const proPart = topPro
                ? ` Users particularly like ${topPro}.`
                : desc
                  ? ` ${desc.split(/[.!?]/)[0]}.`
                  : '';
              const closePart = tool.ratings.overall >= 8
                ? ` We recommend it for most ${(cat?.name || 'digital').toLowerCase()} use cases.`
                : tool.ratings.overall >= 6.5
                  ? ` Worth a look if its strengths match what you need.`
                  : ` Compare it with top-rated alternatives before deciding.`;
              return `${tool.name} is ${tier} ${(cat?.name || 'digital').toLowerCase()} tool — we rate it ${tool.ratings.overall.toFixed(1)}/10 overall. ${pricePart}${proPart}${closePart}`;
            })()}
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
            <GlossaryLinkedText text={tool.description} />
          </div>
        </section>

        {/* ========== MARKET ANALYSIS — auto-generated unique per tool ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">{tool.name} — Our Analysis</h2>
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {generateMarketAnalysis(tool, cat?.name || category, relatedTools)}
            </p>
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

        {/* ========== IDEAL FOR / NOT IDEAL FOR — Buyer's Guide ========== */}
        <section id="ideal-for" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">Who Should (and Shouldn&apos;t) Use {tool.name}?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ideal For */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl p-6 border border-emerald-200/60 dark:border-emerald-800/30">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm">&#10003;</span>
                Ideal For
              </h3>
              <ul className="space-y-3 text-sm">
                {generateIdealFor(tool, cat?.name || category).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0 font-bold">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Not Ideal For */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/60 dark:border-amber-800/30">
              <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-sm">&#9888;</span>
                Not Ideal For
              </h3>
              <ul className="space-y-3 text-sm">
                {generateNotIdealFor(tool, cat?.name || category).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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

        {/* ========== PRICING INSIGHT — auto-generated unique per tool ========== */}
        {tool.pricing.plans.length > 0 && (
          <div className="mb-12 p-5 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>💡</span> Pricing Insight
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {generatePricingInsight(tool, cat?.name || category)}
            </p>
          </div>
        )}

        {/* ========== QUICK COMPETITOR SCORECARD ========== */}
        {relatedTools.length > 0 && (
          <section id="scorecard" className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2">How {tool.name} Compares</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Quick scorecard vs top alternatives in the {cat?.name || category} category</p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 w-[30%]">Tool</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500">Overall</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500 hidden sm:table-cell">Features</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500 hidden sm:table-cell">Ease of Use</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500 hidden md:table-cell">Value</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500">Price</th>
                    <th className="py-3 px-3 text-center font-medium text-gray-500">Free?</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current tool — highlighted row */}
                  <tr className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={28} />
                        <span className="font-bold text-blue-600 dark:text-blue-400">{tool.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded font-semibold">This tool</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`font-black ${tool.ratings.overall >= 8 ? 'text-green-600' : tool.ratings.overall >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>{tool.ratings.overall.toFixed(1)}</span>
                    </td>
                    <td className="py-3 px-3 text-center hidden sm:table-cell font-medium">{tool.ratings.features.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center hidden sm:table-cell font-medium">{tool.ratings.easeOfUse.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center hidden md:table-cell font-medium">{tool.ratings.valueForMoney.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center text-xs">{tool.pricing.startingPrice ? `$${tool.pricing.startingPrice}/mo` : 'N/A'}</td>
                    <td className="py-3 px-3 text-center">{tool.pricing.hasFreeplan ? <span className="text-green-500">&#10003;</span> : <span className="text-gray-300">&#10007;</span>}</td>
                  </tr>
                  {/* Competitor rows */}
                  {relatedTools.slice(0, 4).map((rt) => (
                    <tr key={rt.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link href={`/${rt.categorySlug}/${rt.slug}`} className="flex items-center gap-2.5 hover:text-blue-600 transition-colors">
                          <ToolLogo logoUrl={rt.logoUrl} name={rt.name} size={28} />
                          <span className="font-medium">{rt.name}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${rt.ratings.overall >= 8 ? 'text-green-600' : rt.ratings.overall >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>{rt.ratings.overall.toFixed(1)}</span>
                      </td>
                      <td className="py-3 px-3 text-center hidden sm:table-cell">{rt.ratings.features.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center hidden sm:table-cell">{rt.ratings.easeOfUse.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center hidden md:table-cell">{rt.ratings.valueForMoney.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center text-xs">{rt.pricing.startingPrice ? `$${rt.pricing.startingPrice}/mo` : 'N/A'}</td>
                      <td className="py-3 px-3 text-center">{rt.pricing.hasFreeplan ? <span className="text-green-500">&#10003;</span> : <span className="text-gray-300">&#10007;</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Scores based on our independent analysis. Higher is better (out of 10).</p>
          </section>
        )}

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

        {/* ========== RATING BREAKDOWN — Detailed scoring insights ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why We Rated {tool.name} {tool.ratings.overall.toFixed(1)}/10</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                label: 'Ease of Use',
                score: tool.ratings.easeOfUse,
                emoji: '🎯',
                insight: tool.ratings.easeOfUse >= 8.5
                  ? `Exceptionally intuitive — most users get productive within minutes without training.`
                  : tool.ratings.easeOfUse >= 7
                    ? `Well-designed interface with a manageable learning curve for most users.`
                    : `Steeper learning curve — plan for some onboarding time to get the most value.`,
                color: 'from-blue-500 to-blue-600',
              },
              {
                label: 'Features',
                score: tool.ratings.features,
                emoji: '⚙️',
                insight: tool.ratings.features >= 8.5
                  ? `Industry-leading feature set that covers advanced use cases competitors miss.`
                  : tool.ratings.features >= 7
                    ? `Solid feature set covering core needs with some standout capabilities.`
                    : `Covers the basics well, but may require integrations for advanced workflows.`,
                color: 'from-purple-500 to-purple-600',
              },
              {
                label: 'Value for Money',
                score: tool.ratings.valueForMoney,
                emoji: '💰',
                insight: tool.ratings.valueForMoney >= 8.5
                  ? `Excellent value — features-to-price ratio is among the best in the category.`
                  : tool.ratings.valueForMoney >= 7
                    ? `Fair pricing for what you get. ${tool.pricing.hasFreeplan ? 'The free tier makes it easy to start.' : 'Consider the free trial to evaluate.'}`
                    : `Premium pricing — best suited for teams that will fully utilize the feature set.`,
                color: 'from-green-500 to-green-600',
              },
              {
                label: 'Customer Support',
                score: tool.ratings.support,
                emoji: '💬',
                insight: tool.ratings.support >= 8.5
                  ? `Outstanding support with fast response times and knowledgeable agents.`
                  : tool.ratings.support >= 7
                    ? `Reliable support through standard channels. Documentation is well-maintained.`
                    : `Support can be slow at times. Community forums may be more helpful for quick answers.`,
                color: 'from-orange-500 to-orange-600',
              },
            ].map(({ label, score, emoji, insight, color }) => (
              <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <span className="font-semibold text-sm">{label}</span>
                  </div>
                  <div className={`text-lg font-black ${score >= 8 ? 'text-green-500' : score >= 6 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {score.toFixed(1)}
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{insight}</p>
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
                <p className="text-gray-300 leading-relaxed text-sm mb-3">
                  {generateExpertVerdict(tool, cat?.name || category)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {getVerdictHighlights(tool).map((h, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${h.positive ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                      {h.positive ? '✓' : '△'} {h.text}
                    </span>
                  ))}
                </div>
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

        {/* ========== GETTING STARTED GUIDE — CTA Section ========== */}
        <section id="get-started" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">How to Get Started with {tool.name}</h2>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/40 dark:border-blue-800/30 p-6 md:p-8">
            {/* Decorative */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {generateGettingStartedSteps(tool).map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-blue-200/40 dark:border-blue-800/20">
                <a
                  href={tool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
                >
                  {tool.pricing.hasFreeplan ? 'Start Free' : tool.pricing.freeTrialDays ? `Start ${tool.pricing.freeTrialDays}-Day Trial` : `Try ${tool.name}`} &#8599;
                </a>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {tool.pricing.hasFreeplan && (
                    <span className="flex items-center gap-1"><span className="text-green-500">&#10003;</span> No credit card required</span>
                  )}
                  {tool.pricing.freeTrialDays && (
                    <span className="flex items-center gap-1"><span className="text-blue-500">&#9719;</span> {tool.pricing.freeTrialDays}-day free trial</span>
                  )}
                  <span className="flex items-center gap-1"><span className="text-purple-500">&#128274;</span> Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== NEWSLETTER SIGNUP ========== */}
        <div className="mb-12">
          <NewsletterSignup variant="inline" category={cat?.name} />
        </div>

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

        {/* ========== BEST-OF RANKINGS — Cross-link to best-of pages ========== */}
        {toolSubcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-2">See the Full Rankings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Compare {tool.name} against all competitors in expert-curated rankings
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {toolSubcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/best/${sub.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-lg flex-shrink-0">
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Best {sub.name} ({year})
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Expert-ranked tools in this category</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-amber-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
              {/* Category hub link */}
              <Link
                href={`/${category}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-lg flex-shrink-0">
                  📂
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    All {cat?.name || category}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Browse all {cat?.toolCount || ''}+ tools in this category</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* ========== HELPFUL RESOURCES — Calculator + Glossary links ========== */}
        {(() => {
          const calcMap: Record<string, { slug: string; title: string }> = {
            'ai-tools': { slug: 'ai-cost', title: 'AI Cost Estimator' },
            'saas': { slug: 'roi', title: 'SaaS ROI Calculator' },
            'ecommerce': { slug: 'ecommerce-profit', title: 'Profit Margin Calculator' },
            'marketing': { slug: 'email-marketing-roi', title: 'Email Marketing ROI Calculator' },
            'hosting': { slug: 'hosting-cost', title: 'Hosting Cost Calculator' },
            'business': { slug: 'team-productivity', title: 'Team Productivity Calculator' },
          };
          const calc = calcMap[category];
          return (
            <section className="mb-12">
              <h2 className="text-lg font-bold mb-3">Helpful Resources</h2>
              <div className="flex flex-wrap gap-2">
                {calc && (
                  <Link href={`/calculators/${calc.slug}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg transition-colors border border-emerald-200/50 dark:border-emerald-800/50">
                    <span>&#129518;</span> {calc.title}
                  </Link>
                )}
                <Link href="/glossary" className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-2 rounded-lg transition-colors border border-cyan-200/50 dark:border-cyan-800/50">
                  <span>&#128214;</span> Tech Glossary
                </Link>
                <Link href={`/${category}/compare`} className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-800 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg transition-colors border border-purple-200/50 dark:border-purple-800/50">
                  <span>&#9878;</span> {cat?.name} Comparisons
                </Link>
              </div>
            </section>
          );
        })()}

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

      {/* ========== STICKY MOBILE CTA — Bottom bar on mobile for conversions ========== */}
      <StickyMobileCTA
        toolName={tool.name}
        rating={tool.ratings.overall}
        websiteUrl={tool.websiteUrl}
        hasFreeplan={tool.pricing.hasFreeplan}
        freeTrialDays={tool.pricing.freeTrialDays}
      />
    </>
  );
}

// ============================================================
// HELPERS — Extract pros and cons from combined HTML content
// ============================================================

function extractPros(html: string): string {
  // Plain text format: "Pros: X, Y. Cons: Z."
  if (!html.includes('<') || !html.includes('>')) {
    const prosMatch = html.match(/Pros:\s*([\s\S]*?)(?=\s*Cons:|$)/i);
    if (prosMatch) {
      const items = prosMatch[1].split(/[.,;]/).map(s => s.trim()).filter(Boolean);
      return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
    return `<ul><li>${html}</li></ul>`;
  }

  // HTML format: find content between Pros header and Cons header
  const prosMatch = html.match(/<h3[^>]*>.*?Pros.*?<\/h3>([\s\S]*?)(?=<h3|<\/div>\s*<div|$)/i);
  if (prosMatch) return prosMatch[1];

  // Fallback: first <ul> is pros
  const firstUl = html.match(/<ul[\s\S]*?<\/ul>/i);
  if (firstUl) return firstUl[0];

  return html.split('</ul>')[0] + '</ul>' || html;
}

function extractCons(html: string): string {
  // Plain text format: "Pros: X, Y. Cons: Z."
  if (!html.includes('<') || !html.includes('>')) {
    const consMatch = html.match(/Cons:\s*([\s\S]*?)$/i);
    if (consMatch) {
      const items = consMatch[1].split(/[.,;]/).map(s => s.trim()).filter(Boolean);
      return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }
    return '';
  }

  // HTML format: find content after Cons header
  const consMatch = html.match(/<h3[^>]*>.*?Cons.*?<\/h3>([\s\S]*?)(?=<\/div>\s*<\/div>|$)/i);
  if (consMatch) return consMatch[1];

  // Fallback: second <ul> is cons
  const uls = html.match(/<ul[\s\S]*?<\/ul>/gi);
  if (uls && uls.length >= 2) return uls[1];

  return '';
}

// ============================================================
// HELPERS — Expert verdict & highlight generation
// ============================================================

function generateExpertVerdict(tool: Tool, categoryName: string): string {
  const { ratings, pricing, name } = tool;
  const parts: string[] = [];
  const pros = extractProsList(tool.prosConsContent);
  const cons = extractConsList(tool.prosConsContent);
  const bestFor = extractBestForPersonas(tool.bestForContent);

  // Opening — conversational, uses real pros
  if (ratings.overall >= 8.5 && pros.length > 0) {
    parts.push(`Here's our honest take: ${name} is one of the best ${categoryName.toLowerCase()} tools we've reviewed. What makes it stand out? ${pros[0]}.`);
  } else if (ratings.overall >= 7.5 && pros.length > 0) {
    parts.push(`${name} is a solid pick in the ${categoryName.toLowerCase()} space. Its biggest strength? ${pros[0]}.`);
  } else if (ratings.overall >= 6 && pros.length > 0) {
    parts.push(`${name} gets the job done for ${categoryName.toLowerCase()}. It's not the top-rated option, but it has real strengths — like ${pros[0].charAt(0).toLowerCase() + pros[0].slice(1)}.`);
  } else if (pros.length > 0) {
    parts.push(`${name} is a more niche pick for ${categoryName.toLowerCase()}. It does have some things going for it — ${pros[0].charAt(0).toLowerCase() + pros[0].slice(1)} — but the competition is tough.`);
  } else {
    parts.push(`${name} scores ${ratings.overall.toFixed(1)}/10 overall as a ${categoryName.toLowerCase()} tool. It's ${ratings.overall >= 7.5 ? 'a strong contender' : 'worth evaluating'} depending on what you need.`);
  }

  // Second pro + pricing context
  if (pros.length >= 2) {
    parts.push(`On top of that, ${pros[1].charAt(0).toLowerCase() + pros[1].slice(1)}.`);
  }
  if (pricing.hasFreeplan && pricing.startingPrice) {
    parts.push(`You can start for free and upgrade to paid plans from $${pricing.startingPrice}/mo when you're ready.`);
  } else if (pricing.hasFreeplan) {
    parts.push(`There's a free plan, so you can try it without any commitment.`);
  } else if (pricing.startingPrice) {
    parts.push(`Pricing starts at $${pricing.startingPrice}/mo — ${pricing.startingPrice > 50 ? 'it\'s aimed at teams with real budgets' : 'reasonable for what you get'}.`);
  }

  // Weakness — honest, using real cons
  if (cons.length > 0) {
    parts.push(`Where does it fall short? ${cons[0]}. That's worth knowing upfront.`);
  }

  // Closing — with bestFor data if available
  if (ratings.overall >= 7.5 && bestFor.length > 0) {
    parts.push(`Bottom line: we'd recommend ${name} especially if you're ${bestFor[0].charAt(0).toLowerCase() + bestFor[0].slice(1)}.`);
  } else if (ratings.overall >= 7.5) {
    parts.push(`Bottom line: ${name} earns our recommendation for most ${categoryName.toLowerCase()} use cases.`);
  } else {
    parts.push(`Our suggestion: compare ${name} against top alternatives before deciding. It's decent, but there are stronger options out there.`);
  }

  return parts.join(' ');
}

// ============================================================
// HELPERS — "Ideal For / Not Ideal For" buyer guide generation
// ============================================================

function generateIdealFor(tool: Tool, categoryName: string): string[] {
  const items: string[] = [];
  const bestFor = extractBestForPersonas(tool.bestForContent);
  const useCases = extractUseCaseTitles(tool.useCasesContent);

  // Pull from real bestFor data first (highest uniqueness)
  for (const persona of bestFor.slice(0, 3)) {
    if (items.length < 3) items.push(persona);
  }

  // Add rating-based items if needed
  if (items.length < 3 && tool.ratings.easeOfUse >= 8) {
    items.push(`People who don't want a steep learning curve — ${tool.name} is beginner-friendly (${tool.ratings.easeOfUse.toFixed(1)}/10 ease of use)`);
  }
  if (items.length < 4 && tool.pricing.hasFreeplan) {
    items.push(`Anyone who wants to test-drive before paying — there's a free plan`);
  }
  if (items.length < 4 && tool.ratings.valueForMoney >= 8.5) {
    items.push(`Value-seekers — you get a lot for your money (${tool.ratings.valueForMoney.toFixed(1)}/10 value score)`);
  }
  if (items.length < 4 && useCases.length > 0) {
    items.push(`Teams focused on ${useCases[0].charAt(0).toLowerCase() + useCases[0].slice(1)}`);
  }
  if (items.length < 3) {
    items.push(`Anyone shopping for a solid ${categoryName.toLowerCase()} tool — rated ${tool.ratings.overall.toFixed(1)}/10`);
  }

  return items.slice(0, 5);
}

function generateNotIdealFor(tool: Tool, categoryName: string): string[] {
  const items: string[] = [];
  const cons = extractConsList(tool.prosConsContent);

  // Pull from real cons first (highest uniqueness)
  if (cons.length > 0) {
    items.push(`People bothered by: ${cons[0].charAt(0).toLowerCase() + cons[0].slice(1)}`);
  }
  if (cons.length >= 2) {
    items.push(`Users who need: ${cons[1].charAt(0).toLowerCase() + cons[1].slice(1)} — that's a weak spot here`);
  }

  // Rating-based fallbacks
  if (items.length < 2 && !tool.pricing.hasFreeplan && tool.pricing.startingPrice && tool.pricing.startingPrice > 50) {
    items.push(`Budget-limited users — there's no free plan and pricing starts at $${tool.pricing.startingPrice}/mo`);
  }
  if (items.length < 3 && tool.ratings.easeOfUse < 7) {
    items.push('People who want plug-and-play simplicity — there is a learning curve');
  }
  if (items.length < 3 && tool.ratings.support < 7) {
    items.push('Teams that rely heavily on customer support — it\'s not the strongest here');
  }
  if (items.length < 2) {
    items.push(`Users with very niche needs beyond mainstream ${categoryName.toLowerCase()} tools`);
  }

  return items.slice(0, 4);
}

// ============================================================
// HELPERS — Getting Started steps generation
// ============================================================

function generateGettingStartedSteps(tool: Tool): Array<{ title: string; description: string }> {
  const steps: Array<{ title: string; description: string }> = [];
  const useCases = extractUseCaseTitles(tool.useCasesContent);
  const pros = extractProsList(tool.prosConsContent);

  // Step 1: Sign up
  if (tool.pricing.hasFreeplan) {
    steps.push({
      title: 'Create a free account',
      description: `Head to ${tool.name}'s website and sign up — no credit card needed for the free plan. You'll get access right away.`,
    });
  } else if (tool.pricing.freeTrialDays) {
    steps.push({
      title: `Start your ${tool.pricing.freeTrialDays}-day free trial`,
      description: `Sign up for the trial and explore everything ${tool.name} offers. ${tool.pricing.freeTrialDays} days is enough time to know if it's right for you.`,
    });
  } else {
    steps.push({
      title: 'Pick a plan and sign up',
      description: `Visit ${tool.name}'s website and choose the plan that fits${tool.pricing.startingPrice ? ` (starting at $${tool.pricing.startingPrice}/mo)` : ''}. Most plans let you cancel anytime.`,
    });
  }

  // Step 2: Setup (tool-specific)
  steps.push({
    title: 'Set up your workspace',
    description: tool.ratings.easeOfUse >= 8
      ? `Follow the onboarding guide — most people are up and running in minutes. ${tool.name} is designed to be intuitive from the start.`
      : `Take 15-20 minutes to go through the setup wizard. Check out any tutorials they offer — it'll save you time later.`,
  });

  // Step 3: Go live (uses real features/use cases)
  const goLiveDetail = useCases.length > 0
    ? `Start with ${useCases[0].charAt(0).toLowerCase() + useCases[0].slice(1)} — that's where most users see quick wins.`
    : pros.length > 0
      ? `Focus on what ${tool.name} does best: ${pros[0].charAt(0).toLowerCase() + pros[0].slice(1)}.`
      : 'Start with the core features and build from there as you get comfortable.';
  steps.push({
    title: 'Start using it for real',
    description: `Don't just poke around — actually use it for a real task. ${goLiveDetail}`,
  });

  return steps;
}

function getVerdictHighlights(tool: Tool): Array<{ text: string; positive: boolean }> {
  const highlights: Array<{ text: string; positive: boolean }> = [];

  if (tool.ratings.overall >= 8) highlights.push({ text: 'Top Rated', positive: true });
  if (tool.ratings.easeOfUse >= 8.5) highlights.push({ text: 'Very Easy to Use', positive: true });
  if (tool.ratings.features >= 8.5) highlights.push({ text: 'Feature-Rich', positive: true });
  if (tool.ratings.valueForMoney >= 8.5) highlights.push({ text: 'Great Value', positive: true });
  if (tool.ratings.support >= 8.5) highlights.push({ text: 'Excellent Support', positive: true });
  if (tool.pricing.hasFreeplan) highlights.push({ text: 'Free Plan Available', positive: true });
  if (tool.pricing.freeTrialDays) highlights.push({ text: `${tool.pricing.freeTrialDays}-Day Trial`, positive: true });

  // Constructive warnings
  if (tool.ratings.support < 6.5) highlights.push({ text: 'Limited Support', positive: false });
  if (tool.ratings.easeOfUse < 6.5) highlights.push({ text: 'Steep Learning Curve', positive: false });
  if (tool.pricing.startingPrice && tool.pricing.startingPrice > 100) highlights.push({ text: 'Premium Pricing', positive: false });

  return highlights.slice(0, 5);
}

// ============================================================
// HELPERS — Market analysis & pricing insight (unique per tool)
// ============================================================

function generateMarketAnalysis(tool: Tool, categoryName: string, relatedTools: Tool[]): string {
  const parts: string[] = [];
  const desc = getDescriptionHighlight(tool.description);
  const pros = extractProsList(tool.prosConsContent);
  const useCases = extractUseCaseTitles(tool.useCasesContent);

  // Opening — use first sentence from description (UNIQUE per tool)
  if (desc) {
    parts.push(desc.split(/[.!?]/)[0] + '.');
  }

  // Positioning
  const tier = tool.ratings.overall >= 8.5 ? 'one of the highest-rated' : tool.ratings.overall >= 7.5 ? 'a well-regarded' : tool.ratings.overall >= 6.5 ? 'a mid-tier' : 'a newer';
  parts.push(`It's ${tier} option in ${categoryName.toLowerCase()}, scoring ${tool.ratings.overall.toFixed(1)}/10 overall.`);

  // What it does well — from real pros
  if (pros.length >= 2) {
    parts.push(`What users like most: ${pros[0].charAt(0).toLowerCase() + pros[0].slice(1)}, and ${pros[1].charAt(0).toLowerCase() + pros[1].slice(1)}.`);
  } else if (pros.length === 1) {
    parts.push(`Its biggest draw? ${pros[0]}.`);
  }

  // Pricing context
  if (tool.pricing.hasFreeplan && tool.pricing.startingPrice) {
    parts.push(`You can start free and scale to paid plans from $${tool.pricing.startingPrice}/mo — handy for teams that want to test before they invest.`);
  } else if (tool.pricing.hasFreeplan) {
    parts.push(`The free plan is a nice touch — lets you kick the tires before spending anything.`);
  } else if (tool.pricing.startingPrice) {
    parts.push(`At $${tool.pricing.startingPrice}/mo to start, it's ${tool.pricing.startingPrice > 50 ? 'positioned for teams with real budgets' : 'priced competitively for its class'}.`);
  }

  // Competition
  if (relatedTools.length > 2) {
    const avg = relatedTools.reduce((s, t) => s + t.ratings.overall, 0) / relatedTools.length;
    const diff = tool.ratings.overall - avg;
    if (diff > 0.5) {
      parts.push(`It outperforms most alternatives in this category (average: ${avg.toFixed(1)}/10).`);
    } else if (diff < -0.5) {
      parts.push(`Some competitors score higher on average (${avg.toFixed(1)}/10), but ${tool.name} has its own niche.`);
    }
  }

  // Use cases
  if (useCases.length >= 2) {
    parts.push(`Common use cases include ${useCases[0].charAt(0).toLowerCase() + useCases[0].slice(1)} and ${useCases[1].charAt(0).toLowerCase() + useCases[1].slice(1)}.`);
  }

  return parts.join(' ');
}

function generatePricingInsight(tool: Tool, categoryName: string): string {
  const parts: string[] = [];
  const { pricing } = tool;

  if (pricing.plans.length >= 2) {
    const sorted = [...pricing.plans].filter(p => p.price !== null && p.price !== undefined).sort((a, b) => (a.price || 0) - (b.price || 0));
    const cheapest = sorted[0];
    const expensive = sorted[sorted.length - 1];
    if (cheapest && expensive && cheapest !== expensive) {
      parts.push(`${tool.name} has ${pricing.plans.length} pricing tiers, from ${cheapest.price === 0 ? 'free' : `$${cheapest.price}/mo`} (${cheapest.name}) up to ${expensive.price === null ? 'custom pricing' : `$${expensive.price}/mo`} (${expensive.name}).`);
    }
  }

  if (pricing.hasFreeplan) {
    const freePlan = pricing.plans.find(p => p.price === 0);
    if (freePlan && freePlan.features.length > 0) {
      parts.push(`The free ${freePlan.name} plan isn't just a demo — it includes ${freePlan.features.length} usable features${freePlan.features.length >= 3 ? ` like ${freePlan.features[0].toLowerCase()} and ${freePlan.features[1].toLowerCase()}` : ''}.`);
    }
  }

  const v = tool.ratings.valueForMoney;
  if (v >= 8) {
    parts.push(`With a ${v.toFixed(1)}/10 value score, you're getting good bang for your buck compared to other ${categoryName.toLowerCase()} tools.`);
  } else if (v >= 7) {
    parts.push(`The value score sits at ${v.toFixed(1)}/10 — fair for what you get, though shopping around never hurts.`);
  } else {
    parts.push(`At ${v.toFixed(1)}/10 for value, it's worth checking whether the features justify the cost for your use case.`);
  }

  return parts.join(' ');
}
