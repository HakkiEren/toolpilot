import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SEO, CATEGORIES, SUBCATEGORIES } from '@/lib/constants';
import { generateCalculatorHowToSchema, generateBreadcrumbSchema, generateWebApplicationSchema, generateFAQSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FAQSection } from '@/components/common/FAQSection';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import { getGlossaryTermsForCalculator } from '@/lib/glossary-data';
import { CalculatorClient } from './calculator-client';

// ============================================================
// CALCULATOR PAGES — Interactive tools for engagement & SEO
// ============================================================

export const revalidate = 86400; // 24 hours

const CALCULATORS: Record<string, {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  howToSteps: { name: string; text: string }[];
  faqs: { question: string; answer: string }[];
}> = {
  'roi': {
    title: 'SaaS ROI Calculator',
    description: 'Calculate the return on investment for switching to a new SaaS tool. Compare costs, time savings, and productivity gains.',
    metaTitle: 'SaaS ROI Calculator — Calculate Your Software Investment Returns',
    metaDescription: 'Free SaaS ROI calculator. Estimate how much time and money you can save by switching tools. Compare costs vs benefits instantly.',
    category: 'saas',
    howToSteps: [
      { name: 'Enter your current tool cost', text: 'Input how much you currently pay per month for your existing software solution.' },
      { name: 'Add the new tool cost', text: 'Enter the monthly cost of the SaaS tool you are considering switching to.' },
      { name: 'Estimate time savings', text: 'Input the estimated hours saved per week with the new tool.' },
      { name: 'Review your ROI results', text: 'The calculator shows your projected annual savings, payback period, and ROI percentage.' },
    ],
    faqs: [
      { question: 'What is a good ROI for SaaS tools?', answer: 'A good SaaS ROI is typically 3:1 or higher, meaning you get $3 in value for every $1 spent. Most successful SaaS investments deliver 5:1 to 10:1 ROI within 12 months through time savings, increased productivity, and reduced manual errors.' },
      { question: 'How do I calculate SaaS ROI?', answer: 'SaaS ROI = ((Gains from Investment - Cost of Investment) / Cost of Investment) x 100. Include monthly subscription costs, implementation time, training costs, and measure gains from time saved, efficiency improvements, and error reduction.' },
      { question: 'Should I include implementation costs in ROI?', answer: 'Yes, always include implementation costs such as data migration time, employee training hours, and any productivity loss during the transition period. These one-time costs significantly affect your payback period calculation.' },
    ],
  },
  'email-marketing-roi': {
    title: 'Email Marketing ROI Calculator',
    description: 'Calculate the potential return on investment for your email marketing campaigns. Factor in list size, open rates, and conversion rates.',
    metaTitle: 'Email Marketing ROI Calculator — Measure Campaign Returns',
    metaDescription: 'Free email marketing ROI calculator. Estimate revenue from your email campaigns based on list size, open rates, and conversions.',
    category: 'marketing',
    howToSteps: [
      { name: 'Enter your email list size', text: 'Input the total number of subscribers in your email list.' },
      { name: 'Set your open and click rates', text: 'Enter your average email open rate and click-through rate percentages.' },
      { name: 'Add conversion rate and value', text: 'Input your average conversion rate and the value per conversion.' },
      { name: 'Review campaign ROI', text: 'See your projected revenue, ROI percentage, and revenue per subscriber.' },
    ],
    faqs: [
      { question: 'What is a good email marketing ROI?', answer: 'Email marketing averages a $36 return for every $1 spent, making it one of the highest-ROI marketing channels. Top performers achieve $40-$45 per dollar by combining strong segmentation, personalized content, and optimized send times.' },
      { question: 'What email open rate should I expect?', answer: 'Average email open rates range from 15-25% depending on your industry. B2B emails typically see 20-25% open rates, while e-commerce averages 15-20%. Rates above 25% indicate strong list engagement and relevant content.' },
      { question: 'How do I improve email marketing ROI?', answer: 'Focus on list quality over quantity, segment your audience, personalize subject lines and content, optimize send timing through A/B testing, and clean your list regularly to remove inactive subscribers.' },
    ],
  },
  'hosting-cost': {
    title: 'Web Hosting Cost Calculator',
    description: 'Compare hosting costs across providers. Factor in traffic, storage, bandwidth, and features to find the most cost-effective option.',
    metaTitle: 'Web Hosting Cost Calculator — Compare Provider Pricing',
    metaDescription: 'Free web hosting cost calculator. Compare monthly costs across hosting providers based on your traffic, storage, and feature needs.',
    category: 'hosting',
    howToSteps: [
      { name: 'Select hosting type', text: 'Choose between shared, VPS, cloud, or dedicated hosting based on your needs.' },
      { name: 'Enter traffic estimates', text: 'Input your expected monthly visitors and page views.' },
      { name: 'Specify storage and features', text: 'Select the storage space, bandwidth, and features you need.' },
      { name: 'Compare hosting costs', text: 'Review the estimated monthly and annual costs across different hosting types.' },
    ],
    faqs: [
      { question: 'How much does web hosting cost per month?', answer: 'Shared hosting costs $3-$15/month, VPS hosting $20-$80/month, cloud hosting $10-$200/month depending on usage, and dedicated servers $80-$500+/month. Always calculate based on renewal pricing, not introductory rates.' },
      { question: 'What hosting type is best for my website?', answer: 'Blogs and small sites work well on shared hosting. Growing businesses should use VPS for consistent performance. High-traffic sites and web apps benefit from cloud hosting. Choose managed WordPress hosting if you run WordPress and want hassle-free maintenance.' },
      { question: 'Do I need to pay for SSL separately?', answer: 'Most modern hosting providers include free SSL certificates through Let\'s Encrypt. If your host charges extra for SSL, consider switching — free SSL is an industry standard and paid SSL only adds value for e-commerce sites needing extended validation certificates.' },
    ],
  },
  'ecommerce-profit': {
    title: 'E-commerce Profit Margin Calculator',
    description: 'Calculate your online store profit margins. Factor in product costs, platform fees, shipping, and marketing expenses.',
    metaTitle: 'E-commerce Profit Margin Calculator — Know Your True Margins',
    metaDescription: 'Free e-commerce profit calculator. Calculate true margins after platform fees, shipping costs, marketing spend, and payment processing.',
    category: 'ecommerce',
    howToSteps: [
      { name: 'Enter product selling price', text: 'Input the retail price at which you sell your product.' },
      { name: 'Add product cost and fees', text: 'Enter your cost of goods, platform fees, and payment processing fees.' },
      { name: 'Include shipping and marketing', text: 'Add average shipping cost per order and marketing cost per acquisition.' },
      { name: 'See your true margins', text: 'Review your net profit per unit, profit margin percentage, and break-even point.' },
    ],
    faqs: [
      { question: 'What is a good profit margin for e-commerce?', answer: 'A healthy e-commerce profit margin is 20-30% net after all costs. Luxury goods can achieve 40-60%, while commodity products may only reach 5-15%. The key is accurately calculating total costs including platform fees, shipping, returns, and marketing spend.' },
      { question: 'How do platform fees affect my margins?', answer: 'Platform fees typically range from 0% (self-hosted) to 2-5% per transaction (hosted platforms). A 2% platform fee on $100K annual revenue costs $2,000/year. Factor in payment processing fees (2.4-2.9% + $0.30/transaction) which apply regardless of platform.' },
      { question: 'Should I factor in return rates?', answer: 'Yes, returns directly impact profitability. E-commerce return rates average 20-30% for apparel and 5-15% for electronics. Include return shipping costs, restocking labor, and unsellable inventory in your margin calculations for accurate projections.' },
    ],
  },
  'ai-cost': {
    title: 'AI Tool Cost Estimator',
    description: 'Estimate monthly costs for AI tools based on your usage patterns. Compare API pricing, subscription tiers, and token costs.',
    metaTitle: 'AI Tool Cost Estimator — Calculate Your AI Spending',
    metaDescription: 'Free AI cost calculator. Estimate monthly spending on AI tools based on usage volume, API calls, and subscription tiers.',
    category: 'ai-tools',
    howToSteps: [
      { name: 'Select AI tool type', text: 'Choose the type of AI tool (chatbot, image generation, coding assistant, etc.).' },
      { name: 'Enter usage volume', text: 'Input your estimated monthly API calls, tokens used, or generations needed.' },
      { name: 'Select pricing tier', text: 'Choose between free tier, pro subscription, or enterprise API pricing.' },
      { name: 'Review cost breakdown', text: 'See your estimated monthly cost, cost per request, and annual projection.' },
    ],
    faqs: [
      { question: 'How much do AI tools cost per month?', answer: 'AI tool costs vary widely: free tiers are common for basic use, individual pro plans run $20-$100/month, and API-based pricing can range from $0.001 to $0.06 per 1K tokens. Enterprise plans with dedicated capacity typically start at $500/month.' },
      { question: 'Is API pricing or subscription pricing cheaper?', answer: 'For light to moderate use (under 100K API calls/month), subscriptions are usually cheaper since they include a fixed allocation. For heavy or variable usage, API pay-per-use can be more cost-effective as you only pay for what you consume.' },
      { question: 'How do I reduce AI tool costs?', answer: 'Use smaller, faster models for simple tasks and reserve premium models for complex work. Implement caching for repeated queries, batch API calls where possible, and monitor usage dashboards weekly. Switching to open-source models for non-critical workflows can cut costs by 50-80%.' },
    ],
  },
  'team-productivity': {
    title: 'Team Productivity Savings Calculator',
    description: 'Calculate how much time and money your team could save with better business tools. Factor in team size, hourly rates, and efficiency gains.',
    metaTitle: 'Team Productivity Calculator — Estimate Time & Cost Savings',
    metaDescription: 'Free team productivity calculator. Estimate annual savings from better tools based on team size, hourly rates, and automation potential.',
    category: 'business',
    howToSteps: [
      { name: 'Enter team size and rates', text: 'Input the number of team members and their average hourly rate.' },
      { name: 'Estimate time spent on tasks', text: 'Enter hours spent weekly on repetitive tasks that could be automated.' },
      { name: 'Set efficiency improvement', text: 'Estimate the percentage of time savings from better tools (typically 20-40%).' },
      { name: 'Review productivity savings', text: 'See your projected annual time savings, cost savings, and productivity ROI.' },
    ],
    faqs: [
      { question: 'How much time can better tools save my team?', answer: 'Teams using optimized tool stacks report saving 5-15 hours per person per week on average. The biggest gains come from automating data entry, streamlining communication, and eliminating duplicate work across disconnected systems.' },
      { question: 'What is the average ROI of business automation?', answer: 'Business process automation delivers an average ROI of 200-400% within the first year. Common high-ROI targets include invoice processing (60-80% time reduction), report generation (70-90% faster), and customer onboarding (40-60% faster).' },
      { question: 'How do I measure productivity improvements?', answer: 'Track time-to-completion for key workflows before and after tool adoption, monitor error rates, and measure employee satisfaction scores. Use the tool\'s built-in analytics where available, and survey team members quarterly about time saved on routine tasks.' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CALCULATORS).map((type) => ({ type }));
}

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const calc = CALCULATORS[type];
  if (!calc) return {};

  return {
    title: calc.metaTitle,
    description: calc.metaDescription,
    alternates: { canonical: `${SITE_URL}/calculators/${type}` },
    openGraph: {
      title: calc.metaTitle,
      description: calc.metaDescription,
      url: `${SITE_URL}/calculators/${type}`,
      siteName: SITE_NAME,
      type: 'website',
      locale: SEO.locale,
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO.twitterHandle,
      title: calc.metaTitle,
      description: calc.metaDescription,
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { type } = await params;
  const calc = CALCULATORS[type];
  if (!calc) notFound();

  const allCalcs = Object.entries(CALCULATORS)
    .filter(([key]) => key !== type)
    .map(([key, val]) => ({ slug: key, ...val }));

  const cat = CATEGORIES[calc.category];
  const catName = cat?.name || calc.category;
  const subcategories = SUBCATEGORIES[calc.category] || [];
  const relatedGlossaryTerms = getGlossaryTermsForCalculator(type);

  const howToSchema = generateCalculatorHowToSchema(
    calc.title,
    calc.description,
    type,
    calc.howToSteps
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: catName, url: `/${calc.category}` },
    { name: calc.title, url: `/calculators/${type}` },
  ]);
  const webAppSchema = generateWebApplicationSchema(
    calc.title,
    calc.description,
    type,
    catName
  );
  const faqSchema = generateFAQSchema(calc.faqs);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumbs items={[
        { name: 'Home', url: '/' },
        { name: catName, url: `/${calc.category}` },
        { name: calc.title, url: '' },
      ]} />

      {/* Hero — Premium glassmorphism */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-indigo-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10 mt-6 mb-8 text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
            </svg>
            Free Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            <span className="gradient-text">{calc.title}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {calc.description}
          </p>
        </div>
      </div>

      {/* Calculator Component */}
      <div className="glass rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <CalculatorClient type={type} />
      </div>

      {/* FAQ Section — FAQPage schema for rich snippets */}
      {calc.faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <FAQSection faqs={calc.faqs} />
        </section>
      )}

      {/* Ad: After FAQ */}
      <AdBanner />

      {/* Other Calculators */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6">More Free Calculators</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allCalcs.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 hover-lift transition-all"
            >
              <h3 className="font-semibold text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Key Terms — Glossary cross-links for topical authority */}
      {relatedGlossaryTerms.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-2">Key Terms to Know</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Understand the concepts behind this calculator.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedGlossaryTerms.map((gt) => (
              <Link
                key={gt.slug}
                href={`/glossary/${gt.slug}`}
                className="group p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                      {gt.term}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{gt.definition}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ad: Before Category Links */}
      <AdInArticle />

      {/* Related Resources — Hub-and-spoke links for SEO equity */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Explore {catName}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href={`/${calc.category}`}
            className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center text-lg">&#128202;</div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors">All {catName}</h3>
              <p className="text-[11px] text-gray-400">Reviews, ratings &amp; comparisons</p>
            </div>
          </Link>
          <Link
            href={`/${calc.category}/compare`}
            className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center text-lg">&#9878;</div>
            <div>
              <h3 className="font-semibold text-sm group-hover:text-purple-600 transition-colors">{catName} Comparisons</h3>
              <p className="text-[11px] text-gray-400">Side-by-side feature analysis</p>
            </div>
          </Link>
          {subcategories.slice(0, 4).map((sub) => (
            <Link
              key={sub.slug}
              href={`/best/${sub.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center text-lg">&#127942;</div>
              <div>
                <h3 className="font-semibold text-sm group-hover:text-amber-600 transition-colors">Best {sub.name}</h3>
                <p className="text-[11px] text-gray-400">Top-ranked picks for {new Date().getFullYear()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
