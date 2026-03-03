import type { Tool } from '@/types';

interface Props {
  toolA: Tool;
  toolB: Tool;
}

export function PriceCompare({ toolA, toolB }: Props) {
  const maxPlans = Math.max(
    toolA.pricing.plans.length,
    toolB.pricing.plans.length
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PricingCard tool={toolA} />
      <PricingCard tool={toolB} />

      {/* Quick Summary */}
      <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="font-semibold mb-3">Pricing Summary</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Free Plan:</span>
            <div className="font-medium mt-1">
              {toolA.name}: {toolA.pricing.hasFreeplan ? '✅ Yes' : '❌ No'} |{' '}
              {toolB.name}: {toolB.pricing.hasFreeplan ? '✅ Yes' : '❌ No'}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Starting Price:</span>
            <div className="font-medium mt-1">
              {toolA.name}: {formatPrice(toolA.pricing.startingPrice)} |{' '}
              {toolB.name}: {formatPrice(toolB.pricing.startingPrice)}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Free Trial:</span>
            <div className="font-medium mt-1">
              {toolA.name}: {toolA.pricing.freeTrialDays ? `${toolA.pricing.freeTrialDays} days` : 'None'} |{' '}
              {toolB.name}: {toolB.pricing.freeTrialDays ? `${toolB.pricing.freeTrialDays} days` : 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tool }: { tool: Tool }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        {tool.logoUrl && (
          <img src={tool.logoUrl} alt={`${tool.name} logo`} className="w-8 h-8 rounded" loading="lazy" />
        )}
        <h3 className="text-lg font-semibold">{tool.name}</h3>
      </div>

      {tool.pricing.hasFreeplan && (
        <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded mb-3">
          Free Plan Available
        </div>
      )}

      <div className="space-y-3">
        {tool.pricing.plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              plan.isPopular
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{plan.name}</span>
              <span className="font-bold">
                {plan.price === null
                  ? 'Custom'
                  : plan.price === 0
                  ? 'Free'
                  : `$${plan.price}/mo`}
              </span>
            </div>
            {plan.isPopular && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Most Popular</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Custom';
  if (price === 0) return 'Free';
  return `$${price}/mo`;
}
