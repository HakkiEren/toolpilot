import type { Metadata } from 'next';
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
// ISR Configuration
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true; // Allow on-demand rendering

export async function generateStaticParams() {
  const slugs = await getAllComparisonSlugs();
  return slugs.map(({ categorySlug, comparisonSlug }) => ({
    category: categorySlug,
    slug: comparisonSlug,
  }));
}

// ============================================================
// Dynamic Metadata (unique per comparison)
// ============================================================

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
    alternates: {
      canonical: `${SITE_URL}/${category}/compare/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${category}/compare/${slug}`,
      type: 'article',
      modifiedTime: comparison.lastUpdated,
    },
  };
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default async function ComparisonPage({ params }: PageProps) {
  const { category, slug } = await params;
  const comparison = await getComparison(category, slug);

  if (!comparison) notFound();

  const cat = CATEGORIES[category];
  const relatedLinks = await getRelatedLinks(comparison.toolA);

  // Schema markup
  const articleSchema = generateComparisonSchema(comparison);
  const faqSchema = generateFAQSchema(comparison.faqs);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: `${comparison.toolA.name} vs ${comparison.toolB.name}`, url: `/${category}/compare/${slug}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: cat?.name || category, url: `/${category}` },
            { name: `${comparison.toolA.name} vs ${comparison.toolB.name}`, url: '' },
          ]}
        />

        {/* H1 — Unique per comparison */}
        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
          {comparison.toolA.name} vs {comparison.toolB.name}: Honest Comparison ({new Date().getFullYear()})
        </h1>

        {/* Unique Intro Paragraph — AI-generated, pre-stored */}
        <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {comparison.introContent}
        </div>

        {/* Quick Verdict Box */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3">Quick Verdict</h2>
          <div className="text-gray-700 dark:text-gray-200">
            {comparison.verdictContent}
          </div>
        </div>

        {/* Score Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Overall Score Comparison</h2>
          <ScoreCompare toolA={comparison.toolA} toolB={comparison.toolB} />
        </section>

        {/* Feature Matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Feature-by-Feature Comparison</h2>
          <FeatureMatrix
            features={comparison.featureMatrix}
            toolAName={comparison.toolA.name}
            toolBName={comparison.toolB.name}
          />
        </section>

        {/* Pricing Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pricing Comparison</h2>
          <PriceCompare toolA={comparison.toolA} toolB={comparison.toolB} />
        </section>

        {/* Use Case Scenarios — Unique conditional content */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Which Should You Choose?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Choose {comparison.toolA.name} if...
              </h3>
              <div className="text-gray-600 dark:text-gray-300">
                {comparison.scenarioContent}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Choose {comparison.toolB.name} if...
              </h3>
              <div className="text-gray-600 dark:text-gray-300">
                {comparison.migrationContent}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section — Unique questions per comparison */}
        {comparison.faqs && comparison.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <FAQSection faqs={comparison.faqs} />
          </section>
        )}

        {/* Internal Links — Critical for pSEO */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Comparisons & Tools</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* Last Updated — Freshness signal */}
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
