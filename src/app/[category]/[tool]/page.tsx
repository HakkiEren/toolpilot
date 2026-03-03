import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks, getComparisonsByTool } from '@/lib/data';
import { generateToolSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, LIMITS, SEO, SITE_URL } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';

// ============================================================
// TOOL PROFILE PAGE — Individual tool review
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.map(({ categorySlug, toolSlug }) => ({
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

  return {
    title: tool.metaTitle || `${tool.name} Review — Features, Pricing & Alternatives${SEO.titleSuffix}`,
    description: tool.metaDescription || `${tool.name}: ${tool.tagline}. Read our honest review with features, pricing plans, pros & cons.`,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}` },
    openGraph: {
      title: `${tool.name} Review`,
      description: tool.tagline,
      url: `${SITE_URL}/${category}/${toolSlug}`,
      type: 'article',
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const relatedLinks = await getRelatedLinks(tool);
  const comparisons = await getComparisonsByTool(tool.id);

  const toolSchema = generateToolSchema(tool, cat?.name || category);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: tool.name, url: `/${category}/${toolSlug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: '' },
        ]} />

        {/* Tool Header */}
        <div className="mt-6 mb-10 flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0">
            {tool.logoUrl ? (
              <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-20 h-20 rounded-2xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-3xl font-bold text-blue-600">
                {tool.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {tool.name} Review ({new Date().getFullYear()})
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{tool.tagline}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-bold text-lg">{tool.ratings.overall.toFixed(1)}</span>
                <span className="text-gray-400">/10</span>
              </div>
              {tool.pricing.hasFreeplan && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  Free Plan Available
                </span>
              )}
              {tool.pricing.startingPrice && (
                <span className="text-gray-500">
                  Starting from <strong>${tool.pricing.startingPrice}/mo</strong>
                </span>
              )}
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-600 hover:underline">
                Visit Website →
              </a>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Rating</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Overall', score: tool.ratings.overall },
              { label: 'Ease of Use', score: tool.ratings.easeOfUse },
              { label: 'Features', score: tool.ratings.features },
              { label: 'Value', score: tool.ratings.valueForMoney },
              { label: 'Support', score: tool.ratings.support },
            ].map(({ label, score }) => (
              <div key={label} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="text-2xl font-bold">{score.toFixed(1)}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                  <div
                    className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What is {tool.name}?</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
          </div>
        </section>

        {/* Pros & Cons — Unique per tool */}
        {tool.prosConsContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Pros & Cons</h2>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: tool.prosConsContent }} />
            </div>
          </section>
        )}

        {/* Use Cases — Unique per tool */}
        {tool.useCasesContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Best Use Cases</h2>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: tool.useCasesContent }} />
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{tool.name} Pricing</h2>
          {tool.pricing.plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {tool.pricing.plans.map((plan, idx) => (
                <div key={idx} className={`p-6 rounded-xl border ${plan.isPopular ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  {plan.isPopular && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Most Popular</span>
                  )}
                  <h3 className="text-lg font-semibold mt-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mt-2">
                    {plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                    {plan.price !== null && plan.price > 0 && <span className="text-sm font-normal text-gray-400">/mo</span>}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Pricing information coming soon.</p>
          )}
          <div className="mt-4">
            <a href={`/${category}/${toolSlug}/pricing`} className="text-blue-600 hover:underline text-sm font-medium">
              See detailed pricing breakdown →
            </a>
          </div>
        </section>

        {/* Comparisons featuring this tool */}
        {comparisons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{tool.name} vs Competitors</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {comparisons.map((comp) => {
                const otherTool = comp.toolA.id === tool.id ? comp.toolB : comp.toolA;
                return (
                  <a
                    key={comp.id}
                    href={`/${category}/compare/${comp.slug}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                  >
                    <span className="font-medium">{tool.name}</span>
                    <span className="text-gray-400 text-sm">vs</span>
                    <span className="font-medium">{otherTool.name}</span>
                    <span className="ml-auto text-blue-600 text-sm">Compare →</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Best For — Unique per tool */}
        {tool.bestForContent && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Who is {tool.name} Best For?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: tool.bestForContent }} />
            </div>
          </section>
        )}

        {/* Internal Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Tools & Comparisons</h2>
          <RelatedLinks links={relatedLinks} />
        </section>

        {/* Freshness Signal */}
        <div className="text-sm text-gray-400 mt-8">
          Last updated: {new Date(tool.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </article>
    </>
  );
}
