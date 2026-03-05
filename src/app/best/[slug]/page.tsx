import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsBySubcategory, getToolsByCategory } from '@/lib/data';
import { CATEGORIES, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';
import { generateBreadcrumbSchema, generateCollectionSchema, generateBestOfItemListSchema, generateFAQSchema } from '@/lib/schema';
import { ToolLogo } from '@/components/common/ToolLogo';
import type { Tool } from '@/types';

export const revalidate = 3600;
export const dynamicParams = true;

// Build flat map: subcategory slug → { subcategory info, parent category }
function getSubcategoryMap() {
  const map: Record<string, { name: string; description: string; slug: string; categorySlug: string; categoryName: string }> = {};
  for (const [catSlug, subs] of Object.entries(SUBCATEGORIES)) {
    const cat = CATEGORIES[catSlug];
    if (!cat) continue;
    for (const sub of subs) {
      map[sub.slug] = {
        ...sub,
        categorySlug: catSlug,
        categoryName: cat.name,
      };
    }
  }
  return map;
}

const subcategoryMap = getSubcategoryMap();

export async function generateStaticParams() {
  return Object.keys(subcategoryMap).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const sub = subcategoryMap[slug];
  if (!sub) return {};

  const year = new Date().getFullYear();
  const title = `Best ${sub.name} in ${year} — Top Picks Compared`;
  const description = `Compare the best ${sub.name.toLowerCase()} side by side. Expert ratings, real pricing, pros & cons, and which ${sub.name.toLowerCase().replace(/tools?$/i, 'tool')} is right for you in ${year}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/best/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/best/${slug}`,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

function getRatingLabel(score: number) {
  if (score >= 9) return { text: 'Excellent', color: 'text-green-600 bg-green-50' };
  if (score >= 8) return { text: 'Very Good', color: 'text-blue-600 bg-blue-50' };
  if (score >= 7) return { text: 'Good', color: 'text-yellow-600 bg-yellow-50' };
  return { text: 'Average', color: 'text-gray-600 bg-gray-50' };
}

function generateBestOfFAQs(tools: Tool[], subcategoryName: string): { question: string; answer: string }[] {
  const year = new Date().getFullYear();
  const topTool = tools[0];
  const faqs = [];

  if (topTool) {
    faqs.push({
      question: `What is the best ${subcategoryName.toLowerCase().replace(/tools?$/i, 'tool')} in ${year}?`,
      answer: `Based on our analysis, ${topTool.name} is the top-rated ${subcategoryName.toLowerCase().replace(/tools?$/i, 'tool')} in ${year} with a score of ${topTool.ratings.overall}/10. It stands out for its ${topTool.ratings.easeOfUse >= 8 ? 'ease of use' : 'feature set'} and ${topTool.pricing.hasFreeplan ? 'offers a free plan' : `starts at $${topTool.pricing.startingPrice}/month`}.`,
    });
  }

  const freeTools = tools.filter(t => t.pricing.hasFreeplan);
  if (freeTools.length > 0) {
    faqs.push({
      question: `Are there free ${subcategoryName.toLowerCase()}?`,
      answer: `Yes, ${freeTools.length} of the ${tools.length} ${subcategoryName.toLowerCase()} we reviewed offer free plans. The top free options include ${freeTools.slice(0, 3).map(t => t.name).join(', ')}.`,
    });
  }

  if (tools.length >= 2) {
    faqs.push({
      question: `How do we rank ${subcategoryName.toLowerCase()}?`,
      answer: `We evaluate ${subcategoryName.toLowerCase()} across four dimensions: ease of use, feature set, value for money, and customer support. Each tool receives a score from 0-10 based on these criteria, combined into an overall rating.`,
    });
  }

  const bestValue = tools.reduce((best, t) => (!best || t.ratings.valueForMoney > best.ratings.valueForMoney) ? t : best, null as Tool | null);
  if (bestValue && bestValue !== topTool) {
    faqs.push({
      question: `Which ${subcategoryName.toLowerCase().replace(/tools?$/i, 'tool')} offers the best value?`,
      answer: `${bestValue.name} offers the best value for money with a value score of ${bestValue.ratings.valueForMoney}/10${bestValue.pricing.hasFreeplan ? ' and a free plan available' : ''}.`,
    });
  }

  return faqs;
}

export default async function BestOfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sub = subcategoryMap[slug];
  if (!sub) notFound();

  const year = new Date().getFullYear();
  const tools = await getToolsBySubcategory(sub.categorySlug, slug, 30);

  // Also try getting tools from category if subcategory returns too few
  let allTools = tools;
  if (tools.length < 3) {
    const categoryTools = await getToolsByCategory(sub.categorySlug, 20);
    // Filter by checking if subcategory_slug starts with the slug pattern
    allTools = categoryTools.length > tools.length ? categoryTools : tools;
  }

  const faqs = generateBestOfFAQs(allTools, sub.name);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: sub.categoryName, url: `/${sub.categorySlug}` },
    { name: `Best ${sub.name}`, url: `/best/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      {allTools.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateBestOfItemListSchema(
                  `Best ${sub.name} in ${year}`,
                  `/best/${slug}`,
                  allTools.map(t => ({ ...t, categorySlug: t.categorySlug || sub.categorySlug }))
                )
              ),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                generateCollectionSchema(sub.name, `best/${slug}`, sub.description, allTools)
              ),
            }}
          />
        </>
      )}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(faqs)),
          }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link href={`/${sub.categorySlug}`} className="hover:text-gray-700">{sub.categoryName}</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Best {sub.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-8 md:p-12 mb-10 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {year} RANKINGS
            </span>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {allTools.length} TOOLS REVIEWED
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Best {sub.name} in {year}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
            {sub.description} We&apos;ve tested and compared {allTools.length} options to help you find the perfect fit.
          </p>
          {allTools.length > 0 && (
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-yellow-300 text-lg">&#9733;</span>
                <span>Top Pick: <strong>{allTools[0].name}</strong> ({allTools[0].ratings.overall}/10)</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Summary Table */}
        {allTools.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Quick Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Tool</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Rating</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Free Plan</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">From</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600">Best For</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {allTools.slice(0, 10).map((tool, i) => {
                    const label = getRatingLabel(tool.ratings.overall);
                    return (
                      <tr key={tool.id} className={`border-b last:border-0 ${i === 0 ? 'bg-yellow-50/40' : 'hover:bg-gray-50'}`}>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
                            <div>
                              <div className="font-semibold text-gray-900">{tool.name}</div>
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{tool.tagline}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${label.color}`}>
                            {tool.ratings.overall}/10
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {tool.pricing.hasFreeplan ? (
                            <span className="text-green-600 text-xs font-semibold">&#10003; Yes</span>
                          ) : (
                            <span className="text-gray-400 text-xs">No</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-sm">
                          {tool.pricing.startingPrice
                            ? <span className="font-medium">${tool.pricing.startingPrice}/mo</span>
                            : <span className="text-gray-400">N/A</span>
                          }
                        </td>
                        <td className="py-4 px-4 text-center text-xs text-gray-600 max-w-[140px] line-clamp-1">
                          {tool.ratings.easeOfUse >= 8.5 ? 'Beginners' :
                           tool.ratings.features >= 8.5 ? 'Power Users' :
                           tool.ratings.valueForMoney >= 8.5 ? 'Budget-Friendly' : 'General Use'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Link
                            href={`/${tool.categorySlug}/${tool.slug}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Review &#8594;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Rankings */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Detailed Rankings &amp; Reviews
        </h2>

        <div className="space-y-6 mb-12">
          {allTools.map((tool, index) => {
            const label = getRatingLabel(tool.ratings.overall);
            return (
              <div
                key={tool.id}
                className={`bg-white border rounded-xl p-6 ${index === 0 ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      #{index + 1}
                    </div>
                    <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                        {index === 0 && (
                          <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            TOP PICK
                          </span>
                        )}
                        {index === 1 && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            RUNNER-UP
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{tool.tagline}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-extrabold text-gray-900">{tool.ratings.overall}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${label.color}`}>{label.text}</div>
                  </div>
                </div>

                {/* Rating Bars */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Ease of Use', value: tool.ratings.easeOfUse },
                    { label: 'Features', value: tool.ratings.features },
                    { label: 'Value', value: tool.ratings.valueForMoney },
                    { label: 'Support', value: tool.ratings.support },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{r.label}</span>
                        <span className="font-semibold text-gray-700">{r.value.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${(r.value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Info + Actions */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {tool.pricing.hasFreeplan && (
                      <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Free Plan Available
                      </span>
                    )}
                    {tool.pricing.startingPrice && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        From ${tool.pricing.startingPrice}/mo
                      </span>
                    )}
                    <span className="bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      {tool.ratings.reviewCount} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <Link
                      href={`/${tool.categorySlug}/${tool.slug}`}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Full Review &#8594;
                    </Link>
                    <Link
                      href={`/${tool.categorySlug}/${tool.slug}/alternatives`}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Alternatives
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {allTools.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl mb-10">
            <p className="text-gray-500 text-lg mb-4">No tools found in this category yet.</p>
            <Link href={`/${sub.categorySlug}`} className="text-indigo-600 font-semibold hover:underline">
              Browse all {sub.categoryName} &#8594;
            </Link>
          </div>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl group" open={i === 0}>
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-indigo-600">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* SEO Text Block */}
        <div className="bg-gray-50 rounded-xl p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            How We Choose the Best {sub.name}
          </h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              Our editorial team evaluates every {sub.name.toLowerCase().replace(/tools?$/i, 'tool')} through
              hands-on testing and analysis across four key dimensions: ease of use, feature completeness,
              value for money, and customer support quality.
            </p>
            <p>
              We assign scores on a 0&ndash;10 scale and update our rankings regularly to reflect new features,
              pricing changes, and shifts in the competitive landscape. Our goal is to help you make an informed
              decision without the noise of paid placements or affiliate bias.
            </p>
            <p>
              Each review includes a detailed breakdown of pros and cons, pricing tiers, feature comparisons
              with competitors, and real-world use cases to ensure you find the right tool for your specific needs.
            </p>
          </div>
        </div>

        {/* Cross-links to related best-of pages */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore More Best-of Lists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBCATEGORIES[sub.categorySlug]
              ?.filter((s) => s.slug !== slug)
              .slice(0, 6)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/best/${related.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  Best {related.name} &#8594;
                </Link>
              ))}
            {/* Cross-category links */}
            {Object.entries(SUBCATEGORIES)
              .filter(([catSlug]) => catSlug !== sub.categorySlug)
              .slice(0, 2)
              .map(([, subs]) => subs[0])
              .filter(Boolean)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/best/${s.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  Best {s.name} &#8594;
                </Link>
              ))}
          </div>
        </div>

        {/* Back to category */}
        <div className="text-center">
          <Link
            href={`/${sub.categorySlug}`}
            className="text-indigo-600 font-semibold hover:underline"
          >
            &#8592; Back to all {sub.categoryName}
          </Link>
        </div>
      </div>
    </>
  );
}
