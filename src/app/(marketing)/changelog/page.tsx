import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CATEGORY_LIST, SEO } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// CHANGELOG PAGE — Freshness signal for E-E-A-T
// Shows recent tool additions, rating updates, feature launches
// ============================================================

const changelogTitle = `Changelog — What's New at ${SITE_NAME}`;
const changelogDescription = `See the latest updates to ${SITE_NAME}: new tool reviews, comparison updates, feature releases, and database expansions. Updated weekly.`;

export const metadata: Metadata = {
  title: changelogTitle,
  description: changelogDescription,
  alternates: { canonical: `${SITE_URL}/changelog` },
  openGraph: {
    title: changelogTitle,
    description: changelogDescription,
    url: `${SITE_URL}/changelog`,
    siteName: SITE_NAME,
    type: 'article',
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: changelogTitle,
    description: changelogDescription,
  },
};

// Changelog entries — most recent first
const CHANGELOG: {
  date: string;
  version?: string;
  entries: { type: 'added' | 'updated' | 'improved' | 'launched'; text: string; link?: string }[];
}[] = [
  {
    date: '2026-03-14',
    version: '3.0',
    entries: [
      { type: 'launched', text: 'Domain launched: propicked.com is now live with SSL certificates' },
      { type: 'launched', text: 'Auto-generated comparison FAQs — 5 FAQ rich snippet questions per comparison page (327+ pages)' },
      { type: 'improved', text: 'Homepage FAQ expanded from 6 to 10 questions targeting long-tail keywords' },
      { type: 'launched', text: 'Google Search Console & Bing Webmaster verification meta tag support via environment variables' },
      { type: 'improved', text: 'RSS feed: Upgraded to application/rss+xml Content-Type with Dublin Core namespace' },
      { type: 'improved', text: 'Environment variables documented: GA_ID, ADSENSE_ID, GSC_ID, BING_ID in .env.local.example' },
    ],
  },
  {
    date: '2026-03-13',
    version: '2.9',
    entries: [
      { type: 'launched', text: 'Complete rebrand: ToolPilot → ProPicked across entire codebase (23 files)' },
      { type: 'improved', text: 'Updated favicon, apple icon, header/footer logo letter to "P"' },
      { type: 'improved', text: 'Updated all OG images (blog, tool, comparison, best-of) with new brand' },
      { type: 'improved', text: 'Updated social links (Twitter, YouTube, LinkedIn) to @propicked' },
      { type: 'launched', text: 'Related Articles section added to pricing pages (433+ pages)', link: '/ai-tools/chatgpt/pricing' },
      { type: 'launched', text: 'Related Articles section added to alternatives pages (433+ pages)' },
      { type: 'launched', text: 'Related Articles section added to best-of ranking pages (46+ pages)' },
      { type: 'improved', text: 'PriceCompare component: raw img tag replaced with optimized ToolLogo (Next.js Image)' },
      { type: 'launched', text: 'Supabase migration script for subscribers and contact_submissions tables' },
      { type: 'improved', text: 'Internal linking: blog cross-links now on 1,400+ additional pages for SEO link equity' },
    ],
  },
  {
    date: '2026-03-11',
    version: '2.8',
    entries: [
      { type: 'launched', text: 'Centralized author system with individual bios, social links, and expertise data (E-E-A-T)', link: '/about/team' },
      { type: 'improved', text: 'Blog sidebar: Rich author profile with stats, social links (Twitter/LinkedIn/GitHub), and role' },
      { type: 'launched', text: 'ProfilePage JSON-LD schema on team page (2026 SEO best practice)' },
      { type: 'improved', text: 'Blog schema: wordCount, articleSection, inLanguage, author jobTitle/sameAs/knowsAbout' },
      { type: 'improved', text: 'Comparison schema: Added speakable specification and inLanguage for voice search' },
      { type: 'improved', text: 'Team page: Social links, specialization tags, anchor IDs for deep linking' },
      { type: 'launched', text: 'Blog posts: Speakable excerpt for Google voice search optimization' },
      { type: 'launched', text: 'Related blog posts section (3 category-matching articles) on blog detail pages' },
      { type: 'improved', text: 'Blog header: Author-specific gradient avatar and link to team profile anchor' },
      { type: 'improved', text: 'Performance: Compiler optimizations, Content-Language header, Vary header for CDN' },
    ],
  },
  {
    date: '2026-03-10',
    version: '2.7',
    entries: [
      { type: 'launched', text: 'Newsletter subscription system with Supabase backend + rate limiting + bot detection' },
      { type: 'improved', text: 'Footer newsletter form now fully functional (was previously readOnly)' },
      { type: 'improved', text: 'Newsletter popup upgraded with API integration and loading states' },
      { type: 'launched', text: 'Contact form now saves submissions to Supabase database' },
      { type: 'improved', text: 'Homepage: Social proof trust strip with verification badges and mini testimonial' },
      { type: 'improved', text: 'Removed duplicate How It Works section on homepage (kept HowTo schema version)' },
      { type: 'launched', text: 'SiteNavigationElement JSON-LD schema for better Google site structure understanding' },
      { type: 'improved', text: 'WebSite schema enhanced with inLanguage and description properties' },
      { type: 'improved', text: 'Proxy.ts: Lowercase URL normalization (301 redirects for SEO consistency)' },
      { type: 'added', text: 'Supabase migration files for subscribers + contact_submissions tables' },
    ],
  },
  {
    date: '2026-03-09',
    version: '2.6',
    entries: [
      { type: 'launched', text: 'CopyLinkButton + freshness footer on Best-of ranking pages' },
      { type: 'improved', text: 'ReadingProgress bar added to category hub and comparison hub pages' },
      { type: 'improved', text: 'Comparison pages: Full OpenGraph article metadata with section, tags, and Twitter cards' },
      { type: 'launched', text: 'AdSense ads on search results page for revenue optimization' },
      { type: 'launched', text: 'AdMultiplex ad unit on comparison hub pages' },
      { type: 'improved', text: 'CSS micro-interactions: Button press feedback, gradient hover effects, link underline animations' },
      { type: 'improved', text: 'Recently Updated section on homepage with real-time freshness badges' },
      { type: 'launched', text: 'Premium VerdictSection redesign with trophy winner banner and per-category analysis' },
      { type: 'launched', text: 'Glossary A-Z alphabetical navigation with letter chip filtering' },
      { type: 'improved', text: 'About and Calculator pages: Added full OpenGraph + Twitter card metadata' },
    ],
  },
  {
    date: '2026-03-08',
    version: '2.5',
    entries: [
      { type: 'improved', text: 'Homepage SEO: Added dedicated metadata with OpenGraph and Twitter cards' },
      { type: 'improved', text: 'Category, Glossary, Changelog pages now have full OpenGraph + Twitter metadata' },
      { type: 'launched', text: 'Reading progress bar on all content pages (blog, tool reviews, comparisons, pricing, alternatives)' },
      { type: 'launched', text: 'Copy link button with clipboard API for easy URL sharing' },
      { type: 'launched', text: 'Table of Contents with scroll-aware active section highlighting' },
      { type: 'improved', text: 'Pricing and Alternatives pages upgraded with TOC, ShareButtons, ReadingProgress, CopyLinkButton' },
      { type: 'improved', text: 'robots.txt: Allow Google to render JavaScript assets from /_next/static/' },
      { type: 'improved', text: 'XML Sitemap: Removed noindexed /sitemap-html page for cleaner crawl signals' },
      { type: 'improved', text: 'CDN edge caching: Added Cache-Control s-maxage + stale-while-revalidate headers' },
      { type: 'added', text: 'Subcategory filter tabs on category pages for easy tool browsing' },
      { type: 'launched', text: 'Back to Top button for improved navigation on long pages' },
      { type: 'improved', text: 'Best-of pages: Quick Verdict TL;DR box with top 3 picks summary' },
    ],
  },
  {
    date: '2026-03-07',
    version: '2.4',
    entries: [
      { type: 'launched', text: 'Team & Authors page for editorial transparency', link: '/about/team' },
      { type: 'improved', text: 'Enhanced Review schema with Pros/Cons rich snippets for Google' },
      { type: 'improved', text: 'Person author schema for blog posts and comparisons (E-E-A-T)' },
      { type: 'launched', text: 'HowTo schema on category Buyer\'s Guide sections' },
      { type: 'improved', text: 'Security headers: HSTS, Permissions-Policy, strict referrer' },
      { type: 'launched', text: 'Changelog page for freshness signals' },
    ],
  },
  {
    date: '2026-03-06',
    version: '2.3',
    entries: [
      { type: 'launched', text: 'Premium 404 page with category quick-links' },
      { type: 'improved', text: 'Blog post pages: author avatars, reading time estimates' },
      { type: 'improved', text: 'Shareable search URLs with query parameters (?q=, &cat=, &price=)' },
      { type: 'launched', text: 'HTML Sitemap with all page categories', link: '/sitemap-html' },
      { type: 'added', text: 'Voice search optimization with SpeakableSpecification schema' },
    ],
  },
  {
    date: '2026-03-05',
    version: '2.2',
    entries: [
      { type: 'launched', text: '6 interactive calculators: ROI, TCO, SaaS savings, and more', link: '/calculators/roi' },
      { type: 'launched', text: 'Glossary with 80+ technology terms', link: '/glossary' },
      { type: 'added', text: 'Newsletter popup for email subscriptions' },
      { type: 'improved', text: 'AdSense integration with 6 placement types across all pages' },
    ],
  },
  {
    date: '2026-03-04',
    version: '2.1',
    entries: [
      { type: 'added', text: 'Best-of subcategory pages with ranking carousels', link: '/best' },
      { type: 'improved', text: 'Tool pricing pages with plan comparison tables' },
      { type: 'improved', text: 'Alternatives pages with unique recommendation paragraphs' },
      { type: 'added', text: 'Category-specific FAQ sections with dynamic content' },
    ],
  },
  {
    date: '2026-03-03',
    version: '2.0',
    entries: [
      { type: 'launched', text: 'ProPicked 2.0 — Complete redesign with glassmorphism UI' },
      { type: 'added', text: '433 tools across 6 categories: AI, SaaS, E-commerce, Marketing, Hosting, Business' },
      { type: 'added', text: '327 head-to-head comparisons with feature matrices' },
      { type: 'added', text: '128 blog posts with expert analysis' },
      { type: 'launched', text: 'Dark mode with system preference detection' },
      { type: 'improved', text: 'Mobile-first responsive design across all 1,880+ pages' },
    ],
  },
];

const TYPE_CONFIG = {
  added: { label: 'Added', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  updated: { label: 'Updated', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  improved: { label: 'Improved', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  launched: { label: 'Launched', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

export default function ChangelogPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Changelog', url: '/changelog' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Changelog', url: '' },
        ]} />

        {/* Hero */}
        <div className="mt-6 mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-green-950/10 dark:to-emerald-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-green-600 dark:text-green-400 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Continuously Updated
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                What&apos;s New at <span className="gradient-text">{SITE_NAME}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                We continuously improve our platform with new tool reviews, comparison updates, and feature releases.
                See what we&apos;ve been working on below.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-300 via-blue-300 to-purple-300 dark:from-green-700 dark:via-blue-700 dark:to-purple-700" />

          <div className="space-y-10">
            {CHANGELOG.map((release) => (
              <div key={release.date} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-4 border-white dark:border-gray-950 shadow-md" />

                {/* Date + version header */}
                <div className="flex items-center gap-3 mb-4">
                  <time dateTime={release.date} className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {release.version && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      v{release.version}
                    </span>
                  )}
                </div>

                {/* Entries */}
                <div className="space-y-2.5">
                  {release.entries.map((entry, idx) => {
                    const config = TYPE_CONFIG[entry.type];
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                      >
                        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.link ? (
                            <Link href={entry.link} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {entry.text} <span className="text-blue-500">&#8594;</span>
                            </Link>
                          ) : (
                            entry.text
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Have a suggestion or found an issue?
            </p>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Send Feedback
            </Link>
          </div>
        </div>

        {/* Browse */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-4">Explore {SITE_NAME}</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-3.5 py-1.5 bg-white dark:bg-gray-900 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/best" className="px-3.5 py-1.5 bg-white dark:bg-gray-900 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors">
              Best Of
            </Link>
            <Link href="/blog" className="px-3.5 py-1.5 bg-white dark:bg-gray-900 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
