import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparison, getAllComparisonSlugs, getRelatedLinks } from '@/lib/data';
import { generateComparisonSchema, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, LIMITS, SEO, SITE_URL } from '@/lib/constants';
// Components
import { ScoreCompare } from '@/components/comparison/ScoreCompare';
import { FeatureMatrix } from '@/components/comparison/FeatureMatrix';
import { PriceCompare } from '@/components/comparison/PriceCompare';
import { VerdictSection } from '@/components/comparison/VerdictSection';
import { FAQSection } from '@/components/common/FAQSection';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

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
    openGraph: { title, description, url: `${SITE_URL}/${category}/compare/${slug}`, type: 'article', modifiedTime: comparison.lastUpdated },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { category, slug } = await params;
  const comparison = await getComparison(category, slug);
  if (!comparison) notFound();

  const cat = CATEGORIES[category];
  const relatedLinks = await getRelatedLinks(comparison.toolA);
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

        {/* ========== HERO ========== */}
        <div className="mt-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {comparison.toolA.name} vs {comparison.toolB.name}: Honest Comparison ({year})
          </h1>

          {/* Tool Cards Side by Side */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800/30 p-5">
              <div className="flex items-center gap-3 mb-3">
                {comparison.toolA.logoUrl ? (
                  <img src={comparison.toolA.logoUrl} alt={comparison.toolA.name} className="w-12 h-12 rounded-xl shadow-sm" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">{comparison.toolA.name[0]}</div>
                )}
                <div>
                  <h2 className="font-bold text-lg">{comparison.toolA.name}</h2>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">&#9733;</span>
                    <span className="font-bold">{aScore.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                    {winner === 'a' && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">WINNER</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{comparison.toolA.tagline}</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                {comparison.toolA.pricing.hasFreeplan && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">Free Plan</span>
                )}
                {comparison.toolA.pricing.startingPrice !== null && (
                  <span className="text-gray-400">From ${comparison.toolA.pricing.startingPrice}/mo</span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-purple-200 dark:border-purple-800/30 p-5">
              <div className="flex items-center gap-3 mb-3">
                {comparison.toolB.logoUrl ? (
                  <img src={comparison.toolB.logoUrl} alt={comparison.toolB.name} className="w-12 h-12 rounded-xl shadow-sm" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">{comparison.toolB.name[0]}</div>
                )}
                <div>
                  <h2 className="font-bold text-lg">{comparison.toolB.name}</h2>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">&#9733;</span>
                    <span className="font-bold">{bScore.toFixed(1)}</span>
                    <span className="text-gray-400">/10</span>
                    {winner === 'b' && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">WINNER</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{comparison.toolB.tagline}</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                {comparison.toolB.pricing.hasFreeplan && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">Free Plan</span>
                )}
                {comparison.toolB.pricing.startingPrice !== null && (
                  <span className="text-gray-400">From ${comparison.toolB.pricing.startingPrice}/mo</span>
                )}
              </div>
            </div>
          </div>

          {/* Winner Banner */}
          {winnerName && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-5 border border-green-200 dark:border-green-800/30 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">&#127942;</span>
                <div>
                  <div className="font-bold text-green-800 dark:text-green-300 text-lg">
                    {winnerName} wins with {(winner === 'a' ? aScore : bScore).toFixed(1)}/10
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Leading by {scoreDiff} points in overall score
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Intro Content */}
          <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {comparison.introContent}
          </div>
        </div>

        {/* ========== SECTION NAVIGATION ========== */}
        <nav className="sticky top-16 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md -mx-4 px-4 py-3 mb-8 border-b border-gray-200 dark:border-gray-800">
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

        {/* ========== VERDICT / USE CASES ========== */}
        <section id="verdict" className="mb-12 scroll-mt-32">
          <h2 className="text-2xl font-bold mb-6">Which Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-4">
                {comparison.toolA.logoUrl ? (
                  <img src={comparison.toolA.logoUrl} alt={comparison.toolA.name} className="w-8 h-8 rounded-lg" loading="lazy" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600">{comparison.toolA.name[0]}</div>
                )}
                <h3 className="text-lg font-semibold">
                  Choose {comparison.toolA.name} if...
                </h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300">{comparison.scenarioContent}</div>
              <Link
                href={`/${category}/${comparison.toolA.slug}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-4 hover:underline"
              >
                Read {comparison.toolA.name} Review &#8594;
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-purple-200 dark:border-purple-800/30">
              <div className="flex items-center gap-3 mb-4">
                {comparison.toolB.logoUrl ? (
                  <img src={comparison.toolB.logoUrl} alt={comparison.toolB.name} className="w-8 h-8 rounded-lg" loading="lazy" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600">{comparison.toolB.name[0]}</div>
                )}
                <h3 className="text-lg font-semibold">
                  Choose {comparison.toolB.name} if...
                </h3>
              </div>
              <div className="text-gray-600 dark:text-gray-300">{comparison.migrationContent}</div>
              <Link
                href={`/${category}/${comparison.toolB.slug}`}
                className="inline-flex items-center gap-1 text-sm text-purple-600 font-medium mt-4 hover:underline"
              >
                Read {comparison.toolB.name} Review &#8594;
              </Link>
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

        {/* ========== FAQ ========== */}
        {comparison.faqs && comparison.faqs.length > 0 && (
          <section id="faq" className="mb-12 scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <FAQSection faqs={comparison.faqs} />
          </section>
        )}

        {/* ========== RELATED LINKS ========== */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Comparisons & Tools</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* Last Updated */}
        <div className="text-sm text-gray-400 mt-8">
          Last updated: {new Date(comparison.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </article>
    </>
  );
}
