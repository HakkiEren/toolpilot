import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsBySubcategory } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, AI_SUBCATEGORIES, SITE_URL, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// Best-of Subcategory Page — "Best {Subcategory} in {Year}"
// Route: /[category]/best/[subcategory]
// Targets high-intent "best X tools" keywords
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return AI_SUBCATEGORIES.map((sub) => ({
    category: 'ai-tools',
    subcategory: sub.slug,
  }));
}

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

function getSubcategory(categorySlug: string, subcategorySlug: string) {
  if (categorySlug === 'ai-tools') {
    return AI_SUBCATEGORIES.find((s) => s.slug === subcategorySlug) || null;
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const cat = CATEGORIES[category];
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) return {};

  const year = new Date().getFullYear();
  const title = `Best ${sub.name} in ${year} — Compare & Choose | ToolPilot`;
  const description = `Compare the best ${sub.name.toLowerCase()} in ${year}. Unbiased reviews, real pricing, feature comparisons to help you pick the right tool.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${cat.slug}/best/${sub.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${cat.slug}/best/${sub.slug}`,
      type: 'website',
    },
  };
}

export default async function BestSubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  const cat = CATEGORIES[category];
  const sub = getSubcategory(category, subcategory);
  if (!cat || !sub) notFound();

  const tools = await getToolsBySubcategory(category, subcategory, 50);
  const year = new Date().getFullYear();

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
    { name: `Best ${sub.name}`, url: '' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
    { name: `Best ${sub.name}`, url: `/${cat.slug}/best/${sub.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mt-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best {sub.name} in {year}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {sub.description} Compare features, pricing, and ratings to find the
            perfect {sub.name.toLowerCase()} for your needs.
          </p>
          <div className="flex gap-6 mt-4 text-sm text-gray-500">
            <span>
              <strong>{tools.length}</strong> tools compared
            </span>
            <span>
              Updated{' '}
              <strong>
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
            </span>
          </div>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                >
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow">
                      #{index + 1}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    {tool.logoUrl ? (
                      <img
                        src={tool.logoUrl}
                        alt={`${tool.name} logo`}
                        className="w-10 h-10 rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-400">
                        {tool.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">
                          {tool.ratings.overall.toFixed(1)}
                        </span>
                        <span className="text-gray-400">
                          ({tool.ratings.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {tool.tagline}
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Pricing Badge */}
                    <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {tool.pricing.hasFreeplan
                        ? '✅ Free plan'
                        : tool.pricing.startingPrice
                          ? `From $${tool.pricing.startingPrice}/mo`
                          : 'Contact for pricing'}
                    </span>

                    <Link
                      href={`/${category}/${tool.slug}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Read Review →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">
              No {sub.name.toLowerCase()} listed yet
            </p>
            <p className="text-sm">
              We are currently reviewing tools in this subcategory. Check back
              soon!
            </p>
            <Link
              href={`/${category}`}
              className="mt-6 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              ← Back to {cat.name}
            </Link>
          </div>
        )}

        {/* Back to Category Link */}
        {tools.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={`/${category}`}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              ← Browse all {cat.name}
            </Link>
          </div>
        )}

        {/* Last Updated Timestamp */}
        <div className="mt-8 text-xs text-gray-400">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
    </>
  );
}
