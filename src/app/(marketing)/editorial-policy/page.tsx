import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, CATEGORY_LIST, SEO } from '@/lib/constants';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// EDITORIAL POLICY PAGE — E-E-A-T signal for Google
// Covers: review methodology, rating system, affiliate disclosure,
// editorial independence, content accuracy, corrections policy
// ============================================================

const pageTitle = `Editorial Policy & Review Guidelines | ${SITE_NAME}`;
const pageDescription = `Learn how ${SITE_NAME} reviews and rates software tools. Our editorial policy covers our methodology, rating system, affiliate disclosure, and commitment to unbiased, accurate reviews.`;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: `${SITE_URL}/editorial-policy` },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/editorial-policy`,
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

const RATING_CRITERIA = [
  {
    name: 'Features & Functionality',
    weight: '20%',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    description: 'Core capabilities, integrations, API access, automation options, and customization depth.',
    factors: ['Core feature completeness', 'Integration ecosystem', 'API availability', 'Customization options', 'Mobile experience'],
  },
  {
    name: 'Ease of Use',
    weight: '20%',
    icon: '✨',
    color: 'from-purple-500 to-pink-500',
    description: 'Onboarding experience, UI/UX design, learning curve, and documentation quality.',
    factors: ['Onboarding flow', 'Interface intuitiveness', 'Learning curve', 'Help documentation', 'Error handling'],
  },
  {
    name: 'Pricing & Plans',
    weight: '20%',
    icon: '💰',
    color: 'from-green-500 to-emerald-500',
    description: 'Affordability, plan structure, free tier availability, and transparency of pricing.',
    factors: ['Free tier availability', 'Price competitiveness', 'Plan flexibility', 'Hidden fee transparency', 'Refund policy'],
  },
  {
    name: 'Customer Support',
    weight: '20%',
    icon: '🛟',
    color: 'from-orange-500 to-amber-500',
    description: 'Support channel availability, response times, quality of assistance, and community resources.',
    factors: ['Response time', 'Channel availability', 'Knowledge base depth', 'Community resources', 'SLA guarantees'],
  },
  {
    name: 'Value for Money',
    weight: '20%',
    icon: '🏆',
    color: 'from-red-500 to-rose-500',
    description: 'Overall cost-effectiveness compared to alternatives in the same category.',
    factors: ['Feature-to-price ratio', 'Scalability costs', 'Competitor positioning', 'Long-term value', 'ROI potential'],
  },
];

const REVIEW_PROCESS = [
  {
    step: 1,
    title: 'Tool Discovery & Vetting',
    description: 'Our research team identifies tools through market analysis, user requests, industry reports, and competitive monitoring. Each tool must meet a minimum quality threshold before entering our review pipeline.',
    icon: '🔍',
  },
  {
    step: 2,
    title: 'Account Setup & Testing',
    description: 'We create real accounts, test free tiers and paid plans, and use each tool for a minimum period. We document the complete user journey from signup to daily usage.',
    icon: '🧪',
  },
  {
    step: 3,
    title: 'Feature Mapping & Analysis',
    description: 'We build structured feature matrices comparing each tool against direct competitors. Every feature claim is verified through hands-on testing.',
    icon: '📊',
  },
  {
    step: 4,
    title: 'Pricing Verification',
    description: 'All pricing data is sourced directly from official websites and verified regularly. We flag hidden costs, usage limits, and any pricing gotchas that may not be immediately obvious.',
    icon: '💳',
  },
  {
    step: 5,
    title: 'Rating & Scoring',
    description: 'Each tool is scored across our five rating dimensions. Scores are normalized on a 1-10 scale, with the overall rating being a weighted average of all dimensions.',
    icon: '⭐',
  },
  {
    step: 6,
    title: 'Peer Review & Publication',
    description: 'Every review undergoes internal peer review for accuracy, fairness, and completeness before publication. At least one additional team member must approve the final review.',
    icon: '✅',
  },
  {
    step: 7,
    title: 'Ongoing Monitoring',
    description: 'Published reviews are continuously monitored. We track pricing changes, feature updates, and user feedback to keep our content accurate and current.',
    icon: '🔄',
  },
];

const year = new Date().getFullYear();

export default function EditorialPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Editorial Policy', url: '/editorial-policy' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: 'Editorial Policy', url: '' },
        ]} />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Transparency & Trust
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="gradient-text">Editorial Policy</span>
            <br />
            <span className="text-gray-900 dark:text-white text-3xl md:text-4xl">& Review Guidelines</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            At {SITE_NAME}, we believe in complete transparency. This page explains how we research, test, rate, and monetize our tool reviews.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
            Last updated: <time dateTime={`${year}-01-01`}>{new Date(`${year}-01-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</time>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Table of Contents */}
        <nav className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800" aria-label="Table of contents">
          <h2 className="text-lg font-bold mb-4">On This Page</h2>
          <ol className="space-y-2 text-sm">
            {[
              { id: 'mission', label: 'Our Mission & Independence' },
              { id: 'methodology', label: 'Review Methodology' },
              { id: 'rating-system', label: 'Rating System Explained' },
              { id: 'monetization', label: 'How We Make Money' },
              { id: 'accuracy', label: 'Content Accuracy & Updates' },
              { id: 'corrections', label: 'Corrections Policy' },
              { id: 'contact', label: 'Contact Our Editorial Team' },
            ].map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Section 1: Mission & Independence */}
        <section id="mission" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">1</span>
            Our Mission & Editorial Independence
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {SITE_NAME} exists to help businesses and individuals find the right software tools through honest, data-driven comparisons. We are an <strong>independent publication</strong> — we are not owned, funded, or controlled by any software vendor.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 my-6">
              {[
                { icon: '🚫', title: 'No Pay-for-Play', desc: 'Software companies cannot pay for higher ratings or more favorable reviews.' },
                { icon: '🔒', title: 'Editorial Firewall', desc: 'Our editorial team operates independently from our business and advertising teams.' },
                { icon: '📝', title: 'Full Disclosure', desc: 'We clearly disclose all affiliate relationships and potential conflicts of interest.' },
                { icon: '🔬', title: 'Evidence-Based', desc: 'Every rating is backed by documented testing, not opinions or sponsorships.' },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Review Methodology */}
        <section id="methodology" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-lg">2</span>
            Review Methodology
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            Every tool on {SITE_NAME} goes through a rigorous, multi-step review process. Here is exactly how we evaluate each tool:
          </p>

          <div className="space-y-4">
            {REVIEW_PROCESS.map((step) => (
              <div key={step.step} className="flex gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {step.step}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Rating System */}
        <section id="rating-system" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg">3</span>
            Rating System Explained
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Every tool is rated on a <strong>1-10 scale</strong> across five equally weighted dimensions. The overall score is the weighted average of all five dimensions.
          </p>

          {/* Score meaning table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse" role="table">
              <caption className="sr-only">Score interpretation guide for {SITE_NAME} ratings</caption>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Score Range</th>
                  <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Interpretation</th>
                  <th scope="col" className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: '9.0 – 10.0', label: 'Outstanding', rec: 'Best-in-class. Highly recommended for most users.', color: 'text-green-600' },
                  { range: '8.0 – 8.9', label: 'Excellent', rec: 'Top-tier choice with minor trade-offs.', color: 'text-emerald-600' },
                  { range: '7.0 – 7.9', label: 'Very Good', rec: 'Strong option, especially for specific use cases.', color: 'text-blue-600' },
                  { range: '6.0 – 6.9', label: 'Good', rec: 'Solid tool but has notable limitations.', color: 'text-yellow-600' },
                  { range: '5.0 – 5.9', label: 'Average', rec: 'Consider alternatives unless it fits a niche need.', color: 'text-orange-600' },
                  { range: 'Below 5.0', label: 'Below Average', rec: 'Significant concerns. Better options likely available.', color: 'text-red-600' },
                ].map((row) => (
                  <tr key={row.range} className="border-b border-gray-100 dark:border-gray-800">
                    <td className={`py-3 px-4 font-semibold ${row.color}`}>{row.range}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{row.label}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{row.rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rating dimensions */}
          <h3 className="text-lg font-bold mb-4">The Five Rating Dimensions</h3>
          <div className="space-y-4">
            {RATING_CRITERIA.map((criterion) => (
              <div key={criterion.name} className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{criterion.icon}</span>
                    <h4 className="font-bold text-gray-900 dark:text-white">{criterion.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${criterion.color}`}>
                    {criterion.weight}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{criterion.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {criterion.factors.map((factor) => (
                    <span key={factor} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: How We Make Money */}
        <section id="monetization" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-lg">4</span>
            How We Make Money
          </h2>
          <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/50 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Transparency about monetization is important to us. Here is exactly how {SITE_NAME} generates revenue:
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-lg">🔗</span> Affiliate Links
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                When you click a link to a tool on our site and sign up or make a purchase, we may earn a commission from the tool provider. These are standard affiliate partnerships.
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Affiliate relationships <strong>never</strong> influence our ratings or rankings
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Tools without affiliate programs receive the same editorial treatment
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  All affiliate links are clearly marked with <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">rel=&quot;nofollow sponsored&quot;</code>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-lg">📺</span> Display Advertising
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We display ads through Google AdSense on our pages. Advertising revenue helps us maintain the site and continue producing free content. Advertisers have zero influence over our editorial content.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              Important: We review and rate many tools that we have <strong>no financial relationship</strong> with. A tool&apos;s presence on our site is based on relevance and user demand, not monetization potential.
            </p>
          </div>
        </section>

        {/* Section 5: Content Accuracy & Updates */}
        <section id="accuracy" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg">5</span>
            Content Accuracy & Updates
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p className="leading-relaxed">
              The software industry moves fast. We are committed to keeping our content accurate through the following practices:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Regular Price Checks', desc: 'Pricing data is verified against official sources on a monthly cycle.', icon: '💲' },
                { title: 'Feature Tracking', desc: 'We monitor major feature launches and product updates across all reviewed tools.', icon: '🔍' },
                { title: 'Sunset Monitoring', desc: 'Tools that shut down, merge, or significantly change are flagged and updated promptly.', icon: '🌅' },
                { title: 'User Feedback Loop', desc: 'Readers can report inaccuracies via our contact form. We investigate and update within 48 hours.', icon: '📬' },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="text-xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="leading-relaxed">
              Every tool page and comparison includes a visible &quot;last updated&quot; date so you can see how current the information is.
            </p>
          </div>
        </section>

        {/* Section 6: Corrections Policy */}
        <section id="corrections" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-white text-lg">6</span>
            Corrections Policy
          </h2>
          <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 text-gray-600 dark:text-gray-400">
            <p className="leading-relaxed">
              Despite our best efforts, errors can occur. When we identify an inaccuracy — whether through internal review or reader feedback — we follow this process:
            </p>
            <ol className="space-y-3 list-decimal list-inside">
              <li><strong className="text-gray-900 dark:text-white">Acknowledgment</strong> — We acknowledge the error within 24 hours of discovery.</li>
              <li><strong className="text-gray-900 dark:text-white">Investigation</strong> — Our team verifies the correct information from primary sources.</li>
              <li><strong className="text-gray-900 dark:text-white">Correction</strong> — The content is updated with accurate information.</li>
              <li><strong className="text-gray-900 dark:text-white">Transparency</strong> — Material corrections are noted on the page with the correction date.</li>
            </ol>
            <p className="leading-relaxed">
              For factual errors in ratings, we recalculate and update the score. For pricing errors, we update immediately upon verification.
            </p>
          </div>
        </section>

        {/* Section 7: Contact */}
        <section id="contact" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-lg">7</span>
            Contact Our Editorial Team
          </h2>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/10 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We welcome feedback, corrections, and tool suggestions. Reach out to us:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact Us
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link href="/about" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors">
            About {SITE_NAME}
          </Link>
          <Link href="/about/team" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors">
            Our Team
          </Link>
          <Link href="/privacy" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </>
  );
}
