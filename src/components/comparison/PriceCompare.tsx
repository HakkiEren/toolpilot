import type { Tool } from '@/types';
import { ToolLogo } from '@/components/common/ToolLogo';

interface Props {
  toolA: Tool;
  toolB: Tool;
}

export function PriceCompare({ toolA, toolB }: Props) {
  const priceWinner = getPriceWinner(toolA, toolB);

  return (
    <div className="space-y-6">
      {/* Pricing Comparison Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="py-3 px-5 text-left font-semibold text-gray-600 dark:text-gray-300 w-1/3">Pricing Feature</th>
              <th className="py-3 px-5 text-center font-semibold text-blue-700 dark:text-blue-400">{toolA.name}</th>
              <th className="py-3 px-5 text-center font-semibold text-purple-700 dark:text-purple-400">{toolB.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100 dark:border-gray-800">
              <td className="py-3 px-5 font-medium">Free Plan</td>
              <td className="py-3 px-5 text-center">
                <span className={toolA.pricing.hasFreeplan ? 'text-green-600 font-semibold' : 'text-red-400'}>
                  {toolA.pricing.hasFreeplan ? '\u2713 Yes' : '\u2717 No'}
                </span>
              </td>
              <td className="py-3 px-5 text-center">
                <span className={toolB.pricing.hasFreeplan ? 'text-green-600 font-semibold' : 'text-red-400'}>
                  {toolB.pricing.hasFreeplan ? '\u2713 Yes' : '\u2717 No'}
                </span>
              </td>
            </tr>
            <tr className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              <td className="py-3 px-5 font-medium">Starting Price</td>
              <td className="py-3 px-5 text-center font-semibold">{formatPrice(toolA.pricing.startingPrice)}</td>
              <td className="py-3 px-5 text-center font-semibold">{formatPrice(toolB.pricing.startingPrice)}</td>
            </tr>
            <tr className="border-t border-gray-100 dark:border-gray-800">
              <td className="py-3 px-5 font-medium">Free Trial</td>
              <td className="py-3 px-5 text-center">
                {toolA.pricing.freeTrialDays ? (
                  <span className="text-green-600 font-medium">{toolA.pricing.freeTrialDays} days</span>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </td>
              <td className="py-3 px-5 text-center">
                {toolB.pricing.freeTrialDays ? (
                  <span className="text-green-600 font-medium">{toolB.pricing.freeTrialDays} days</span>
                ) : (
                  <span className="text-gray-400">Not available</span>
                )}
              </td>
            </tr>
            <tr className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
              <td className="py-3 px-5 font-medium">Number of Plans</td>
              <td className="py-3 px-5 text-center">{toolA.pricing.plans.length}</td>
              <td className="py-3 px-5 text-center">{toolB.pricing.plans.length}</td>
            </tr>
            <tr className="border-t border-gray-100 dark:border-gray-800">
              <td className="py-3 px-5 font-medium">Value Rating</td>
              <td className="py-3 px-5 text-center">
                <span className="font-bold">{toolA.ratings.valueForMoney.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">/10</span>
              </td>
              <td className="py-3 px-5 text-center">
                <span className="font-bold">{toolB.ratings.valueForMoney.toFixed(1)}</span>
                <span className="text-gray-400 text-xs">/10</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Plan-by-Plan Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <PricingCard tool={toolA} accentColor="blue" />
        <PricingCard tool={toolB} accentColor="purple" />
      </div>

      {/* Price Winner */}
      {priceWinner && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-5 border border-green-200 dark:border-green-800/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#128176;</span>
            <div>
              <span className="font-semibold text-green-700 dark:text-green-400">Best Value: </span>
              <span className="font-bold text-green-800 dark:text-green-300">{priceWinner}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                Based on starting price and value-for-money rating
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingCard({ tool, accentColor }: { tool: Tool; accentColor: 'blue' | 'purple' }) {
  const borderClass = accentColor === 'blue' ? 'border-blue-200 dark:border-blue-800/30' : 'border-purple-200 dark:border-purple-800/30';
  const headerBg = accentColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20';
  const textColor = accentColor === 'blue' ? 'text-blue-700 dark:text-blue-400' : 'text-purple-700 dark:text-purple-400';

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border ${borderClass} overflow-hidden`}>
      <div className={`${headerBg} px-5 py-3`}>
        <div className="flex items-center gap-3">
          <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
          <h3 className={`text-lg font-semibold ${textColor}`}>{tool.name} Plans</h3>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {tool.pricing.plans.length > 0 ? (
          tool.pricing.plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                plan.isPopular
                  ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{plan.name}</span>
                  {plan.isPopular && (
                    <span className="ml-2 text-[10px] font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                      POPULAR
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold">
                  {plan.price === null ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                  {plan.price !== null && plan.price > 0 && (
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                  )}
                </span>
              </div>
              {plan.features.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5">\u2713</span>
                      {f}
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-xs text-gray-400">+{plan.features.length - 4} more</li>
                  )}
                </ul>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            Plan details not yet available
          </div>
        )}
      </div>
    </div>
  );
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Custom';
  if (price === 0) return 'Free';
  return `$${price}/mo`;
}

function getPriceWinner(toolA: Tool, toolB: Tool): string | null {
  const aValue = toolA.ratings.valueForMoney;
  const bValue = toolB.ratings.valueForMoney;
  if (aValue === bValue) return null;
  return aValue > bValue ? toolA.name : toolB.name;
}
