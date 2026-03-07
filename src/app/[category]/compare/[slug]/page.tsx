import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparison, getAllComparisonSlugs, getRelatedLinks, getRelatedComparisons, getRelatedBlogPosts } from '@/lib/data';
import { generateComparisonSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, LIMITS, SEO, SITE_URL } from '@/lib/constants';
import { generateComparisonBottomLine, generateKeyDifferences } from '@/lib/generated-faqs';
// Components
import { ScoreCompare } from '@/components/comparison/ScoreCompare';
import { FeatureMatrix } from '@/components/comparison/FeatureMatrix';
import { PriceCompare } from '@/components/comparison/PriceCompare';
import { VerdictSection } from '@/components/comparison/VerdictSection';
import { FAQSection } from '@/components/common/FAQSection';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdInArticle, AdMultiplex, AdNative } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import { ShareButtons } from '@/components/common/ShareButtons';

// ============================================================
// COMPARISON PAGE — ENHANCED with winner banner, nav, tool cards
// ============================================================

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
    openGraph: { title, description, url: `${SITE_URL}/${category}/compare/${slug}`, type: 'article', publishedTime: comparison.lastUpdated, modifiedTime: comparison.lastUpdated },
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

  // Schema markup
  const articleSchema = generateComparisonSchema(comparison);
  const faqSchema = generateFAQSchema(comparison.faqs);
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
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'verdict', label: 'Verdict' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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

        {/* ========== HERO — Dramatic battle card with gradient ========== */}
        <div className="mt-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
            {comparison.toolA.name} vs {comparison.toolB.name}: Honest Comparison ({year})
          </h1>

          {/* Battle Arena — Side by side with VS divider */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden mb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIi8+PC9zdmc+')] pointer-events-none" />

            <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-0 p-6 md:p-8">
              {/* Tool A */}
              <div className="text-center md:text-left card-animate" style={{ animationDelay: '0ms' }}>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <div className="relative">
                    {winner === 'a' && <div className="absolute -top-2 -right-2 text-lg animate-bounce">👑</div>}
                    <ToolLogo logoUrl={comparison.toolA.logoUrl} name={comparison.toolA.name} size={56} className="shadow-lg" />
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
                    <ToolLogo logoUrl={comparison.toolB.logoUrl} name={comparison.toolB.name} size={56} className="shadow-lg" />
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

          {/* Intro Content */}
          <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {comparison.introContent}
          </div>
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
          <div className="text-gray-700 dark:text-gray-200">{comparison.verdictContent}</div>
        </div>

        {/* ========== SCORES ========== */}
        <section id="scores" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Overall Score Comparison</h2>
          <ScoreCompare toolA={comparison.toolA} toolB={comparison.toolB} />
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
              <div className="text-gray-600 dark:text-gray-300">{comparison.scenarioContent}</div>
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
              <div className="text-gray-600 dark:text-gray-300">{comparison.migrationContent}</div>
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

          {/* CTA Box */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center">
            <h3 className="font-bold mb-2">Still not sure?</h3>
            <p className="text-sm text-gray-500 mb-4">Explore alternatives and pricing for both tools.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${category}/${comparison.toolA.slug}/alternatives`}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {comparison.toolA.name} Alternatives
              </Link>
              <Link
                href={`/${category}/${comparison.toolB.slug}/alternatives`}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                {comparison.toolB.name} Alternatives
              </Link>
              <Link
                href={`/${category}/${comparison.toolA.slug}/pricing`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {comparison.toolA.name} Pricing
              </Link>
              <Link
                href={`/${category}/${comparison.toolB.slug}/pricing`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {comparison.toolB.name} Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* ========== AD: NATIVE BEFORE FAQ ========== */}
        <AdNative />

        {/* ========== FAQ ========== */}
        {comparison.faqs && comparison.faqs.length > 0 && (
          <section id="faq" className="mb-12 scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <FAQSection faqs={comparison.faqs} />
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
          <ShareButtons
            url={`${SITE_URL}/${category}/compare/${slug}`}
            title={`${comparison.toolA.name} vs ${comparison.toolB.name} — Honest Comparison`}
            description={`Compare ${comparison.toolA.name} and ${comparison.toolB.name} side by side.`}
          />
        </div>
      </article>
    </>
  );
}
