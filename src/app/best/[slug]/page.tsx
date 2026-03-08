import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolsBySubcategory, getToolsByCategory, getBlogPosts } from '@/lib/data';
import { CATEGORIES, SUBCATEGORIES, SITE_URL, SITE_NAME } from '@/lib/constants';
import { generateBreadcrumbSchema, generateCollectionSchema, generateBestOfItemListSchema, generateFAQSchema } from '@/lib/schema';
import { ToolLogo } from '@/components/common/ToolLogo';
import { RatingStars } from '@/components/common/RatingStars';
import { AdBanner, AdInArticle, AdMultiplex, AdSidebar } from '@/components/ads/AdSlot';
import { ShareButtons } from '@/components/common/ShareButtons';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import type { Tool } from '@/types';

// Individual award with full tool reference
interface Award {
  emoji: string;
  title: string;
  description: string;
  tool: Tool;
  gradient: string;
  borderColor: string;
}

// Award badges — calculated from tool data
function getAwardBadges(tools: Tool[]): Record<string, string[]> {
  const badges: Record<string, string[]> = {};
  if (tools.length < 2) return badges;

  // Editor's Choice — top overall rating (always #1)
  badges[tools[0].id] = ['🏆 Editor\'s Choice'];

  // Best Value — highest value for money (if not already #1)
  const bestValue = [...tools].sort((a, b) => b.ratings.valueForMoney - a.ratings.valueForMoney)[0];
  if (bestValue && bestValue.id !== tools[0].id) {
    if (!badges[bestValue.id]) badges[bestValue.id] = [];
    badges[bestValue.id].push('💎 Best Value');
  }

  // Most User-Friendly — highest ease of use (if not already awarded)
  const easiest = [...tools].sort((a, b) => b.ratings.easeOfUse - a.ratings.easeOfUse)[0];
  if (easiest && !badges[easiest.id]?.length) {
    if (!badges[easiest.id]) badges[easiest.id] = [];
    badges[easiest.id].push('✨ Most User-Friendly');
  }

  // Best for Budget — cheapest paid option with good rating
  const budgetPicks = tools
    .filter(t => t.pricing.startingPrice && t.pricing.startingPrice > 0 && t.ratings.overall >= 7)
    .sort((a, b) => (a.pricing.startingPrice || 999) - (b.pricing.startingPrice || 999));
  if (budgetPicks.length > 0 && !badges[budgetPicks[0].id]?.length) {
    if (!badges[budgetPicks[0].id]) badges[budgetPicks[0].id] = [];
    badges[budgetPicks[0].id].push('🏷️ Budget Pick');
  }

  return badges;
}

// Build structured awards list for showcase section
function getAwards(tools: Tool[]): Award[] {
  if (tools.length < 2) return [];
  const awards: Award[] = [];

  // Editor's Choice — #1 overall
  awards.push({
    emoji: '🏆',
    title: 'Editor\'s Choice',
    description: `Top-rated overall with ${tools[0].ratings.overall}/10`,
    tool: tools[0],
    gradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
  });

  // Best Value
  const bestValue = [...tools].sort((a, b) => b.ratings.valueForMoney - a.ratings.valueForMoney)[0];
  if (bestValue && bestValue.id !== tools[0].id) {
    awards.push({
      emoji: '💎',
      title: 'Best Value',
      description: `Value score: ${bestValue.ratings.valueForMoney}/10`,
      tool: bestValue,
      gradient: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
    });
  }

  // Most User-Friendly
  const easiest = [...tools].sort((a, b) => b.ratings.easeOfUse - a.ratings.easeOfUse)[0];
  if (easiest && easiest.id !== tools[0].id && easiest.id !== bestValue?.id) {
    awards.push({
      emoji: '✨',
      title: 'Easiest to Use',
      description: `Ease score: ${easiest.ratings.easeOfUse}/10`,
      tool: easiest,
      gradient: 'from-blue-400 to-indigo-500',
      borderColor: 'border-blue-300 dark:border-blue-700',
    });
  }

  // Most Feature-Rich
  const featureRich = [...tools].sort((a, b) => b.ratings.features - a.ratings.features)[0];
  if (featureRich && !awards.some(a => a.tool.id === featureRich.id)) {
    awards.push({
      emoji: '⚙️',
      title: 'Most Features',
      description: `Features score: ${featureRich.ratings.features}/10`,
      tool: featureRich,
      gradient: 'from-purple-400 to-violet-500',
      borderColor: 'border-purple-300 dark:border-purple-700',
    });
  }

  // Budget Pick
  const budgetPicks = tools
    .filter(t => t.pricing.startingPrice && t.pricing.startingPrice > 0 && t.ratings.overall >= 7)
    .sort((a, b) => (a.pricing.startingPrice || 999) - (b.pricing.startingPrice || 999));
  if (budgetPicks.length > 0 && !awards.some(a => a.tool.id === budgetPicks[0].id)) {
    awards.push({
      emoji: '🏷️',
      title: 'Budget Pick',
      description: `From $${budgetPicks[0].pricing.startingPrice}/mo`,
      tool: budgetPicks[0],
      gradient: 'from-orange-400 to-rose-500',
      borderColor: 'border-orange-300 dark:border-orange-700',
    });
  }

  return awards;
}

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
      type: 'article',
      authors: [`${SITE_NAME} Editorial Team`],
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
      answer: `Based on our analysis, ${topTool.name} is the top-rated ${subcategoryName.toLowerCase().replace(/tools?$/i, 'tool')} in ${year} with a score of ${topTool.ratings.overall}/10. It stands out for its ${topTool.ratings.easeOfUse >= 8 ? 'ease of use' : 'feature set'} and ${topTool.pricing.hasFreeplan ? 'offers a free plan' : topTool.pricing.startingPrice != null ? `starts at $${topTool.pricing.startingPrice}/month` : 'offers competitive pricing'}.`,
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

  // Fetch related blog posts for cross-linking
  const allPosts = await getBlogPosts(50);
  const categoryPosts = allPosts.filter(p => p.categorySlug === sub.categorySlug).slice(0, 3);

  const faqs = generateBestOfFAQs(allTools, sub.name);
  const awardBadges = getAwardBadges(allTools);
  const awards = getAwards(allTools);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: sub.categoryName, url: `/${sub.categorySlug}` },
    { name: `Best ${sub.name}`, url: `/best/${slug}` },
  ];

  return (
    <>
      <ReadingProgress />
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

        {/* Hero — Premium gradient with animated pattern */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-xl shadow-indigo-600/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpIi8+PC9zdmc+')] pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/10">
                🏆 {year} RANKINGS
              </span>
              <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/10">
                {allTools.length} TOOLS REVIEWED
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Best {sub.name} in {year}
            </h1>
            <p className="text-lg text-white/85 max-w-2xl leading-relaxed">
              {sub.description} We&apos;ve tested and compared {allTools.length} options to help you find the perfect fit.
            </p>
            {allTools.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <ToolLogo logoUrl={allTools[0].logoUrl} name={allTools[0].name} size={28} />
                  <div>
                    <div className="text-xs text-white/70">Top Pick</div>
                    <div className="text-sm font-bold">{allTools[0].name} — {allTools[0].ratings.overall}/10 ⭐</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TL;DR Quick Verdict — AI Overview + Featured Snippet optimized */}
        {allTools.length >= 3 && (
          <div className="mb-10 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Quick Verdict</span>
              <div className="flex-1 h-px bg-indigo-200/50 dark:bg-indigo-800/30" />
            </div>
            <p data-speakable="true" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Our top 3 picks for {sub.name.toLowerCase()} in {year}:{' '}
              <strong>{allTools[0].name}</strong> ({allTools[0].ratings.overall}/10) takes the top spot with {allTools[0].ratings.features >= 8.5 ? 'exceptional features' : allTools[0].ratings.easeOfUse >= 8.5 ? 'outstanding ease of use' : 'strong overall performance'},{' '}
              <strong>{allTools[1].name}</strong> ({allTools[1].ratings.overall}/10) is the runner-up{allTools[1].pricing.hasFreeplan ? ' with a free plan available' : ''}, and{' '}
              <strong>{allTools[2].name}</strong> ({allTools[2].ratings.overall}/10) rounds out the top three
              {allTools[2].ratings.valueForMoney >= 8 ? ' with excellent value for money' : ''}.{' '}
              {allTools.filter(t => t.pricing.hasFreeplan).length > 0
                ? `${allTools.filter(t => t.pricing.hasFreeplan).length} of ${allTools.length} tools offer free plans.`
                : `Prices start from $${Math.min(...allTools.filter(t => t.pricing.startingPrice).map(t => t.pricing.startingPrice!))}/mo.`
              }
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                <ShareButtons
                  url={`${SITE_URL}/best/${slug}`}
                  title={`Best ${sub.name} in ${year}`}
                  description={`Compare the best ${sub.name.toLowerCase()} side by side with expert ratings and pricing.`}
                />
                <CopyLinkButton url={`${SITE_URL}/best/${slug}`} />
              </div>
            </div>
          </div>
        )}

        {/* Award Winners Showcase */}
        {awards.length >= 2 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-sm shadow-md shadow-yellow-500/20">🏅</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Award Winners</h2>
            </div>
            <div className={`grid gap-3 ${awards.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
              {awards.map((award) => (
                <Link
                  key={award.title}
                  href={`/${award.tool.categorySlug}/${award.tool.slug}`}
                  className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border-2 ${award.borderColor} p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${award.gradient} opacity-[0.07] rounded-bl-full`} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{award.emoji}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${award.gradient} bg-clip-text text-transparent`}>
                        {award.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <ToolLogo logoUrl={award.tool.logoUrl} name={award.tool.name} size={32} />
                      <div className="min-w-0">
                        <div className="font-bold text-sm group-hover:text-indigo-600 transition-colors truncate">{award.tool.name}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{award.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${award.gradient}`}
                          style={{ width: `${(award.tool.ratings.overall / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{award.tool.ratings.overall}/10</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick Summary Table */}
        {allTools.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-10 shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Comparison</h2>
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
                      <tr key={tool.id} className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${i === 0 ? 'bg-yellow-50/40 dark:bg-yellow-900/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${i < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-[200px]">{tool.tagline}</div>
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
                        <td className="py-4 px-4 text-center text-xs text-gray-600 max-w-[160px]">
                          {awardBadges[tool.id]?.length ? (
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {awardBadges[tool.id][0].replace(/^[^\s]+\s/, '')}
                            </span>
                          ) : (
                            tool.ratings.easeOfUse >= 8.5 ? 'Beginners' :
                            tool.ratings.features >= 8.5 ? 'Power Users' :
                            tool.ratings.valueForMoney >= 8.5 ? 'Budget-Friendly' : 'General Use'
                          )}
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

        {/* Ad: After Quick Comparison */}
        <AdBanner />

        {/* Detailed Rankings */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Detailed Rankings &amp; Reviews
        </h2>

        <div className="space-y-5 mb-12">
          {allTools.map((tool, index) => {
            const label = getRatingLabel(tool.ratings.overall);
            return (
              <div
                key={tool.id}
                className={`hover-lift bg-white dark:bg-gray-900 border rounded-2xl p-6 transition-all card-animate ${index === 0 ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-100 dark:ring-indigo-900/30 shadow-md' : 'border-gray-200 dark:border-gray-700'}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      #{index + 1}
                    </div>
                    <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tool.name}</h3>
                        {index === 0 && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            🏆 TOP PICK
                          </span>
                        )}
                        {index === 1 && (
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            🥈 RUNNER-UP
                          </span>
                        )}
                        {index === 2 && (
                          <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            🥉 3RD PLACE
                          </span>
                        )}
                        {/* Award badges */}
                        {awardBadges[tool.id]?.map((badge) => (
                          <span
                            key={badge}
                            className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.tagline}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{tool.ratings.overall}</div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded ${label.color} dark:bg-opacity-20`}>{label.text}</div>
                  </div>
                </div>

                {/* Rating Bars */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Ease of Use', value: tool.ratings.easeOfUse, gradient: 'from-blue-500 to-cyan-400' },
                    { label: 'Features', value: tool.ratings.features, gradient: 'from-purple-500 to-indigo-400' },
                    { label: 'Value', value: tool.ratings.valueForMoney, gradient: 'from-green-500 to-emerald-400' },
                    { label: 'Support', value: tool.ratings.support, gradient: 'from-orange-500 to-amber-400' },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{r.value.toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${r.gradient} rounded-full score-bar-animated`}
                          style={{ width: `${(r.value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Info + Actions */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {tool.pricing.hasFreeplan && (
                      <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">
                        ✓ Free Plan
                      </span>
                    )}
                    {tool.pricing.startingPrice && (
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">
                        From ${tool.pricing.startingPrice}/mo
                      </span>
                    )}
                    <span className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full">
                      {tool.ratings.reviewCount} reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    {tool.websiteUrl && (
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-xs font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-sm"
                      >
                        Visit &#8599;
                      </a>
                    )}
                    <Link
                      href={`/${tool.categorySlug}/${tool.slug}`}
                      className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Review &#8594;
                    </Link>
                    <Link
                      href={`/${tool.categorySlug}/${tool.slug}/alternatives`}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-10 border border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No tools found in this category yet.</p>
            <Link href={`/${sub.categorySlug}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Browse all {sub.categoryName} &#8594;
            </Link>
          </div>
        )}

        {/* Compare Top Picks — Internal linking to comparison pages */}
        {allTools.length >= 2 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Compare Top Picks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              See how the top-ranked {sub.name.toLowerCase()} stack up against each other in detailed side-by-side comparisons.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allTools.slice(0, 4).flatMap((toolA, i) =>
                allTools.slice(i + 1, Math.min(i + 3, 4)).map((toolB) => {
                  const compSlug = [toolA.slug, toolB.slug].sort().join('-vs-');
                  return (
                    <Link
                      key={compSlug}
                      href={`/${sub.categorySlug}/compare/${compSlug}`}
                      className="group hover-lift flex items-center gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <ToolLogo logoUrl={toolA.logoUrl} name={toolA.name} size={28} />
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-[10px] font-extrabold">VS</span>
                      <ToolLogo logoUrl={toolB.logoUrl} name={toolB.name} size={28} />
                      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {toolA.name} vs {toolB.name}
                      </span>
                      <span className="text-indigo-500 text-sm group-hover:translate-x-1 transition-transform">&#8594;</span>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========== RELATED ARTICLES — Internal cross-linking for SEO ========== */}
        {categoryPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Related {sub.categoryName} Articles</h2>
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                All articles &#8594;
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {categoryPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group hover-lift bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all overflow-hidden"
                >
                  <div className="p-5">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-semibold rounded-full mb-3 uppercase tracking-wide">
                      {sub.categoryName}
                    </span>
                    <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Ad: Before FAQ */}
        <AdInArticle />

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl group" open={i === 0}>
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {faq.question}
                    <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">&#9660;</span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* SEO Text Block */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-8 mb-10 border border-gray-200/50 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            How We Choose the Best {sub.name}
          </h2>
          <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed space-y-3">
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

        {/* Ad: Before Cross-links */}
        <AdMultiplex />

        {/* Cross-links to related best-of pages */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Explore More Best-of Lists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBCATEGORIES[sub.categorySlug]
              ?.filter((s) => s.slug !== slug)
              .slice(0, 6)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/best/${related.slug}`}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Best {s.name} &#8594;
                </Link>
              ))}
          </div>
        </div>

        {/* Sticky Sidebar Ad (Desktop) */}
        <div className="hidden lg:block fixed right-4 top-32 z-30" style={{ maxWidth: '300px' }}>
          <AdSidebar />
        </div>

        {/* Freshness Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 mb-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Rankings last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {allTools.length} tools reviewed
          </p>
          <div className="flex items-center gap-3">
            <ShareButtons
              url={`${SITE_URL}/best/${slug}`}
              title={`Best ${sub.name} in ${year}`}
              description={`Compare the best ${sub.name.toLowerCase()} side by side with expert ratings and pricing.`}
            />
            <CopyLinkButton url={`${SITE_URL}/best/${slug}`} />
          </div>
        </div>

        {/* Back to category */}
        <div className="text-center">
          <Link
            href={`/${sub.categorySlug}`}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            &#8592; Back to all {sub.categoryName}
          </Link>
        </div>
      </div>
    </>
  );
}
