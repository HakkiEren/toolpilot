import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
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
}> = {
  'roi': {
    title: 'SaaS ROI Calculator',
    description: 'Calculate the return on investment for switching to a new SaaS tool. Compare costs, time savings, and productivity gains.',
    metaTitle: 'SaaS ROI Calculator — Calculate Your Software Investment Returns',
    metaDescription: 'Free SaaS ROI calculator. Estimate how much time and money you can save by switching tools. Compare costs vs benefits instantly.',
    category: 'saas',
  },
  'email-marketing-roi': {
    title: 'Email Marketing ROI Calculator',
    description: 'Calculate the potential return on investment for your email marketing campaigns. Factor in list size, open rates, and conversion rates.',
    metaTitle: 'Email Marketing ROI Calculator — Measure Campaign Returns',
    metaDescription: 'Free email marketing ROI calculator. Estimate revenue from your email campaigns based on list size, open rates, and conversions.',
    category: 'marketing',
  },
  'hosting-cost': {
    title: 'Web Hosting Cost Calculator',
    description: 'Compare hosting costs across providers. Factor in traffic, storage, bandwidth, and features to find the most cost-effective option.',
    metaTitle: 'Web Hosting Cost Calculator — Compare Provider Pricing',
    metaDescription: 'Free web hosting cost calculator. Compare monthly costs across hosting providers based on your traffic, storage, and feature needs.',
    category: 'hosting',
  },
  'ecommerce-profit': {
    title: 'E-commerce Profit Margin Calculator',
    description: 'Calculate your online store profit margins. Factor in product costs, platform fees, shipping, and marketing expenses.',
    metaTitle: 'E-commerce Profit Margin Calculator — Know Your True Margins',
    metaDescription: 'Free e-commerce profit calculator. Calculate true margins after platform fees, shipping costs, marketing spend, and payment processing.',
    category: 'ecommerce',
  },
  'ai-cost': {
    title: 'AI Tool Cost Estimator',
    description: 'Estimate monthly costs for AI tools based on your usage patterns. Compare API pricing, subscription tiers, and token costs.',
    metaTitle: 'AI Tool Cost Estimator — Calculate Your AI Spending',
    metaDescription: 'Free AI cost calculator. Estimate monthly spending on AI tools based on usage volume, API calls, and subscription tiers.',
    category: 'ai-tools',
  },
  'team-productivity': {
    title: 'Team Productivity Savings Calculator',
    description: 'Calculate how much time and money your team could save with better business tools. Factor in team size, hourly rates, and efficiency gains.',
    metaTitle: 'Team Productivity Calculator — Estimate Time & Cost Savings',
    metaDescription: 'Free team productivity calculator. Estimate annual savings from better tools based on team size, hourly rates, and automation potential.',
    category: 'business',
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
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { type } = await params;
  const calc = CALCULATORS[type];
  if (!calc) notFound();

  const allCalcs = Object.entries(CALCULATORS)
    .filter(([key]) => key !== type)
    .map(([key, val]) => ({ slug: key, ...val }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { name: 'Home', url: '/' },
        { name: 'Calculators', url: '/calculators/roi' },
        { name: calc.title, url: '' },
      ]} />

      <div className="mt-6 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold gradient-text mb-4">
          {calc.title}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {calc.description}
        </p>
      </div>

      {/* Calculator Component */}
      <div className="glass rounded-3xl p-6 md:p-8 mb-12">
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
