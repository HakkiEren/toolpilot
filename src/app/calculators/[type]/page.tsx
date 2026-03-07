import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, SEO } from '@/lib/constants';
import { generateCalculatorHowToSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
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

  const howToSchema = generateCalculatorHowToSchema(
    calc.title,
    calc.description,
    type,
    calc.howToSteps
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Calculators', url: '/calculators/roi' },
    { name: calc.title, url: `/calculators/${type}` },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Breadcrumbs items={[
        { name: 'Home', url: '/' },
        { name: 'Calculators', url: '/calculators/roi' },
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

      {/* Ad: After Calculator */}
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

      {/* Ad: Before Category Link */}
      <AdInArticle />

      {/* Category Link */}
      <div className="text-center">
        <Link
          href={`/${calc.category}`}
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          Browse {calc.category === 'ai-tools' ? 'AI Tools' : calc.category === 'saas' ? 'SaaS Tools' : calc.category === 'ecommerce' ? 'E-commerce' : calc.category === 'marketing' ? 'Marketing Tools' : calc.category === 'hosting' ? 'Web Hosting' : 'Business Tools'} →
        </Link>
      </div>
    </div>
  );
}
