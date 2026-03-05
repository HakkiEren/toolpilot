import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks } from '@/lib/data';
import { generateToolSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SITE_URL, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { FAQSection } from '@/components/common/FAQSection';
import { AdBanner, AdInArticle, AdMultiplex } from '@/components/ads/AdSlot';
import { ToolLogo } from '@/components/common/ToolLogo';
import type { FAQ } from '@/types';

// ============================================================
// PRICING PAGE — ENHANCED with visual comparison, value meter
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

  const year = new Date().getFullYear();
  const plans = tool.pricing.plans || [];
  const planCount = plans.length;
  const priceRange = plans.filter(p => p.price !== null && p.price > 0).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const title = `${tool.name} Pricing Plans & Costs (${year})${SEO.titleSuffix}`;
  const description = `${tool.name} pricing: ${planCount} plans${tool.pricing.hasFreeplan ? ' (free plan available)' : ''}${priceRange.length >= 2 ? `, $${priceRange[0].price}-$${priceRange[priceRange.length - 1].price}/mo` : priceRange.length === 1 ? `, from $${priceRange[0].price}/mo` : ''}. Value score: ${tool.ratings.valueForMoney.toFixed(1)}/10. Compare costs, features per tier, and hidden fees.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${category}/${toolSlug}/pricing` },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  if (!tool) notFound();

  const cat = CATEGORIES[category];
  const year = new Date().getFullYear();
  const relatedLinks = await getRelatedLinks(tool);

  const { pricing } = tool;
  const plans = pricing.plans || [];
  const hasFree = pricing.hasFreeplan;
  const startingPrice = pricing.startingPrice;
  const freeTrialDays = pricing.freeTrialDays;
  const cheapestPlan = plans.filter((p) => p.price !== null).sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
  const mostExpensivePlan = plans.filter((p) => p.price !== null).sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
  const hasEnterprise = plans.some((p) => p.price === null);

  // Value score color
  const valueScore = tool.ratings.valueForMoney;
  const valueColor = valueScore >= 8 ? 'text-green-600' : valueScore >= 6 ? 'text-yellow-600' : 'text-red-500';
  const valueBg = valueScore >= 8 ? 'bg-green-500' : valueScore >= 6 ? 'bg-yellow-500' : 'bg-red-500';
  const valueLabel = valueScore >= 8 ? 'Excellent Value' : valueScore >= 6 ? 'Good Value' : 'Below Average';

  // Generate dynamic FAQs
  const faqs: FAQ[] = [
    {
      question: `Does ${tool.name} have a free plan?`,
      answer: hasFree
        ? `Yes, ${tool.name} offers a free plan that you can use without any payment. This makes it easy to test the platform before upgrading to a paid tier.`
        : `No, ${tool.name} does not currently offer a free plan. However, ${freeTrialDays ? `they do provide a ${freeTrialDays}-day free trial so you can evaluate the platform before committing.` : `their paid plans start at $${startingPrice}/mo which is competitive for the features offered.`}`,
    },
    {
      question: `What's the cheapest ${tool.name} plan?`,
      answer: cheapestPlan
        ? `The most affordable ${tool.name} plan is the ${cheapestPlan.name} plan at $${cheapestPlan.price}/${cheapestPlan.billingCycle === 'yearly' ? 'year' : cheapestPlan.billingCycle === 'one-time' ? 'one-time' : 'month'}. ${cheapestPlan.features.length > 0 ? `It includes ${cheapestPlan.features.slice(0, 3).join(', ')}.` : ''}`
        : hasFree
          ? `${tool.name} offers a free plan at no cost. This is the most budget-friendly option to get started.`
          : `Contact ${tool.name} directly for current pricing details and available plans.`,
    },
    {
      question: `Does ${tool.name} offer a free trial?`,
      answer: freeTrialDays
        ? `Yes, ${tool.name} offers a ${freeTrialDays}-day free trial. This gives you enough time to explore the features and determine if it meets your needs before subscribing to a paid plan.`
        : hasFree
          ? `${tool.name} doesn't offer a traditional free trial, but they do have a free plan you can use indefinitely to test the platform.`
          : `${tool.name} does not currently advertise a free trial. Check their website for the latest offers and promotions.`,
    },
    {
      question: `Is ${tool.name} worth the price?`,
      answer: `With an overall rating of ${tool.ratings.overall.toFixed(1)}/10 and a value-for-money score of ${tool.ratings.valueForMoney.toFixed(1)}/10 based on ${tool.ratings.reviewCount} reviews, ${tool.ratings.valueForMoney >= 7 ? `${tool.name} is generally considered a good value for what it offers.` : tool.ratings.valueForMoney >= 5 ? `${tool.name} provides decent value, though some users feel there are more cost-effective alternatives.` : `${tool.name} may be on the pricier side for some users. Consider comparing with alternatives to find the best fit for your budget.`}`,
    },
    {
      question: `Are there any ${tool.name} discounts?`,
      answer: plans.some((p) => p.billingCycle === 'yearly')
        ? `Yes, ${tool.name} typically offers discounts on annual billing. By choosing a yearly plan instead of monthly, you can save significantly over the course of a year. Check their pricing page for the latest discount details.`
        : `${tool.name} may offer periodic discounts or promotions. Visit their official website to check for current deals, seasonal offers, or educational/startup discounts.`,
    },
  ];

  // Schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: cat?.name || category, url: `/${category}` },
    { name: tool.name, url: `/${category}/${toolSlug}` },
    { name: 'Pricing', url: `/${category}/${toolSlug}/pricing` },
  ]);
  const toolSchema = generateToolSchema(tool, cat?.name || category);
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <article className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: `/${category}/${toolSlug}` },
          { name: 'Pricing', url: '' },
        ]} />

        {/* ========== PRICING HERO ========== */}
        <div className="mt-6 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={56} className="shadow-sm" priority />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {tool.name} Pricing Plans ({year})
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Complete pricing breakdown and plan comparison
              </p>
            </div>
          </div>
        </div>

        {/* ========== PRICING SNAPSHOT ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass rounded-2xl p-5 text-center shadow-sm card-animate" style={{ animationDelay: '0ms' }}>
            <div className="text-3xl mb-2">{hasFree ? '\u2705' : '\u274C'}</div>
            <div className="text-sm font-semibold">{hasFree ? 'Free Plan' : 'No Free Plan'}</div>
            <div className="text-xs text-gray-400 mt-1">{hasFree ? 'Available' : 'Paid only'}</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center shadow-sm card-animate" style={{ animationDelay: '100ms' }}>
            <div className="text-2xl font-black text-blue-600 mb-1">
              {startingPrice !== null ? `$${startingPrice}` : 'Custom'}
            </div>
            <div className="text-sm font-semibold">Starting Price</div>
            <div className="text-xs text-gray-400 mt-1">{startingPrice !== null ? 'per month' : 'Contact sales'}</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center shadow-sm card-animate" style={{ animationDelay: '200ms' }}>
            <div className="text-2xl font-black text-purple-600 mb-1">
              {freeTrialDays ? `${freeTrialDays}d` : 'N/A'}
            </div>
            <div className="text-sm font-semibold">Free Trial</div>
            <div className="text-xs text-gray-400 mt-1">{freeTrialDays ? `${freeTrialDays} days` : 'Not available'}</div>
          </div>
          <div className="glass rounded-2xl p-5 text-center shadow-sm card-animate" style={{ animationDelay: '300ms' }}>
            <div className="text-2xl font-black mb-1">{plans.length}</div>
            <div className="text-sm font-semibold">Plans Available</div>
            <div className="text-xs text-gray-400 mt-1">{hasEnterprise ? 'Incl. Enterprise' : 'Standard plans'}</div>
          </div>
        </div>

        {/* ========== VALUE FOR MONEY METER ========== */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                  <circle
                    cx="40" cy="40" r="35" fill="none" strokeWidth="6"
                    strokeDasharray={`${(valueScore / 10) * 220} 220`}
                    strokeLinecap="round"
                    className={valueBg}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xl font-black ${valueColor}`}>
                  {valueScore.toFixed(1)}
                </span>
              </div>
              <div>
                <div className={`text-lg font-bold ${valueColor}`}>{valueLabel}</div>
                <div className="text-sm text-gray-500">Value for Money Score</div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-bold">{tool.ratings.overall.toFixed(1)}/10</div>
                <div className="text-xs text-gray-400">Overall Rating</div>
              </div>
              <div>
                <div className="text-sm font-bold">{tool.ratings.features.toFixed(1)}/10</div>
                <div className="text-xs text-gray-400">Features Score</div>
              </div>
              <div>
                <div className="text-sm font-bold">{tool.ratings.support.toFixed(1)}/10</div>
                <div className="text-xs text-gray-400">Support Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PRICING CARDS ========== */}
        {plans.length > 0 ? (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Plans Comparison</h2>
            <div className={`grid gap-6 ${plans.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2' : plans.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl border p-6 flex flex-col bg-white dark:bg-gray-900 hover-lift ${
                    plan.isPopular
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/20 ring-1 ring-blue-500/20'
                      : 'border-gray-200 dark:border-gray-700'
                  } transition-all card-animate`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1 mt-1">{plan.name}</h3>

                  <div className="mb-5">
                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">${plan.price}</span>
                        <span className="text-gray-400 text-sm">
                          /{plan.billingCycle === 'yearly' ? 'yr' : plan.billingCycle === 'one-time' ? 'once' : 'mo'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-black">Custom</span>
                    )}
                    {plan.billingCycle === 'yearly' && plan.price !== null && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        &#8776; ${(plan.price / 12).toFixed(0)}/mo billed annually
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tool.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className={`block text-center py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Get {plan.name} {plan.price === 0 ? '(Free)' : ''}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-14">
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-4xl mb-3">&#128176;</div>
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                Detailed plan information for {tool.name} is not yet available.
              </p>
              <Link
                href={tool.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
              >
                Visit {tool.name} for pricing &#8599;
              </Link>
            </div>
          </section>
        )}

        {/* ========== PLAN COMPARISON TABLE ========== */}
        {plans.length >= 2 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6">Plan Feature Comparison</h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3 px-5 text-left font-semibold text-gray-600 dark:text-gray-300">Feature</th>
                    {plans.map((plan, idx) => (
                      <th key={idx} className="py-3 px-5 text-center font-semibold">
                        <div>{plan.name}</div>
                        <div className="text-xs font-normal text-gray-400 mt-0.5">
                          {plan.price !== null ? (plan.price === 0 ? 'Free' : `$${plan.price}/mo`) : 'Custom'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Collect all unique features */}
                  {getAllUniqueFeatures(plans).map((feature, fIdx) => (
                    <tr key={fIdx} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-5 text-gray-600 dark:text-gray-300">{feature}</td>
                      {plans.map((plan, pIdx) => (
                        <td key={pIdx} className="py-3 px-5 text-center">
                          {plan.features.includes(feature) ? (
                            <span className="text-green-500 font-bold">&#10003;</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">&#8212;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========== PRICING SUMMARY BOX ========== */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">{tool.name} Pricing Summary</h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Free Plan</span>
                  <span className={`text-sm font-bold ${hasFree ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasFree ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Starting Price</span>
                  <span className="text-sm font-bold">
                    {startingPrice !== null ? `$${startingPrice}/mo` : 'Custom pricing'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Free Trial</span>
                  <span className="text-sm font-bold">
                    {freeTrialDays ? `${freeTrialDays} days` : 'Not available'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Number of Plans</span>
                  <span className="text-sm font-bold">{plans.length}</span>
                </div>
              </div>
              <div className="space-y-3">
                {cheapestPlan && (
                  <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Cheapest Paid Plan</span>
                    <span className="text-sm font-bold">{cheapestPlan.name} (${cheapestPlan.price}/mo)</span>
                  </div>
                )}
                {mostExpensivePlan && mostExpensivePlan !== cheapestPlan && (
                  <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Premium Plan</span>
                    <span className="text-sm font-bold">{mostExpensivePlan.name} (${mostExpensivePlan.price}/mo)</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-blue-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Enterprise Option</span>
                  <span className={`text-sm font-bold ${hasEnterprise ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasEnterprise ? 'Available' : 'Not available'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Value Rating</span>
                  <span className={`text-sm font-bold ${valueColor}`}>
                    {valueScore.toFixed(1)}/10 ({valueLabel})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== AD: AFTER PLANS ========== */}
        <AdBanner />

        {/* ========== HIDDEN COSTS TO WATCH ========== */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">Hidden Costs to Watch</h2>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-amber-200 dark:border-gray-700 p-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              Beyond the sticker price, here are potential additional costs to factor into your {tool.name} budget:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: '\u{1F4B3}',
                  title: 'Per-User Scaling',
                  description: `As your team grows, ${tool.name}'s per-seat pricing can add up quickly. ${startingPrice && plans.length >= 2 ? `Going from 5 to 25 users on the ${plans.find(p => p.isPopular)?.name || 'standard'} plan could mean $${((plans.find(p => p.isPopular)?.price || startingPrice) * 25).toFixed(0)}/mo.` : 'Calculate your total cost at full team size before committing.'}`,
                },
                {
                  icon: '\u{1F50C}',
                  title: 'Integration Add-ons',
                  description: `Some integrations and premium connectors may require higher-tier plans or separate subscriptions. Check which integrations are available on your chosen plan level.`,
                },
                {
                  icon: '\u{1F4CA}',
                  title: 'Usage Overages',
                  description: `Watch for limits on storage, API calls, or monthly active users. Exceeding plan limits may trigger automatic upgrades or overage charges.`,
                },
                {
                  icon: '\u{1F393}',
                  title: 'Onboarding & Training',
                  description: `${hasEnterprise ? 'Enterprise plans typically include dedicated onboarding, but' : 'Most plans don\'t include dedicated onboarding, so'} factor in the time and cost of training your team to use ${tool.name} effectively.`,
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/70 dark:bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== PRICING CONTEXT ========== */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">How Does {tool.name} Pricing Compare?</h2>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">$</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Market Positioning</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {startingPrice !== null && startingPrice <= 15
                      ? `At $${startingPrice}/mo starting price, ${tool.name} is positioned in the budget-friendly segment of the ${cat?.name || category} market. This makes it accessible for freelancers and small teams testing the waters.`
                      : startingPrice !== null && startingPrice <= 50
                        ? `With plans starting at $${startingPrice}/mo, ${tool.name} sits in the mid-range of the ${cat?.name || category} market. This pricing targets growing teams who need professional-grade features without enterprise-level costs.`
                        : startingPrice !== null
                          ? `Starting at $${startingPrice}/mo, ${tool.name} is positioned as a premium solution in the ${cat?.name || category} space. This reflects its enterprise-grade feature set and is best suited for teams who need advanced capabilities.`
                          : `${tool.name} uses custom pricing, which is typical for enterprise-focused ${cat?.name || category} solutions. Contact their sales team for a quote tailored to your specific needs.`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Price-to-Feature Ratio</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {tool.ratings.valueForMoney >= 8
                      ? `With a ${tool.ratings.valueForMoney.toFixed(1)}/10 value score, ${tool.name} delivers more features per dollar than most competitors. Users consistently rate it as offering excellent bang for the buck.`
                      : tool.ratings.valueForMoney >= 6
                        ? `${tool.name}'s ${tool.ratings.valueForMoney.toFixed(1)}/10 value score puts it on par with market averages. You're getting fair value, though some competitors may offer more aggressive pricing.`
                        : `At ${tool.ratings.valueForMoney.toFixed(1)}/10 for value, ${tool.name} is considered somewhat expensive for what it offers. Consider whether the specific features justify the premium over lower-cost alternatives.`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-sm font-bold">&#8593;</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Upgrade Path</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {plans.length >= 3
                      ? `${tool.name} offers ${plans.length} distinct tiers, giving you room to scale as your needs evolve. ${hasFree ? 'Starting from the free plan, you can gradually upgrade' : 'You can start with the entry-level plan and upgrade'} without switching platforms — a significant advantage over competitors with limited plan options.`
                      : plans.length === 2
                        ? `With ${plans.length} plans available, ${tool.name} keeps things simple. You won't be overwhelmed by choice, but make sure the upgrade path covers your growth needs for the next 12-24 months.`
                        : `${tool.name} offers a single plan structure, which simplifies decision-making but limits flexibility as your needs change.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link
                href={`/${category}/${toolSlug}/alternatives`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                &#8594; Compare {tool.name} pricing with alternatives
              </Link>
            </div>
          </div>
        </section>

        {/* ========== AD: BEFORE FAQ ========== */}
        <AdInArticle />

        {/* ========== PRICING FAQ ========== */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">{tool.name} Pricing FAQ</h2>
          <FAQSection faqs={faqs} />
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="mb-14">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Ready to try {tool.name}?</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
              {hasFree
                ? `Start with ${tool.name}'s free plan and upgrade when you're ready.`
                : freeTrialDays
                  ? `Try ${tool.name} free for ${freeTrialDays} days. No commitment required.`
                  : `Visit ${tool.name} to explore their plans and find the best fit.`}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={tool.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="glow-pulse inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-purple-700 shadow-md transition-all"
              >
                Visit {tool.name} &#8599;
              </Link>
              <Link
                href={`/${category}/${toolSlug}/alternatives`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Compare Alternatives
              </Link>
              <Link
                href={`/${category}/${toolSlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Full Review
              </Link>
            </div>
          </div>
        </section>

        {/* ========== AD: BEFORE RELATED LINKS ========== */}
        <AdMultiplex />

        {/* Related Links */}
        {relatedLinks.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xl font-bold mb-4">Related Resources</h2>
            <RelatedLinks links={relatedLinks} />
          </section>
        )}

        {/* Last Updated */}
        <div className="text-sm text-gray-400 mt-12">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </article>
    </>
  );
}

// Helper: get all unique features across all plans
function getAllUniqueFeatures(plans: { features: string[] }[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const plan of plans) {
    for (const f of plan.features) {
      if (!seen.has(f)) {
        seen.add(f);
        result.push(f);
      }
    }
  }
  return result;
}
