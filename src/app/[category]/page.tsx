import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsByCategory, getCategoryStats } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, CATEGORY_LIST, SITE_URL, SEO, AI_SUBCATEGORIES } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// Category Hub Page — Critical for topical authority
// Each category page links to ALL its spoke pages (tools, comparisons)
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

  const tools = await getToolsByCategory(category, 50);
  const stats = await getCategoryStats(category);

  // Determine subcategories based on category
  const subcategories = category === 'ai-tools' ? AI_SUBCATEGORIES : [];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat.name, url: `/${cat.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat.name, url: '' },
        ]} />

        {/* Category Header */}
        <div className="mt-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Best {cat.name} Compared ({new Date().getFullYear()})
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {cat.description}
          </p>
          <div className="flex gap-6 mt-4 text-sm text-gray-500">
            <span><strong>{stats.toolCount}</strong> tools reviewed</span>
            <span><strong>{stats.comparisonCount}</strong> comparisons</span>
            <span>Updated <strong>weekly</strong></span>
          </div>
        </div>

        {/* Subcategories — Hub links (critical for internal linking) */}
        {subcategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Browse by Type</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/${category}/best/${sub.slug}`}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <h3 className="font-medium text-sm">{sub.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sub.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tools Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-6">
            Top {cat.name} ({tools.length} reviewed)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${category}/${tool.slug}`}
                className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {tool.logoUrl ? (
                    <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-10 h-10 rounded-lg" loading="lazy" />
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
                      <span className="font-medium">{tool.ratings.overall.toFixed(1)}</span>
                      <span className="text-gray-400">({tool.ratings.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{tool.tagline}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {tool.pricing.hasFreeplan ? '✅ Free plan' : `From $${tool.pricing.startingPrice}/mo`}
                  </span>
                  <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
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
      </div>
    </>
  );
}
