import { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';
import { getCategoryStats } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Best Tools</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-700 rounded-2xl p-8 md:p-12 mb-12 text-white text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Best Tools &amp; Software ({year})
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Expert-curated rankings across {Object.keys(SUBCATEGORIES).length} categories
            and {Object.values(SUBCATEGORIES).flat().length} subcategories.
            Find the perfect tool for your needs.
          </p>
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
                      <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
                      <p className="text-sm text-gray-500">{stats.toolCount} tools reviewed</p>
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
                      className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-1">
                        Best {sub.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{sub.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* SEO Bottom Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            How Our Best-of Rankings Work
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
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
      </div>
    </>
  );
}
