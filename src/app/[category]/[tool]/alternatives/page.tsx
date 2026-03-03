import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getToolsBySubcategory, getAllToolSlugs } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { CATEGORIES, LIMITS, SITE_URL, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// ALTERNATIVES PAGE — "{Tool} Alternatives" keyword targeting
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.slice(0, 200).map(({ categorySlug, toolSlug }) => ({
    category: categorySlug,
    tool: toolSlug,
  }));
}

interface PageProps {
  params: Promise<{ category: string; tool: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) return {};

  const title = `Best ${tool.name} Alternatives in ${new Date().getFullYear()}${SEO.titleSuffix}`;
  const description = `Looking for ${tool.name} alternatives? Compare the top competitors with features, pricing, and honest reviews.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}/alternatives` },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const alternatives = await getToolsBySubcategory(category, tool.subcategorySlug, 20);
  const filtered = alternatives.filter((t) => t.id !== tool.id);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: tool.name, url: `/${category}/${toolSlug}` },
    { name: 'Alternatives', url: `/${category}/${toolSlug}/alternatives` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: `/${category}/${toolSlug}` },
          { name: 'Alternatives', url: '' },
        ]} />

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
          Best {tool.name} Alternatives ({new Date().getFullYear()})
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Not sure if {tool.name} is right for you? Here are the top alternatives with similar features,
          different pricing, or better fit for specific use cases.
        </p>

        {/* Current tool quick summary */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-2">About {tool.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{tool.tagline}</p>
          <div className="flex gap-4 text-sm">
            <span>★ {tool.ratings.overall.toFixed(1)}/10</span>
            <span>{tool.pricing.hasFreeplan ? '✅ Free plan' : `From $${tool.pricing.startingPrice}/mo`}</span>
            <Link href={`/${category}/${toolSlug}`} className="text-blue-600 hover:underline">Full review →</Link>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="space-y-6">
          {filtered.map((alt, idx) => (
            <div key={alt.id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 transition-colors">
              <div className="flex-shrink-0 flex items-start gap-4">
                <span className="text-2xl font-bold text-gray-300 w-8">#{idx + 1}</span>
                {alt.logoUrl ? (
                  <img src={alt.logoUrl} alt={`${alt.name} logo`} className="w-12 h-12 rounded-xl" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-400">{alt.name[0]}</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{alt.name}</h3>
                  <span className="text-sm text-yellow-500">★ {alt.ratings.overall.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{alt.tagline}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="text-gray-500">
                    {alt.pricing.hasFreeplan ? '✅ Free plan' : `From $${alt.pricing.startingPrice}/mo`}
                  </span>
                  <Link href={`/${category}/${alt.slug}`} className="text-blue-600 hover:underline">Review →</Link>
                  <Link href={`/${category}/compare/${tool.slug}-vs-${alt.slug}`} className="text-blue-600 hover:underline">
                    {tool.name} vs {alt.name} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No alternatives listed yet. Check back soon!</p>
        )}

        <div className="text-sm text-gray-400 mt-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </article>
    </>
  );
}
