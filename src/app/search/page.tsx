import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { SearchClient } from './search-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Search & Compare Tools — Find the Perfect Software | ToolPilot',
  description:
    'Search and filter 400+ tools instantly across AI, SaaS, E-commerce, Marketing, Hosting & Business. Compare features, pricing, and ratings.',
};

export default async function SearchPage() {
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, subcategory_slug, tagline, ratings_overall, logo_url, pricing')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false });

  return <SearchClient tools={tools || []} />;
}
