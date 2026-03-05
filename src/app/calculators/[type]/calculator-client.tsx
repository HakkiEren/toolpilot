'use client';

import { useState } from 'react';

interface CalcResult {
  label: string;
  value: string;
  highlight?: boolean;
}

// ============================================================
// Calculator Client Component — Interactive calculators
// ============================================================

export function CalculatorClient({ type }: { type: string }) {
  switch (type) {
    case 'roi':
      return <ROICalculator />;
    case 'email-marketing-roi':
      return <EmailROICalculator />;
    case 'hosting-cost':
      return <HostingCostCalculator />;
    case 'ecommerce-profit':
      return <EcommerceProfitCalculator />;
    case 'ai-cost':
      return <AICostCalculator />;
    case 'team-productivity':
      return <TeamProductivityCalculator />;
    default:
      return <ROICalculator />;
  }
}

function ResultsDisplay({ results, title }: { results: CalcResult[]; title: string }) {
  if (results.length === 0) return null;
  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {results.map((r) => (
          <div key={r.label} className={`p-4 rounded-xl ${r.highlight ? 'bg-white dark:bg-gray-900 shadow-sm border border-blue-200 dark:border-blue-700' : 'bg-white/50 dark:bg-gray-900/50'}`}>
            <div className="text-xs text-gray-500 mb-1">{r.label}</div>
            <div className={`text-xl font-bold ${r.highlight ? 'gradient-text' : ''}`}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, prefix, suffix, min, max, step, type = 'number' }: {
  label: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center">
        {prefix && <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-sm text-gray-500">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step || 1}
          className={`w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 ${prefix ? '' : 'rounded-l-xl'} ${suffix ? '' : 'rounded-r-xl'} bg-white dark:bg-gray-900 focus:border-blue-500 outline-none transition-colors`}
        />
        {suffix && <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl text-sm text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

function ROICalculator() {
  const [currentCost, setCurrentCost] = useState(500);
  const [newCost, setNewCost] = useState(200);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [efficiencyGain, setEfficiencyGain] = useState(30);

  const annualSoftwareSaving = (currentCost - newCost) * 12;
  const weeklyTimeSaved = hoursPerWeek * (efficiencyGain / 100);
  const annualTimeSaving = weeklyTimeSaved * 52 * hourlyRate;
  const totalAnnualSaving = annualSoftwareSaving + annualTimeSaving;
  const roi = newCost > 0 ? ((totalAnnualSaving / (newCost * 12)) * 100) : 0;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="Current tool monthly cost" value={currentCost} onChange={setCurrentCost} prefix="$" />
        <InputField label="New tool monthly cost" value={newCost} onChange={setNewCost} prefix="$" />
        <InputField label="Hours spent per week using tool" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs" />
        <InputField label="Your hourly rate" value={hourlyRate} onChange={setHourlyRate} prefix="$" />
        <InputField label="Expected efficiency gain" value={efficiencyGain} onChange={setEfficiencyGain} suffix="%" min={0} max={100} />
      </div>
      <ResultsDisplay
        title="Your ROI Estimate"
        results={[
          { label: 'Annual Software Savings', value: `$${annualSoftwareSaving.toLocaleString()}` },
          { label: 'Annual Time Savings', value: `$${Math.round(annualTimeSaving).toLocaleString()}` },
          { label: 'Hours Saved Per Week', value: `${weeklyTimeSaved.toFixed(1)} hours` },
          { label: 'Total Annual Savings', value: `$${Math.round(totalAnnualSaving).toLocaleString()}`, highlight: true },
          { label: 'ROI', value: `${Math.round(roi)}%`, highlight: true },
        ]}
      />
    </div>
  );
}

function EmailROICalculator() {
  const [listSize, setListSize] = useState(5000);
  const [openRate, setOpenRate] = useState(25);
  const [clickRate, setClickRate] = useState(3);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgOrderValue, setAvgOrderValue] = useState(75);
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);

  const opens = listSize * (openRate / 100);
  const clicks = opens * (clickRate / 100);
  const conversions = clicks * (conversionRate / 100);
  const revenuePerCampaign = conversions * avgOrderValue;
  const monthlyRevenue = revenuePerCampaign * campaignsPerMonth;
  const annualRevenue = monthlyRevenue * 12;
  const revenuePerSubscriber = listSize > 0 ? (annualRevenue / listSize) : 0;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="Email list size" value={listSize} onChange={setListSize} suffix="subscribers" />
        <InputField label="Average open rate" value={openRate} onChange={setOpenRate} suffix="%" />
        <InputField label="Click-through rate" value={clickRate} onChange={setClickRate} suffix="%" />
        <InputField label="Conversion rate" value={conversionRate} onChange={setConversionRate} suffix="%" />
        <InputField label="Average order value" value={avgOrderValue} onChange={setAvgOrderValue} prefix="$" />
        <InputField label="Campaigns per month" value={campaignsPerMonth} onChange={setCampaignsPerMonth} />
      </div>
      <ResultsDisplay
        title="Email Marketing ROI"
        results={[
          { label: 'Opens per campaign', value: Math.round(opens).toLocaleString() },
          { label: 'Clicks per campaign', value: Math.round(clicks).toLocaleString() },
          { label: 'Conversions per campaign', value: conversions.toFixed(1) },
          { label: 'Revenue per campaign', value: `$${Math.round(revenuePerCampaign).toLocaleString()}` },
          { label: 'Monthly Revenue', value: `$${Math.round(monthlyRevenue).toLocaleString()}`, highlight: true },
          { label: 'Annual Revenue', value: `$${Math.round(annualRevenue).toLocaleString()}`, highlight: true },
          { label: 'Revenue per subscriber/yr', value: `$${revenuePerSubscriber.toFixed(2)}` },
        ]}
      />
    </div>
  );
}

function HostingCostCalculator() {
  const [monthlyVisitors, setMonthlyVisitors] = useState(50000);
  const [storageGB, setStorageGB] = useState(20);
  const [numSites, setNumSites] = useState(1);
  const [needSSL, setNeedSSL] = useState(1);
  const [needCDN, setNeedCDN] = useState(1);

  const baseShared = 4.99 + (numSites > 1 ? numSites * 2 : 0);
  const baseVPS = 24 + (storageGB > 50 ? (storageGB - 50) * 0.5 : 0);
  const baseCloud = 0.01 * (monthlyVisitors / 1000) + storageGB * 0.1;
  const baseManaged = 29 + (numSites > 1 ? (numSites - 1) * 15 : 0);

  const sslCost = needSSL ? 0 : 10;
  const cdnCost = needCDN ? 5 : 0;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="Monthly visitors" value={monthlyVisitors} onChange={setMonthlyVisitors} />
        <InputField label="Storage needed" value={storageGB} onChange={setStorageGB} suffix="GB" />
        <InputField label="Number of websites" value={numSites} onChange={setNumSites} min={1} />
        <InputField label="Need SSL? (1=Yes, 0=No)" value={needSSL} onChange={setNeedSSL} min={0} max={1} />
      </div>
      <ResultsDisplay
        title="Estimated Monthly Hosting Costs"
        results={[
          { label: 'Shared Hosting', value: `$${(baseShared + sslCost).toFixed(2)}/mo` },
          { label: 'VPS Hosting', value: `$${(baseVPS + sslCost).toFixed(2)}/mo` },
          { label: 'Cloud Hosting (pay-as-you-go)', value: `$${(baseCloud + cdnCost).toFixed(2)}/mo` },
          { label: 'Managed WordPress', value: `$${(baseManaged).toFixed(2)}/mo` },
          { label: 'Best for your traffic level', value: monthlyVisitors < 10000 ? 'Shared Hosting' : monthlyVisitors < 100000 ? 'VPS Hosting' : 'Cloud Hosting', highlight: true },
          { label: 'Recommended annual budget', value: `$${Math.round((monthlyVisitors < 10000 ? baseShared : monthlyVisitors < 100000 ? baseVPS : baseCloud) * 12).toLocaleString()}`, highlight: true },
        ]}
      />
    </div>
  );
}

function EcommerceProfitCalculator() {
  const [revenue, setRevenue] = useState(10000);
  const [cogs, setCogs] = useState(4000);
  const [platformFee, setPlatformFee] = useState(2.9);
  const [shippingCost, setShippingCost] = useState(500);
  const [marketingSpend, setMarketingSpend] = useState(1000);
  const [otherCosts, setOtherCosts] = useState(500);

  const processingFees = revenue * (platformFee / 100);
  const totalCosts = cogs + processingFees + shippingCost + marketingSpend + otherCosts;
  const profit = revenue - totalCosts;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const annualProfit = profit * 12;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="Monthly revenue" value={revenue} onChange={setRevenue} prefix="$" />
        <InputField label="Cost of goods sold" value={cogs} onChange={setCogs} prefix="$" />
        <InputField label="Payment processing fee" value={platformFee} onChange={setPlatformFee} suffix="%" step={0.1} />
        <InputField label="Monthly shipping costs" value={shippingCost} onChange={setShippingCost} prefix="$" />
        <InputField label="Monthly marketing spend" value={marketingSpend} onChange={setMarketingSpend} prefix="$" />
        <InputField label="Other monthly costs" value={otherCosts} onChange={setOtherCosts} prefix="$" />
      </div>
      <ResultsDisplay
        title="Your Profit Analysis"
        results={[
          { label: 'Monthly Revenue', value: `$${revenue.toLocaleString()}` },
          { label: 'Total Monthly Costs', value: `$${Math.round(totalCosts).toLocaleString()}` },
          { label: 'Processing Fees', value: `$${Math.round(processingFees).toLocaleString()}` },
          { label: 'Monthly Profit', value: `$${Math.round(profit).toLocaleString()}`, highlight: true },
          { label: 'Profit Margin', value: `${margin.toFixed(1)}%`, highlight: true },
          { label: 'Annual Profit (projected)', value: `$${Math.round(annualProfit).toLocaleString()}` },
        ]}
      />
    </div>
  );
}

function AICostCalculator() {
  const [dailyRequests, setDailyRequests] = useState(100);
  const [avgTokensPerReq, setAvgTokensPerReq] = useState(1000);
  const [pricePerMToken, setPricePerMToken] = useState(3);
  const [teamSize, setTeamSize] = useState(5);
  const [subscriptionCost, setSubscriptionCost] = useState(20);

  const monthlyRequests = dailyRequests * 30;
  const monthlyTokens = monthlyRequests * avgTokensPerReq;
  const apiCost = (monthlyTokens / 1_000_000) * pricePerMToken;
  const subscriptionTotal = teamSize * subscriptionCost;
  const totalMonthlyCost = apiCost + subscriptionTotal;
  const costPerRequest = monthlyRequests > 0 ? totalMonthlyCost / monthlyRequests : 0;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="API requests per day" value={dailyRequests} onChange={setDailyRequests} />
        <InputField label="Avg tokens per request" value={avgTokensPerReq} onChange={setAvgTokensPerReq} />
        <InputField label="Price per million tokens" value={pricePerMToken} onChange={setPricePerMToken} prefix="$" step={0.5} />
        <InputField label="Team members (subscriptions)" value={teamSize} onChange={setTeamSize} />
        <InputField label="Subscription cost per seat" value={subscriptionCost} onChange={setSubscriptionCost} prefix="$" />
      </div>
      <ResultsDisplay
        title="AI Cost Estimate"
        results={[
          { label: 'Monthly API Requests', value: monthlyRequests.toLocaleString() },
          { label: 'Monthly Tokens Used', value: `${(monthlyTokens / 1_000_000).toFixed(2)}M` },
          { label: 'API Cost', value: `$${apiCost.toFixed(2)}/mo` },
          { label: 'Subscription Cost', value: `$${subscriptionTotal.toFixed(2)}/mo` },
          { label: 'Total Monthly Cost', value: `$${totalMonthlyCost.toFixed(2)}`, highlight: true },
          { label: 'Cost per Request', value: `$${costPerRequest.toFixed(4)}`, highlight: true },
          { label: 'Annual Budget', value: `$${Math.round(totalMonthlyCost * 12).toLocaleString()}` },
        ]}
      />
    </div>
  );
}

function TeamProductivityCalculator() {
  const [teamSize, setTeamSize] = useState(10);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [hoursWasted, setHoursWasted] = useState(5);
  const [toolCostPerUser, setToolCostPerUser] = useState(30);
  const [efficiencyGain, setEfficiencyGain] = useState(40);

  const hourlyRate = avgSalary / 2080;
  const weeklyWaste = teamSize * hoursWasted;
  const annualWaste = weeklyWaste * 52;
  const annualWasteCost = annualWaste * hourlyRate;
  const recoveredHours = annualWaste * (efficiencyGain / 100);
  const annualSavings = recoveredHours * hourlyRate;
  const toolCostAnnual = teamSize * toolCostPerUser * 12;
  const netSavings = annualSavings - toolCostAnnual;
  const roi = toolCostAnnual > 0 ? (netSavings / toolCostAnnual) * 100 : 0;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6">
        <InputField label="Team size" value={teamSize} onChange={setTeamSize} suffix="people" />
        <InputField label="Average annual salary" value={avgSalary} onChange={setAvgSalary} prefix="$" />
        <InputField label="Hours wasted per person/week" value={hoursWasted} onChange={setHoursWasted} suffix="hrs" />
        <InputField label="Tool cost per user/month" value={toolCostPerUser} onChange={setToolCostPerUser} prefix="$" />
        <InputField label="Expected efficiency gain" value={efficiencyGain} onChange={setEfficiencyGain} suffix="%" min={0} max={100} />
      </div>
      <ResultsDisplay
        title="Productivity Savings"
        results={[
          { label: 'Hours wasted annually (team)', value: `${annualWaste.toLocaleString()} hours` },
          { label: 'Cost of wasted time', value: `$${Math.round(annualWasteCost).toLocaleString()}/yr` },
          { label: 'Hours recovered with tool', value: `${Math.round(recoveredHours).toLocaleString()} hours` },
          { label: 'Productivity savings', value: `$${Math.round(annualSavings).toLocaleString()}/yr` },
          { label: 'Annual tool cost', value: `$${toolCostAnnual.toLocaleString()}/yr` },
          { label: 'Net Annual Savings', value: `$${Math.round(netSavings).toLocaleString()}`, highlight: true },
          { label: 'ROI', value: `${Math.round(roi)}%`, highlight: true },
        ]}
      />
    </div>
  );
}
