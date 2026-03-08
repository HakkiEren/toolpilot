import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SITE_NAME, SITE_URL, SEO } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { ToolLogo } from '@/components/common/ToolLogo';
import { RatingStars } from '@/components/common/RatingStars';
import { BadgeEmbedCode } from './badge-embed';

// ============================================================
// BADGES PAGE — Embeddable award badges for SaaS companies
// Backlink generation strategy: tools display badge → link to ProPicked
// ============================================================

export const revalidate = 3600;

const year = new Date().getFullYear();
const pageTitle = `${SITE_NAME} Award Badges — Display Your Rating | ${SITE_NAME}`;
const pageDescription = `Has your tool been rated by ${SITE_NAME}? Display your official award badge on your website. Embeddable badges for top-rated tools, category winners, and editor's picks.`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${SITE_URL}/badges` },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/badges`,
    siteName: SITE_NAME,
    type: 'website',
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: pageTitle,
    description: pageDescription,
  },
};

// Badge tier thresholds
const BADGE_TIERS = [
  { min: 9.0, label: 'Exceptional', color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600', icon: '🏆' },
  { min: 8.0, label: 'Excellent', color: '#2563EB', gradient: 'from-blue-500 to-blue-700', icon: '🥇' },
  { min: 7.0, label: 'Very Good', color: '#059669', gradient: 'from-emerald-500 to-green-700', icon: '⭐' },
] as const;

function getTier(score: number) {
  return BADGE_TIERS.find(t => score >= t.min) || null;
}

interface BadgeTool {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  rating: number;
  logoUrl: string;
}

export default async function BadgesPage() {
  // Fetch top-rated tools eligible for badges (7.0+)
  const { data: rawTools } = await supabase
    .from('tools')
    .select('slug, name, category_slug, ratings_overall, logo_url')
    .eq('status', 'published')
    .gte('ratings_overall', 7.0)
    .order('ratings_overall', { ascending: false })
    .limit(100);

  const CATEGORY_NAMES: Record<string, string> = {
    'ai-tools': 'AI Tools',
    'saas': 'SaaS',
    'ecommerce': 'E-commerce',
    'marketing': 'Marketing',
    'hosting': 'Web Hosting',
    'business': 'Business Tools',
  };

  const tools: BadgeTool[] = (rawTools || []).map(t => ({
    slug: t.slug,
    name: t.name,
    categorySlug: t.category_slug,
    categoryName: CATEGORY_NAMES[t.category_slug] || t.category_slug,
    rating: t.ratings_overall,
    logoUrl: t.logo_url || '',
  }));

  // Group by tier
  const exceptional = tools.filter(t => t.rating >= 9.0);
  const excellent = tools.filter(t => t.rating >= 8.0 && t.rating < 9.0);
  const veryGood = tools.filter(t => t.rating >= 7.0 && t.rating < 8.0);

  // Category winners (top tool per category)
  const categoryWinners: BadgeTool[] = [];
  const seen = new Set<string>();
  for (const tool of tools) {
    if (!seen.has(tool.categorySlug)) {
      seen.add(tool.categorySlug);
      categoryWinners.push(tool);
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Badges', url: '/badges' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Award Badges', url: '' },
        ]} />

        {/* Hero */}
        <div className="mt-6 mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30 dark:from-gray-900 dark:via-amber-950/10 dark:to-orange-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-orange-400/10 dark:bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-4">
                <span className="text-lg">🏆</span>
                {tools.length} Eligible Tools
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                <span className="gradient-text">{SITE_NAME}</span> Award Badges
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Has your tool been reviewed and rated by {SITE_NAME}? Display your official award badge on your
                website to showcase your rating and build trust with potential customers.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Free to use
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Copy-paste embed code
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Links to your full review
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Find Your Tool', desc: 'Search for your tool below or browse by category to find your rating.' },
              { step: '2', title: 'Copy Embed Code', desc: 'Click "Get Badge" to reveal the HTML embed code for your website.' },
              { step: '3', title: 'Add to Your Site', desc: 'Paste the code anywhere on your website — footer, homepage, or about page.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Badge Tiers Explanation */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 text-center">Badge Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BADGE_TIERS.map((tier) => (
              <div key={tier.label} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                <div className="text-3xl mb-2">{tier.icon}</div>
                <h3 className="font-bold text-lg mb-1">{tier.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Rated {tier.min}+ out of 10
                </p>
                {/* Mini badge preview */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-semibold" style={{ borderColor: tier.color, color: tier.color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  {SITE_NAME} {tier.label} {year}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Winners */}
        {categoryWinners.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-2 text-center">Category Winners {year}</h2>
            <p className="text-gray-500 text-center mb-6 text-sm">Top-rated tool in each category</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryWinners.map((tool) => {
                const tier = getTier(tool.rating);
                return (
                  <div key={tool.slug} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-amber-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />
                      <div>
                        <h3 className="font-bold text-sm">{tool.name}</h3>
                        <p className="text-xs text-gray-500">{tool.categoryName} Winner</p>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-lg font-bold" style={{ color: tier?.color || '#666' }}>
                          {tool.rating.toFixed(1)}
                        </div>
                        <RatingStars score={tool.rating} size="xs" />
                      </div>
                    </div>
                    <BadgeEmbedCode
                      toolName={tool.name}
                      toolSlug={tool.slug}
                      categorySlug={tool.categorySlug}
                      rating={tool.rating}
                      badgeType="category-winner"
                      categoryName={tool.categoryName}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Exceptional Tools (9.0+) */}
        {exceptional.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-2">
              <span className="mr-2">🏆</span> Exceptional ({exceptional.length})
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Rated 9.0+ out of 10</p>
            <div className="grid md:grid-cols-2 gap-4">
              {exceptional.map((tool) => (
                <ToolBadgeCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Excellent Tools (8.0-8.9) */}
        {excellent.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-2">
              <span className="mr-2">🥇</span> Excellent ({excellent.length})
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Rated 8.0 - 8.9 out of 10</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {excellent.map((tool) => (
                <ToolBadgeCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Very Good Tools (7.0-7.9) */}
        {veryGood.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-2">
              <span className="mr-2">⭐</span> Very Good ({veryGood.length})
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Rated 7.0 - 7.9 out of 10</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {veryGood.map((tool) => (
                <ToolBadgeCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'Are the badges free to use?',
                a: `Yes, ${SITE_NAME} award badges are completely free. We encourage all rated tools to display their badge as a mark of quality.`,
              },
              {
                q: 'Can I modify the badge design?',
                a: 'You can adjust the size of the badge using CSS, but please do not alter the badge content, colors, or remove the link back to your review page.',
              },
              {
                q: 'How are the ratings determined?',
                a: `Our editorial team evaluates every tool across five dimensions: Features & Functionality, Ease of Use, Pricing & Plans, Customer Support, and Value for Money. Each dimension is weighted equally at 20%. Read our editorial policy for full details.`,
              },
              {
                q: 'My tool was recently updated. Can I request a re-review?',
                a: `Absolutely! Contact us at our contact page and we'll schedule a re-evaluation of your tool with the latest features and pricing.`,
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-left">
                  <span className="pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl font-extrabold mb-2">Want Your Tool Reviewed?</h2>
            <p className="text-sm text-gray-300 mb-6">
              Submit your tool for an independent review by our editorial team.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all">
                Submit Your Tool
              </Link>
              <Link href="/editorial-policy" className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                Our Review Process
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ToolBadgeCard({ tool }: { tool: BadgeTool }) {
  const tier = getTier(tool.rating);
  if (!tier) return null;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
        <div className="flex-1 min-w-0">
          <Link href={`/${tool.categorySlug}/${tool.slug}`} className="font-semibold text-sm hover:text-blue-600 transition-colors truncate block">
            {tool.name}
          </Link>
          <p className="text-xs text-gray-500">{tool.categoryName}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-base font-bold" style={{ color: tier.color }}>
            {tool.rating.toFixed(1)}/10
          </div>
        </div>
      </div>
      <BadgeEmbedCode
        toolName={tool.name}
        toolSlug={tool.slug}
        categorySlug={tool.categorySlug}
        rating={tool.rating}
        badgeType="rated"
      />
    </div>
  );
}
