import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllToolSlugs, getRelatedLinks } from '@/lib/data';
import { generateToolSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { CATEGORIES, SITE_URL, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { FAQSection } from '@/components/common/FAQSection';
import type { FAQ } from '@/types';

// ============================================================
// PRICING PAGE — "{Tool} Pricing" keyword targeting
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllToolSlugs();
  return slugs.slice(0, 200).map(({ categorySlug, toolSlug }) => ({
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
  const title = `${tool.name} Pricing Plans & Costs (${year})${SEO.titleSuffix}`;
  const description = `Compare ${tool.name} pricing plans, costs, and features. See free plan details, trial options, and find the best plan for your budget in ${year}.`;

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

  // --- Generate dynamic FAQ answers ---
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

  // --- Schemas ---
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

      <article className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { name: 'Home', url: '/' },
          { name: cat?.name || category, url: `/${category}` },
          { name: tool.name, url: `/${category}/${toolSlug}` },
          { name: 'Pricing', url: '' },
        ]} />

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
          {tool.name} Pricing Plans &amp; Costs ({year})
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          A complete breakdown of {tool.name} pricing, plans, and what you get at each tier.
          Find the right plan for your needs and budget.
        </p>

        {/* Quick Summary */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-10">
          <h2 className="font-semibold mb-4">Quick Pricing Overview</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {hasFree && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                Free Plan Available
              </span>
            )}
            {startingPrice !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                From ${startingPrice}/mo
              </span>
            )}
            {freeTrialDays !== null && freeTrialDays > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                {freeTrialDays}-Day Free Trial
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-medium">
              Value: {tool.ratings.valueForMoney.toFixed(1)}/10
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {plans.length > 0 ? (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6">{tool.name} Plans Comparison</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    plan.isPopular
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-100 dark:shadow-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:border-blue-200 dark:hover:border-blue-600 transition-colors`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {plan.price !== null ? (
                      <>
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                          /{plan.billingCycle === 'yearly' ? 'year' : plan.billingCycle === 'one-time' ? 'one-time' : 'mo'}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tool.websiteUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`block text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                      plan.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-14">
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                Detailed plan information for {tool.name} is not yet available.
              </p>
              <Link
                href={tool.websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-blue-600 hover:underline"
              >
                Visit {tool.name} website for pricing details
              </Link>
            </div>
          </section>
        )}

        {/* Pricing FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6">{tool.name} Pricing FAQ</h2>
          <FAQSection faqs={faqs} />
        </section>

        {/* Compare Pricing CTA */}
        <section className="mb-14">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Compare {tool.name} Pricing with Alternatives</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              See how {tool.name} pricing stacks up against similar tools in the market.
            </p>
            <Link
              href={`/${category}/${toolSlug}/alternatives`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Compare {tool.name} Pricing with Alternatives
            </Link>
          </div>
        </section>

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
