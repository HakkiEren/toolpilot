import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SearchClient } from './search-client';
import { AdBanner, AdMultiplex } from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL, CATEGORY_LIST, SUBCATEGORIES } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Search & Compare Tools — Find the Perfect Software | ${SITE_NAME}`,
  description:
    'Search and filter 400+ tools instantly across AI, SaaS, E-commerce, Marketing, Hosting & Business. Compare features, pricing, and ratings.',
  alternates: { canonical: `${SITE_URL}/search` },
  openGraph: {
    title: `Search & Compare Tools — Find the Perfect Software | ${SITE_NAME}`,
    description:
      'Search and filter 400+ tools instantly across AI, SaaS, E-commerce, Marketing, Hosting & Business. Compare features, pricing, and ratings.',
    url: `${SITE_URL}/search`,
    siteName: SITE_NAME,
    type: 'website',
  },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, subcategory_slug, tagline, ratings_overall, logo_url, pricing')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Search Tools', url: '/search' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SearchClient tools={tools || []} />
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdBanner />

        {/* ========== STATIC BROWSE LINKS — Server-rendered for crawl equity ========== */}
        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_LIST.map((cat) => {
              const subs = SUBCATEGORIES[cat.slug] || [];
              return (
                <div key={cat.slug} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                  <Link
                    href={`/${cat.slug}`}
                    className="text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3 line-clamp-2">{cat.description}</p>
                  {subs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {subs.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/best/${sub.slug}`}
                          className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200/50 dark:border-gray-700/50"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Link href={`/${cat.slug}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      All {cat.name} →
                    </Link>
                    <Link href={`/${cat.slug}/compare`} className="text-xs font-semibold text-purple-600 hover:underline">
                      Comparisons →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Links — Additional crawl paths */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/best" className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-200/50 dark:border-amber-800/50">
            🏆 Best-of Rankings
          </Link>
          <Link href="/blog" className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-800/50">
            📝 Blog & Guides
          </Link>
          <Link href="/glossary" className="px-3.5 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors border border-cyan-200/50 dark:border-cyan-800/50">
            📖 Tech Glossary
          </Link>
          <Link href="/calculators" className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/50 dark:border-emerald-800/50">
            🧮 Calculators
          </Link>
          <Link href="/changelog" className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200/50 dark:border-gray-700/50">
            📋 Changelog
          </Link>
        </div>

        <div className="mt-4">
          <AdMultiplex />
        </div>
      </div>
    </>
  );
}
