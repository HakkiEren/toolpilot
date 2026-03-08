import { permanentRedirect } from 'next/navigation';
import { SUBCATEGORIES } from '@/lib/constants';

// Redirect old /[category]/best/[subcategory] URLs to new /best/[subcategory]
export const dynamicParams = true;

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  for (const [catSlug, subs] of Object.entries(SUBCATEGORIES)) {
    for (const sub of subs) {
      params.push({ category: catSlug, subcategory: sub.slug });
    }
  }
  return params;
}

export default async function OldBestOfPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { subcategory } = await params;
  permanentRedirect(`/best/${subcategory}`);
}
