import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';
import { getCategoryStats } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Best Tools by Category (${new Date().getFullYear()}) — Expert Rankings | ${SITE_NAME}`,
  description: `Browse our curated best-of lists across AI, SaaS, E-commerce, Marketing, Hosting & Business tools. Expert ratings, real pricing, and honest comparisons for ${new Date().getFullYear()}.`,
  alternates: { canonical: `${SITE_URL}/best` },
  openGraph: {
    title: `Best Tools by Category (${new Date().getFullYear()})`,
    description: 'Browse curated best-of lists across every software category.',
    url: `${SITE_URL}/best`,
    siteName: SITE_NAME,
    type: 'website',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  'ai-tools': '&#129302;',
  'saas': '&#9729;&#65039;',
  'ecommerce': '&#128722;',
  'marketing': '&#128227;',
  'hosting': '&#128421;&#65039;',
  'business': '&#128188;',
};

export default async function BestOfIndexPage() {
  const year = new Date().getFullYear();

  // Fetch stats for all categories in parallel
  const statsEntries = await Promise.all(
    Object.keys(SUBCATEGORIES).map(async (catSlug) => {
      const stats = await getCategoryStats(catSlug);
      return [catSlug, stats] as const;
    })
  );
  const statsMap = Object.fromEntries(statsEntries);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Best Tools', url: '/best' },
  ];

  // CollectionPage schema for best-of index
  const allSubcategories = Object.entries(SUBCATEGORIES).flatMap(([, subs]) => subs);
  const bestOfCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best Tools by Category (${year})`,
    description: `Browse curated best-of lists across AI, SaaS, E-commerce, Marketing, Hosting & Business tools for ${year}.`,
    url: `${SITE_URL}/best`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allSubcategories.length,
      itemListElement: allSubcategories.map((sub, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/best/${sub.slug}`,
        name: `Best ${sub.name}`,
      })),
    },
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bestOfCollectionSchema),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Best Tools</span>
        </nav>

        {/* Hero — Premium glassmorphism */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-700 rounded-3xl p-8 md:p-12 mb-12 text-white text-center shadow-xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Updated for {year}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Best Tools &amp; Software ({year})
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Expert-curated rankings across {Object.keys(SUBCATEGORIES).length} categories
              and {Object.values(SUBCATEGORIES).flat().length} subcategories.
              Find the perfect tool for your needs.
            </p>
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-12">
          {Object.entries(SUBCATEGORIES).map(([catSlug, subs]) => {
            const cat = CATEGORIES[catSlug];
            if (!cat) return null;
            const stats = statsMap[catSlug] || { toolCount: 0, comparisonCount: 0 };

            return (
              <section key={catSlug}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-2xl"
                      dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[catSlug] || '&#128295;' }}
                    />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{cat.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stats.toolCount} tools reviewed</p>
                    </div>
                  </div>
                  <Link
                    href={`/${catSlug}`}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    View all &#8594;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subs.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/best/${sub.slug}`}
                      className="group hover-lift bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1">
                        Best {sub.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{sub.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Ad: After categories */}
        <AdBanner />

        {/* SEO Bottom Section */}
        <div className="mt-10 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            How Our Best-of Rankings Work
          </h2>
          <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              Every tool in our rankings goes through a thorough evaluation across four key dimensions:
              ease of use, feature set, value for money, and customer support. We assign each tool
              a score from 0&ndash;10 and rank them within their respective categories.
            </p>
            <p>
              Our rankings are updated regularly to account for new features, pricing changes, and
              emerging competitors. Unlike many review sites, our rankings are not influenced by
              advertising or affiliate relationships &mdash; we prioritize objectivity and accuracy.
            </p>
          </div>
        </div>

        {/* Ad: After SEO text */}
        <AdInArticle />
      </div>
    </>
  );
}
