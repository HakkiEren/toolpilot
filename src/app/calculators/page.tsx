import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SEO, CATEGORY_LIST } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EditorialBadge } from '@/components/common/EditorialBadge';
import { AdBanner } from '@/components/ads/AdSlot';

// ============================================================
// CALCULATORS HUB PAGE — Links to all 6 free calculators
// Targets "free business calculators" and related queries
// ============================================================

const title = `Free Business Calculators — ROI, Cost & Profit Tools | ${SITE_NAME}`;
const description = 'Free online calculators for SaaS ROI, AI costs, e-commerce profit margins, email marketing returns, hosting costs, and team productivity savings. No signup required.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/calculators` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/calculators`,
    type: 'website',
    locale: SEO.locale,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title,
    description,
  },
};

const CALCULATORS = [
  {
    slug: 'roi',
    title: 'SaaS ROI Calculator',
    shortDescription: 'Calculate return on investment for switching SaaS tools',
    icon: '📊',
    category: 'SaaS',
    categorySlug: 'saas',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
  },
  {
    slug: 'ai-cost',
    title: 'AI Tool Cost Estimator',
    shortDescription: 'Estimate costs for AI tools based on usage and tokens',
    icon: '🤖',
    category: 'AI Tools',
    categorySlug: 'ai-tools',
    gradient: 'from-purple-500 to-pink-600',
    lightBg: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
  },
  {
    slug: 'ecommerce-profit',
    title: 'E-commerce Profit Calculator',
    shortDescription: 'Calculate margins, markup, and profit after all costs',
    icon: '💰',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    gradient: 'from-emerald-500 to-teal-600',
    lightBg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
  },
  {
    slug: 'email-marketing-roi',
    title: 'Email Marketing ROI Calculator',
    shortDescription: 'Measure campaign returns based on list size and engagement',
    icon: '📧',
    category: 'Marketing',
    categorySlug: 'marketing',
    gradient: 'from-orange-500 to-red-600',
    lightBg: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
  },
  {
    slug: 'hosting-cost',
    title: 'Hosting Cost Calculator',
    shortDescription: 'Compare hosting costs across providers and plans',
    icon: '🖥️',
    category: 'Hosting',
    categorySlug: 'hosting',
    gradient: 'from-cyan-500 to-blue-600',
    lightBg: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20',
  },
  {
    slug: 'team-productivity',
    title: 'Team Productivity Calculator',
    shortDescription: 'Estimate time and cost savings from tool automation',
    icon: '⚡',
    category: 'Business',
    categorySlug: 'business',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
  },
];

export default function CalculatorsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Calculators', url: '/calculators' },
  ]);

  // CollectionPage schema for this hub
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Business Calculators',
    description,
    url: `${SITE_URL}/calculators`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: CALCULATORS.length,
      itemListElement: CALCULATORS.map((calc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: calc.title,
        url: `${SITE_URL}/calculators/${calc.slug}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Calculators', url: '' }]} />
        <EditorialBadge lastUpdated={new Date().toISOString().split('T')[0]} />

        {/* Hero */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 dark:from-gray-900 dark:via-emerald-950/10 dark:to-teal-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-teal-400/10 dark:bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                🧮 {CALCULATORS.length} Free Tools
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                <span className="gradient-text">Free Business Calculators</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Make data-driven decisions with our free calculators. Estimate costs, calculate ROI,
                and compare options — no signup required, instant results.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Cards Grid */}
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {CALCULATORS.map((calc, idx) => (
            <Link
              key={calc.slug}
              href={`/calculators/${calc.slug}`}
              className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all card-animate"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${calc.lightBg} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.gradient} flex items-center justify-center text-xl shadow-md`}>
                    {calc.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {calc.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {calc.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {calc.shortDescription}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Try Free</span>
                  <span className="group-hover:translate-x-1 transition-transform">&#8594;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdBanner />

        {/* Why Use Our Calculators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why Use Our Calculators?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Instant Results', description: 'Get answers in seconds — no sign-up, no email required' },
              { icon: '🎯', title: 'Data-Driven', description: 'Base your decisions on numbers, not guesswork' },
              { icon: '🔒', title: '100% Private', description: 'All calculations run locally in your browser' },
            ].map((feature) => (
              <div key={feature.title} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="text-2xl mb-2 block">{feature.icon}</span>
                <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Explore Tool Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            After calculating your numbers, explore our expert tool reviews and comparisons to find the best solution.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name[0]}
                </div>
                <div>
                  <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-400">Reviews & comparisons</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Cross-links */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/glossary" className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors border border-cyan-200/50 dark:border-cyan-800/50">
              📖 Tech Glossary
            </Link>
            <Link href="/best" className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors border border-amber-200/50 dark:border-amber-800/50">
              🏆 Best Tools
            </Link>
            <Link href="/blog" className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-200/50 dark:border-purple-800/50">
              📝 Blog
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
