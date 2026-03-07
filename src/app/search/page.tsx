import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { SearchClient } from './search-client';
import { AdBanner, AdMultiplex } from '@/components/ads/AdSlot';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
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
        <div className="mt-8">
          <AdMultiplex />
        </div>
      </div>
    </>
  );
}
