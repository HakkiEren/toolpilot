import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { SearchClient } from './search-client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Search AI Tools — Find the Perfect Tool',
  description:
    'Search and filter 25+ AI tools instantly. Compare features, pricing, and ratings to find the best AI tool for your specific needs.',
};

export default async function SearchPage() {
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, subcategory_slug, tagline, ratings_overall, pricing')
    .eq('status', 'published')
    .order('ratings_overall', { ascending: false });

  return <SearchClient tools={tools || []} />;
}
