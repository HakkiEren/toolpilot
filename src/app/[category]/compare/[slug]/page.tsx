import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparison, getAllComparisonSlugs, getRelatedLinks, getRelatedComparisons, getRelatedBlogPosts } from '@/lib/data';
import { generateComparisonSchema, generateComparisonItemListSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, SUBCATEGORIES, LIMITS, SEO, SITE_URL, SITE_NAME } from '@/lib/constants';
import { generateComparisonBottomLine, generateKeyDifferences, generateComparisonFAQs } from '@/lib/generated-faqs';
// Components
import { ScoreCompare } from '@/components/comparison/ScoreCompare';
import { FeatureMatrix } from '@/components/comparison/FeatureMatrix';
import { PriceCompare } from '@/components/comparison/PriceCompare';
import { VerdictSection } from '@/components/comparison/VerdictSection';
import { FAQSection } from '@/components/common/FAQSection';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EditorialBadge } from '@/components/common/EditorialBadge';
import { AdBanner, AdInArticle, AdMultiplex, AdNative } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import { ShareButtons } from '@/components/common/ShareButtons';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { HtmlContent, stripHtml } from '@/components/common/HtmlContent';
import { RecordToolView } from '@/components/common/RecentlyViewed';

// ============================================================
// COMPARISON PAGE — ENHANCED with winner banner, nav, tool cards
// ============================================================

/**
 * Parse scenario content for a specific tool.
 * Some DB records put both tools' scenarios in scenarioContent with h3 headers,
 * while migrationContent is empty. This splits them intelligently.
 */
function parseScenarioForTool(scenarioContent: string, migrationContent: string, tool: 'a' | 'b'): string {
  // If both fields have content, use them directly
  if (scenarioContent && migrationContent) {
    return tool === 'a' ? scenarioContent : migrationContent;
  }

  // If only one field has content, try to split it by "Choose Tool B" header
  if (scenarioContent && !migrationContent) {
    // Look for a split point: second h3, or "Choose Tool B" pattern
    const toolBPatterns = [
      /<h3[^>]*>Choose Tool B/i,
      /<h3[^>]*>.*?Tool B/i,
      /<h3[^>]*>.*?if you (?:are|want|need|prefer).*?<\/h3>/i,
    ];

    for (const pattern of toolBPatterns) {
      const match = scenarioContent.search(pattern);
      if (match > 0) {
        const partA = scenarioContent.substring(0, match).replace(/<h3[^>]*>.*?<\/h3>/i, '').trim();
        const partB = scenarioContent.substring(match).replace(/<h3[^>]*>.*?<\/h3>/i, '').trim();
        return tool === 'a' ? partA : partB;
      }
    }

    // Fallback: try splitting by the second <h3> tag
    const h3Parts = scenarioContent.split(/<h3[^>]*>/i).filter(Boolean);
    if (h3Parts.length >= 2) {
      const cleanPart = (p: string) => p.replace(/<\/h3>/i, '').trim();
      return tool === 'a' ? cleanPart(h3Parts[0]) : cleanPart(h3Parts[1]);
    }

    // Last resort: try splitting by <ul> blocks
    const ulParts = scenarioContent.split(/<\/ul>/i).filter(p => p.includes('<ul'));
    if (ulParts.length >= 2) {
      return tool === 'a'
        ? ulParts[0].replace(/<h3[^>]*>.*?<\/h3>/gi, '').trim() + '</ul>'
        : ulParts[1].replace(/<h3[^>]*>.*?<\/h3>/gi, '').trim() + '</ul>';
    }
  }

  // If nothing works, return what we have or empty
  if (tool === 'a') return scenarioContent || '';
  return migrationContent || scenarioContent || '';
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllComparisonSlugs();
  return slugs.map(({ categorySlug, comparisonSlug }) => ({
    category: categorySlug,
    slug: comparisonSlug,
  }));
}

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const comparison = await getComparison(category, slug);
  if (!comparison) return {};

  const title = comparison.metaTitle || `${comparison.toolA.name} vs ${comparison.toolB.name}${SEO.titleSuffix}`;
  const description = comparison.metaDescription ||
    `Compare ${comparison.toolA.name} and ${comparison.toolB.name} side by side. Features, pricing, pros & cons, and which is better for you.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${category}/compare/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${category}/compare/${slug}`,
      type: 'article',
      siteName: SITE_NAME,
      locale: SEO.locale,
      publishedTime: comparison.lastUpdated,
      modifiedTime: comparison.lastUpdated,
      section: CATEGORIES[category]?.name || category,
      authors: [`${SITE_NAME} Editorial Team`],
      tags: [comparison.toolA.name, comparison.toolB.name, 'comparison', CATEGORIES[category]?.name || category],
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO.twitterHandle,
      title,
      description,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { category, slug } = await params;
  const comparison = await getComparison(category, slug);
  if (!comparison) notFound();

  const cat = CATEGORIES[category];
  const [relatedLinks, alsoCompare, relatedPosts] = await Promise.all([
    getRelatedLinks(comparison.toolA),
    getRelatedComparisons(comparison, 4),
    getRelatedBlogPosts(category, comparison.toolA.slug, 2),
  ]);
  const year = new Date().getFullYear();

  // Determine winner
  const aScore = comparison.toolA.ratings.overall;
  const bScore = comparison.toolB.ratings.overall;
  const winner = aScore > bScore ? 'a' : bScore > aScore ? 'b' : 'tie';
  const winnerName = winner === 'a' ? comparison.toolA.name : winner === 'b' ? comparison.toolB.name : null;
  const scoreDiff = Math.abs(aScore - bScore).toFixed(1);

  // Auto-generate FAQs when DB doesn't have them (ensures FAQ rich snippets on all comparisons)
  const compFaqs = comparison.faqs && comparison.faqs.length > 0
    ? comparison.faqs
    : generateComparisonFAQs(comparison.toolA, comparison.toolB);

  // Schema markup
  const articleSchema = generateComparisonSchema(comparison);
  const itemListSchema = generateComparisonItemListSchema(comparison);
  const faqSchema = generateFAQSchema(compFaqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: `${comparison.toolA.name} vs ${comparison.toolB.name}`, url: `/${category}/compare/${slug}` },
  ]);

  // Key Differences + Bottom Line
  const keyDiffs = generateKeyDifferences(comparison.toolA.name, comparison.toolB.name, comparison.featureMatrix);
  const bottomLine = generateComparisonBottomLine(comparison.toolA.name, comparison.toolB.name, aScore, bScore, comparison.verdictContent);

  // Section IDs for navigation
  const sections = [
    { id: 'scores', label: 'Scores' },
    { id: 'strengths', label: 'Strengths' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'verdict', label: 'Verdict' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Track both compared tools in Recently Viewed */}
      <RecordToolView tool={{
        slug: comparison.toolA.slug,
        categorySlug: comparison.toolA.categorySlug,
        name: comparison.toolA.name,
        logoUrl: comparison.toolA.logoUrl,
        rating: comparison.toolA.ratings.overall,
        tagline: comparison.toolA.tagline,
        hasFree: comparison.toolA.pricing.hasFreeplan,
      }} />
      <RecordToolView tool={{
        slug: comparison.toolB.slug,
        categorySlug: comparison.toolB.categorySlug,
        name: comparison.toolB.name,
        logoUrl: comparison.toolB.logoUrl,
        rating: comparison.toolB.ratings.overall,
        tagline: comparison.toolB.tagline,
        hasFree: comparison.toolB.pricing.hasFreeplan,
      }} />
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: cat?.name || category, url: `/${category}` },
            { name: `${comparison.toolA.name} vs ${comparison.toolB.name}`, url: '' },
          ]}
        />
        <div className="mt-2">
          <EditorialBadge lastUpdated={comparison.lastUpdated} />
        </div>

        {/* ========== HERO — Dramatic battle card with gradient ========== */}
        <div className="mt-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {comparison.toolA.name} vs {comparison.toolB.name}: Honest Comparison ({year})
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            <time dateTime={comparison.lastUpdated} className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Updated {new Date(comparison.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-gray-500 dark:text-gray-400">By {SITE_NAME} Editorial Team</span>
          </div>

          {/* Battle Arena — Side by side with VS divider */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden mb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIi8+PC9zdmc+')] pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-0 p-6 md:p-8">
              {/* Tool A */}
              <div className="text-center md:text-left card-animate" style={{ animationDelay: '0ms' }}>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <div className="relative">
                    {winner === 'a' && <div className="absolute -top-2 -right-2 text-lg animate-bounce">👑</div>}
                    <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={56} className="shadow-lg" websiteUrl={comparison.toolA.websiteUrl} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{comparison.toolA.name}</h2>
                    <div className="flex items-center gap-1.5 text-sm justify-center md:justify-start mt-1">
                      <span className="text-yellow-500">&#9733;</span>
                      <span className="font-black text-lg">{aScore.toFixed(1)}</span>
                      <span className="text-gray-400">/10</span>
                      {winner === 'a' && (
                        <span className="ml-1 px-2.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">WINNER</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{comparison.toolA.tagline}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs justify-center md:justify-start">
                  {comparison.toolA.pricing.hasFreeplan && (
                    <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">Free Plan</span>
                  )}
                  {comparison.toolA.pricing.startingPrice !== null && (
                    <span className="px-2.5 py-1 bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-medium">From ${comparison.toolA.pricing.startingPrice}/mo</span>
                  )}
                </div>
                {comparison.toolA.websiteUrl && (
                  <a
                    href={comparison.toolA.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-600/20"
                  >
                    Visit {comparison.toolA.name} &#8599;
                  </a>
                )}
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center py-4 md:py-0 md:px-6">
                <div className="vs-divider">VS</div>
              </div>

              {/* Tool B */}
              <div className="text-center md:text-right card-animate" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col md:flex-row-reverse items-center gap-4 mb-4">
                  <div className="relative">
                    {winner === 'b' && <div className="absolute -top-2 -left-2 text-lg animate-bounce">👑</div>}
                    <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={56} className="shadow-lg" websiteUrl={comparison.toolB.websiteUrl} />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl">{comparison.toolB.name}</h2>
                    <div className="flex items-center gap-1.5 text-sm justify-center md:justify-end mt-1">
                      {winner === 'b' && (
                        <span className="mr-1 px-2.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-sm">WINNER</span>
                      )}
                      <span className="text-yellow-500">&#9733;</span>
                      <span className="font-black text-lg">{bScore.toFixed(1)}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{comparison.toolB.tagline}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs justify-center md:justify-end">
                  {comparison.toolB.pricing.hasFreeplan && (
                    <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold">Free Plan</span>
                  )}
                  {comparison.toolB.pricing.startingPrice !== null && (
                    <span className="px-2.5 py-1 bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-medium">From ${comparison.toolB.pricing.startingPrice}/mo</span>
                  )}
                </div>
                {comparison.toolB.websiteUrl && (
                  <a
                    href={comparison.toolB.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-600/20"
                  >
                    Visit {comparison.toolB.name} &#8599;
                  </a>
                )}
              </div>
            </div>

            {/* Winner Strip */}
            {winnerName && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 flex items-center justify-center gap-2 text-white text-sm font-bold">
                <span>🏆</span>
                {winnerName} wins with {(winner === 'a' ? aScore : bScore).toFixed(1)}/10 — leading by {scoreDiff} points
              </div>
            )}
            <p className="text-[10px] text-gray-400/70 dark:text-gray-500/70 text-center py-2">
              We may earn a commission through links on this page · <Link href="/editorial-policy" className="underline hover:text-gray-500 transition-colors">Editorial policy</Link>
            </p>
          </div>

          {/* TL;DR Summary — AI Overview optimized */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/30 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">TL;DR</span>
              <div className="flex-1 h-px bg-blue-200/50 dark:bg-blue-800/30" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" data-speakable="true">
              {winnerName
                ? `${winnerName} wins this comparison with a score of ${(winner === 'a' ? aScore : bScore).toFixed(1)}/10 vs ${(winner === 'a' ? bScore : aScore).toFixed(1)}/10. `
                : `Both tools are evenly matched at ${aScore.toFixed(1)}/10. `}
              {comparison.toolA.pricing.hasFreeplan && comparison.toolB.pricing.hasFreeplan
                ? 'Both offer free plans. '
                : comparison.toolA.pricing.hasFreeplan
                  ? `${comparison.toolA.name} offers a free plan. `
                  : comparison.toolB.pricing.hasFreeplan
                    ? `${comparison.toolB.name} offers a free plan. `
                    : ''}
              Choose {comparison.toolA.name} for {comparison.toolA.ratings.easeOfUse > comparison.toolB.ratings.easeOfUse ? 'ease of use' : 'features'}, or {comparison.toolB.name} for {comparison.toolB.ratings.valueForMoney > comparison.toolA.ratings.valueForMoney ? 'better value' : 'its strengths'}.
            </p>
          </div>

          {/* Quick Comparison Summary Table — Optimized for Google featured snippets */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <table className="w-full text-sm border-collapse" role="table">
              <caption className="sr-only">{comparison.toolA.name} vs {comparison.toolB.name} Quick Comparison</caption>
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th scope="col" className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Feature</th>
                  <th scope="col" className="py-3 px-4 text-center font-semibold text-blue-700 dark:text-blue-400">{comparison.toolA.name}</th>
                  <th scope="col" className="py-3 px-4 text-center font-semibold text-purple-700 dark:text-purple-400">{comparison.toolB.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Overall Rating</td>
                  <td className="py-2.5 px-4 text-center font-bold">{comparison.toolA.ratings.overall.toFixed(1)}/10</td>
                  <td className="py-2.5 px-4 text-center font-bold">{comparison.toolB.ratings.overall.toFixed(1)}/10</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Ease of Use</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.ratings.easeOfUse.toFixed(1)}/10</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.ratings.easeOfUse.toFixed(1)}/10</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Features</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.ratings.features.toFixed(1)}/10</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.ratings.features.toFixed(1)}/10</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Value for Money</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.ratings.valueForMoney.toFixed(1)}/10</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.ratings.valueForMoney.toFixed(1)}/10</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Customer Support</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.ratings.support.toFixed(1)}/10</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.ratings.support.toFixed(1)}/10</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Free Plan</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.pricing.hasFreeplan ? 'Yes ✓' : 'No'}</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.pricing.hasFreeplan ? 'Yes ✓' : 'No'}</td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 px-4 font-medium text-gray-700 dark:text-gray-300">Starting Price</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolA.pricing.startingPrice ? `$${comparison.toolA.pricing.startingPrice}/mo` : 'N/A'}</td>
                  <td className="py-2.5 px-4 text-center">{comparison.toolB.pricing.startingPrice ? `$${comparison.toolB.pricing.startingPrice}/mo` : 'N/A'}</td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                  <td className="py-2.5 px-4 font-bold text-gray-900 dark:text-white">Winner</td>
                  <td colSpan={2} className="py-2.5 px-4 text-center font-bold text-green-600 dark:text-green-400">{winnerName ? `${winnerName} (${(winner === 'a' ? aScore : bScore).toFixed(1)}/10)` : `Tie (${aScore.toFixed(1)}/10)`}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Intro Content */}
          <HtmlContent
            html={comparison.introContent}
            glossaryLinks
            className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
          />
        </div>

        {/* ========== KEY DIFFERENCES AT A GLANCE ========== */}
        {keyDiffs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Key Differences at a Glance</h2>
            <div className="space-y-3">
              {keyDiffs.map((diff, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{diff.area}</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${diff.winner === 'a' ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                      {diff.winner === 'a' && <span className="text-green-600 text-sm mt-0.5">&#10003;</span>}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{diff.toolAPoint}</span>
                    </div>
                    <div className={`flex items-start gap-2 p-3 rounded-lg ${diff.winner === 'b' ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                      {diff.winner === 'b' && <span className="text-green-600 text-sm mt-0.5">&#10003;</span>}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{diff.toolBPoint}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========== SECTION NAVIGATION ========== */}
        <nav className="sticky top-16 z-40 glass -mx-4 px-4 py-3 mb-8 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
              <Link href={`/${category}/${comparison.toolA.slug}`} className="hover:text-blue-600">{comparison.toolA.name}</Link>
              <span>|</span>
              <Link href={`/${category}/${comparison.toolB.slug}`} className="hover:text-blue-600">{comparison.toolB.name}</Link>
            </div>
          </div>
        </nav>

        {/* ========== QUICK VERDICT ========== */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">Quick Verdict</h2>
          <HtmlContent html={comparison.verdictContent} className="text-gray-700 dark:text-gray-200 [&>p]:mb-3 [&>p:last-child]:mb-0" />
        </div>

        {/* ========== DECISION GUIDE — "Which Should You Choose?" ========== */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={24} />
              <h3 className="font-bold text-sm">Choose {comparison.toolA.name} if you need...</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {comparison.toolA.ratings.easeOfUse >= comparison.toolB.ratings.easeOfUse && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>Better ease of use ({comparison.toolA.ratings.easeOfUse.toFixed(1)} vs {comparison.toolB.ratings.easeOfUse.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolA.ratings.features >= comparison.toolB.ratings.features && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>More comprehensive features ({comparison.toolA.ratings.features.toFixed(1)} vs {comparison.toolB.ratings.features.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolA.ratings.support > comparison.toolB.ratings.support && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>Stronger customer support ({comparison.toolA.ratings.support.toFixed(1)} vs {comparison.toolB.ratings.support.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolA.ratings.valueForMoney > comparison.toolB.ratings.valueForMoney && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>Better value for money ({comparison.toolA.ratings.valueForMoney.toFixed(1)} vs {comparison.toolB.ratings.valueForMoney.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolA.pricing.hasFreeplan && !comparison.toolB.pricing.hasFreeplan && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>A free plan to get started</span>
                </li>
              )}
              {comparison.toolA.pricing.startingPrice != null && comparison.toolB.pricing.startingPrice != null && comparison.toolA.pricing.startingPrice < comparison.toolB.pricing.startingPrice && (
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  <span>Lower starting price (${comparison.toolA.pricing.startingPrice}/mo vs ${comparison.toolB.pricing.startingPrice}/mo)</span>
                </li>
              )}
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={24} />
              <h3 className="font-bold text-sm">Choose {comparison.toolB.name} if you need...</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {comparison.toolB.ratings.easeOfUse > comparison.toolA.ratings.easeOfUse && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>Better ease of use ({comparison.toolB.ratings.easeOfUse.toFixed(1)} vs {comparison.toolA.ratings.easeOfUse.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolB.ratings.features > comparison.toolA.ratings.features && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>More comprehensive features ({comparison.toolB.ratings.features.toFixed(1)} vs {comparison.toolA.ratings.features.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolB.ratings.support > comparison.toolA.ratings.support && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>Stronger customer support ({comparison.toolB.ratings.support.toFixed(1)} vs {comparison.toolA.ratings.support.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolB.ratings.valueForMoney > comparison.toolA.ratings.valueForMoney && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>Better value for money ({comparison.toolB.ratings.valueForMoney.toFixed(1)} vs {comparison.toolA.ratings.valueForMoney.toFixed(1)})</span>
                </li>
              )}
              {comparison.toolB.pricing.hasFreeplan && !comparison.toolA.pricing.hasFreeplan && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>A free plan to get started</span>
                </li>
              )}
              {comparison.toolA.pricing.startingPrice != null && comparison.toolB.pricing.startingPrice != null && comparison.toolB.pricing.startingPrice < comparison.toolA.pricing.startingPrice && (
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  <span>Lower starting price (${comparison.toolB.pricing.startingPrice}/mo vs ${comparison.toolA.pricing.startingPrice}/mo)</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ========== SCORES ========== */}
        <section id="scores" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Overall Score Comparison</h2>
          <ScoreCompare toolA={comparison.toolA} toolB={comparison.toolB} />
        </section>

        {/* ========== STRENGTHS & WEAKNESSES BREAKDOWN ========== */}
        <section id="strengths" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Strengths &amp; Weaknesses</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tool A */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={28} />
                <span className="font-bold text-sm">{comparison.toolA.name}</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Ease of Use', scoreA: comparison.toolA.ratings.easeOfUse, scoreB: comparison.toolB.ratings.easeOfUse, icon: '🎯', gradient: 'from-blue-500 to-cyan-400' },
                  { label: 'Features', scoreA: comparison.toolA.ratings.features, scoreB: comparison.toolB.ratings.features, icon: '⚙️', gradient: 'from-purple-500 to-indigo-400' },
                  { label: 'Value for Money', scoreA: comparison.toolA.ratings.valueForMoney, scoreB: comparison.toolB.ratings.valueForMoney, icon: '💰', gradient: 'from-green-500 to-emerald-400' },
                  { label: 'Support', scoreA: comparison.toolA.ratings.support, scoreB: comparison.toolB.ratings.support, icon: '💬', gradient: 'from-orange-500 to-amber-400' },
                ].map(({ label, scoreA, scoreB, icon, gradient }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span>{icon}</span>
                        <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-black ${scoreA > scoreB ? 'text-green-500' : scoreA < scoreB ? 'text-gray-400' : 'text-yellow-500'}`}>{scoreA.toFixed(1)}</span>
                        {scoreA > scoreB && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded font-bold">WINS</span>}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${(scoreA / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Tool B */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={28} />
                <span className="font-bold text-sm">{comparison.toolB.name}</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Ease of Use', scoreA: comparison.toolA.ratings.easeOfUse, scoreB: comparison.toolB.ratings.easeOfUse, icon: '🎯', gradient: 'from-blue-500 to-cyan-400' },
                  { label: 'Features', scoreA: comparison.toolA.ratings.features, scoreB: comparison.toolB.ratings.features, icon: '⚙️', gradient: 'from-purple-500 to-indigo-400' },
                  { label: 'Value for Money', scoreA: comparison.toolA.ratings.valueForMoney, scoreB: comparison.toolB.ratings.valueForMoney, icon: '💰', gradient: 'from-green-500 to-emerald-400' },
                  { label: 'Support', scoreA: comparison.toolA.ratings.support, scoreB: comparison.toolB.ratings.support, icon: '💬', gradient: 'from-orange-500 to-amber-400' },
                ].map(({ label, scoreA, scoreB, icon, gradient }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span>{icon}</span>
                        <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-black ${scoreB > scoreA ? 'text-green-500' : scoreB < scoreA ? 'text-gray-400' : 'text-yellow-500'}`}>{scoreB.toFixed(1)}</span>
                        {scoreB > scoreA && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded font-bold">WINS</span>}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${(scoreB / 10) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== AD: AFTER SCORES ========== */}
        <AdBanner />

        {/* ========== FEATURES ========== */}
        <section id="features" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Feature-by-Feature Comparison</h2>
          <FeatureMatrix
            features={comparison.featureMatrix}
            toolAName={comparison.toolA.name}
            toolBName={comparison.toolB.name}
          />
        </section>

        {/* ========== PRICING ========== */}
        <section id="pricing" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Pricing Comparison</h2>
          <PriceCompare toolA={comparison.toolA} toolB={comparison.toolB} />
        </section>

        {/* ========== AD: AFTER PRICING ========== */}
        <AdInArticle />

        {/* ========== VERDICT / USE CASES ========== */}
        <section id="verdict" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Which Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="hover-lift bg-white dark:bg-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-4">
                <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={32} />
                <h3 className="text-lg font-semibold">
                  Choose {comparison.toolA.name} if...
                </h3>
              </div>
              <HtmlContent html={parseScenarioForTool(comparison.scenarioContent, comparison.migrationContent, 'a')} className="text-gray-600 dark:text-gray-300 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>li]:text-sm [&>p]:mb-2" />
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Link
                  href={`/${category}/${comparison.toolA.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
                >
                  Read Review &#8594;
                </Link>
                {comparison.toolA.websiteUrl && (
                  <a
                    href={comparison.toolA.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Try Free &#8599;
                  </a>
                )}
              </div>
            </div>
            <div className="hover-lift bg-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center gap-3 mb-4">
                <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={32} />
                <h3 className="text-lg font-semibold">
                  Choose {comparison.toolB.name} if...
                </h3>
              </div>
              <HtmlContent html={parseScenarioForTool(comparison.scenarioContent, comparison.migrationContent, 'b')} className="text-gray-600 dark:text-gray-300 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>li]:text-sm [&>p]:mb-2" />
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Link
                  href={`/${category}/${comparison.toolB.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium hover:underline"
                >
                  Read Review &#8594;
                </Link>
                {comparison.toolB.websiteUrl && (
                  <a
                    href={comparison.toolB.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors"
                  >
                    Try Free &#8599;
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Buyer's Guide */}
          <div className="mt-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
            <div className="p-5 border-b border-gray-200/60 dark:border-gray-700/60">
              <h3 className="font-bold text-lg">Quick Buyer&apos;s Guide</h3>
              <p className="text-sm text-gray-500 mt-1">Based on our analysis, here&apos;s who each tool is best suited for</p>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/60 dark:divide-gray-700/60">
              {/* Tool A buyer profile */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={24} />
                  <span className="font-semibold text-sm">{comparison.toolA.name} is best for:</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {generateBuyerProfile(comparison.toolA, comparison.toolB).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${category}/${comparison.toolA.slug}`} className="text-xs text-blue-600 font-medium hover:underline">Full Review &#8594;</Link>
                  <Link href={`/${category}/${comparison.toolA.slug}/pricing`} className="text-xs text-gray-500 font-medium hover:text-blue-600 hover:underline">Pricing &#8594;</Link>
                  <Link href={`/${category}/${comparison.toolA.slug}/alternatives`} className="text-xs text-gray-500 font-medium hover:text-blue-600 hover:underline">Alternatives &#8594;</Link>
                </div>
              </div>
              {/* Tool B buyer profile */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={24} />
                  <span className="font-semibold text-sm">{comparison.toolB.name} is best for:</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {generateBuyerProfile(comparison.toolB, comparison.toolA).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${category}/${comparison.toolB.slug}`} className="text-xs text-purple-600 font-medium hover:underline">Full Review &#8594;</Link>
                  <Link href={`/${category}/${comparison.toolB.slug}/pricing`} className="text-xs text-gray-500 font-medium hover:text-purple-600 hover:underline">Pricing &#8594;</Link>
                  <Link href={`/${category}/${comparison.toolB.slug}/alternatives`} className="text-xs text-gray-500 font-medium hover:text-purple-600 hover:underline">Alternatives &#8594;</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== AD: NATIVE BEFORE FAQ ========== */}
        <AdNative />

        {/* ========== FAQ ========== */}
        {compFaqs.length > 0 && (
          <section id="faq" className="mb-12 scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <FAQSection faqs={compFaqs} />
          </section>
        )}

        {/* ========== ALSO COMPARE — Related comparisons ========== */}
        {alsoCompare.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Compare</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {alsoCompare.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/${comp.categorySlug}/compare/${comp.slug}`}
                  className="group hover-lift flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-white dark:bg-gray-900"
                >
                  <ToolLogo logoUrl={comp.toolA.logoUrl} name={comp.toolA.name} size={32} />
                  <div className="vs-divider !w-6 !h-6 !text-[8px]">VS</div>
                  <ToolLogo logoUrl={comp.toolB.logoUrl} name={comp.toolB.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm block truncate group-hover:text-blue-600 transition-colors">
                      {comp.toolA.name} vs {comp.toolB.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span className="font-bold text-gray-600 dark:text-gray-300">{comp.toolA.ratings.overall.toFixed(1)}</span>
                      <span>vs</span>
                      <span className="font-bold text-gray-600 dark:text-gray-300">{comp.toolB.ratings.overall.toFixed(1)}</span>
                    </div>
                  </div>
                  <span className="text-blue-600 text-sm group-hover:translate-x-1 transition-transform">&#8594;</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== RELATED BLOG POSTS ========== */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover-lift bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all p-5"
                >
                  <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                    <span>📅</span>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ========== BEST-OF RANKINGS — Cross-link to best-of pages ========== */}
        {(() => {
          const subs = (SUBCATEGORIES[category] || []).slice(0, 4);
          if (subs.length === 0) return null;
          return (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2">Best {cat?.name || category} Rankings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Explore expert-curated rankings beyond just these two tools
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {subs.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={`/best/${sub.slug}`}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-lg flex-shrink-0">
                      🏆
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                        Best {sub.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{sub.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* ========== HELPFUL RESOURCES — Calculator + Glossary ========== */}
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
              <div className="flex flex-wrap gap-2">
                {calc && (
                  <Link href={`/calculators/${calc.slug}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg transition-colors border border-emerald-200/50 dark:border-emerald-800/50">
                    <span>&#129518;</span> {calc.title}
                  </Link>
                )}
                <Link href="/glossary" className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 px-3 py-2 rounded-lg transition-colors border border-cyan-200/50 dark:border-cyan-800/50">
                  <span>&#128214;</span> Tech Glossary
                </Link>
                <Link href={`/${category}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors border border-blue-200/50 dark:border-blue-800/50">
                  <span>&#128202;</span> All {cat?.name || category}
                </Link>
              </div>
            </section>
          );
        })()}

        {/* ========== BOTTOM LINE — Ultra-premium dark gradient ========== */}
        <section className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-lg shadow-lg shadow-yellow-500/20">💡</div>
                <h2 className="text-xl font-bold">The Bottom Line</h2>
              </div>
              <h3 className="text-lg font-semibold text-blue-300 mb-3">{bottomLine.headline}</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{bottomLine.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={comparison.toolA.websiteUrl || `/${category}/${comparison.toolA.slug}`}
                  target={comparison.toolA.websiteUrl ? '_blank' : undefined}
                  rel={comparison.toolA.websiteUrl ? 'noopener noreferrer nofollow sponsored' : undefined}
                  className="glow-pulse inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/25"
                >
                  Try {comparison.toolA.name} ↗
                </a>
                <a
                  href={comparison.toolB.websiteUrl || `/${category}/${comparison.toolB.slug}`}
                  target={comparison.toolB.websiteUrl ? '_blank' : undefined}
                  rel={comparison.toolB.websiteUrl ? 'noopener noreferrer nofollow sponsored' : undefined}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-600/25"
                >
                  Try {comparison.toolB.name} ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== AD: MULTIPLEX BEFORE RELATED ========== */}
        <AdMultiplex />

        {/* ========== RELATED LINKS ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Comparisons & Tools</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* Freshness Signal — Enhanced trust badge */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>Last updated: {new Date(comparison.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Prices verified</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Independent review</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButtons
              url={`${SITE_URL}/${category}/compare/${slug}`}
              title={`${comparison.toolA.name} vs ${comparison.toolB.name} — Honest Comparison`}
              description={`Compare ${comparison.toolA.name} and ${comparison.toolB.name} side by side.`}
            />
            <CopyLinkButton url={`${SITE_URL}/${category}/compare/${slug}`} />
          </div>
        </div>
      </article>
    </>
  );
}

// ============================================================
// HELPER — Generate buyer profile for comparison page
// ============================================================
import type { Tool } from '@/types';

function generateBuyerProfile(tool: Tool, competitor: Tool): string[] {
  const items: string[] = [];

  // Where this tool beats the competitor
  if (tool.ratings.easeOfUse > competitor.ratings.easeOfUse) {
    items.push(`Users who prioritize ease of use (${tool.ratings.easeOfUse.toFixed(1)} vs ${competitor.ratings.easeOfUse.toFixed(1)})`);
  }
  if (tool.ratings.features > competitor.ratings.features) {
    items.push(`Teams that need a more feature-rich platform (${tool.ratings.features.toFixed(1)} vs ${competitor.ratings.features.toFixed(1)})`);
  }
  if (tool.ratings.valueForMoney > competitor.ratings.valueForMoney) {
    items.push(`Budget-conscious buyers seeking better value (${tool.ratings.valueForMoney.toFixed(1)} vs ${competitor.ratings.valueForMoney.toFixed(1)})`);
  }
  if (tool.ratings.support > competitor.ratings.support) {
    items.push(`Users who need responsive customer support (${tool.ratings.support.toFixed(1)} vs ${competitor.ratings.support.toFixed(1)})`);
  }

  // Pricing advantages
  if (tool.pricing.hasFreeplan && !competitor.pricing.hasFreeplan) {
    items.push('Users who want a free plan to start with');
  }
  if (tool.pricing.startingPrice && competitor.pricing.startingPrice && tool.pricing.startingPrice < competitor.pricing.startingPrice) {
    items.push(`Teams with tighter budgets ($${tool.pricing.startingPrice}/mo vs $${competitor.pricing.startingPrice}/mo)`);
  }

  // Ensure at least 2 items
  if (items.length < 2) {
    items.push(`Users looking for a ${tool.ratings.overall >= 8 ? 'top-rated' : 'solid'} option in this category`);
  }

  return items.slice(0, 4);
}
