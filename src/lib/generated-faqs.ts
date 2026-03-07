// generated-faqs.ts
// Dynamically generates FAQ content, comparison bottom lines, and key differences
// from structured tool data for pSEO pages.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolPricingPlan {
  name: string;
  price: number | null;
}

export interface ToolPricing {
  hasFreeplan: boolean;
  startingPrice: number | null;
  freeTrialDays: number | null;
  plans: ToolPricingPlan[];
}

export interface ToolRatings {
  overall: number;
}

export interface ToolInput {
  name: string;
  tagline: string;
  pricing: ToolPricing;
  ratings: ToolRatings;
  categorySlug: string;
}

export interface ComparisonBottomLine {
  headline: string;
  summary: string;
}

export interface KeyDifference {
  area: string;
  toolAPoint: string;
  toolBPoint: string;
  winner: string;
}

export interface FeatureMatrixRow {
  feature: string;
  toolAValue: string | number | boolean;
  toolBValue: string | number | boolean;
  winner: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_USE_CASE_MAP: Record<string, string> = {
  "ai-tools": "beginners",
  "ai-writing": "content creators",
  "ai-coding": "developers",
  "ai-image": "designers",
  "ai-video": "video creators",
  "ai-chat": "everyday users",
  "saas": "small businesses",
  "marketing": "marketing teams",
  "seo": "SEO professionals",
  "analytics": "data-driven teams",
  "crm": "sales teams",
  "project-management": "project managers",
  "design": "creative professionals",
  "ecommerce": "online stores",
  "email-marketing": "email marketers",
  "social-media": "social media managers",
  "customer-support": "support teams",
  "hr": "HR departments",
  "accounting": "finance teams",
  "productivity": "professionals",
  "education": "educators and students",
  "healthcare": "healthcare providers",
  "cybersecurity": "security-conscious organizations",
  "devops": "DevOps engineers",
  "no-code": "non-technical users",
};

function getUseCaseAudience(categorySlug: string): string {
  return CATEGORY_USE_CASE_MAP[categorySlug] ?? "teams and individuals";
}

function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "excellent";
  if (rating >= 4.0) return "strong";
  if (rating >= 3.5) return "solid";
  if (rating >= 3.0) return "decent";
  return "mixed";
}

function formatPrice(price: number): string {
  return price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;
}

function buildPricingSummary(pricing: ToolPricing): string {
  const paidPlans = pricing.plans.filter(
    (p): p is ToolPricingPlan & { price: number } => p.price !== null
  );

  if (paidPlans.length === 0) {
    return "Detailed plan pricing is available on their website";
  }

  if (paidPlans.length === 1) {
    return `The ${paidPlans[0].name} plan is ${formatPrice(paidPlans[0].price)}/month`;
  }

  const parts = paidPlans
    .slice(0, 3)
    .map((p) => `${p.name} at ${formatPrice(p.price)}/month`);

  return `Plans include ${parts.join(", ")}`;
}

// ---------------------------------------------------------------------------
// generateToolFAQs
// ---------------------------------------------------------------------------

export function generateToolFAQs(tool: ToolInput): FAQ[] {
  const year = new Date().getFullYear();
  const { name, pricing, ratings, categorySlug } = tool;
  const audience = getUseCaseAudience(categorySlug);
  const ratingLabel = getRatingLabel(ratings.overall);

  // 1. "Is {tool.name} worth it in {year}?"
  const worthItAnswer = (() => {
    const valueNote =
      pricing.hasFreeplan
        ? `It offers a free plan, so you can try it risk-free before committing.`
        : pricing.freeTrialDays
          ? `It offers a ${pricing.freeTrialDays}-day free trial so you can evaluate it before committing.`
          : pricing.startingPrice !== null
            ? `Starting at ${formatPrice(pricing.startingPrice)}/month, it provides reasonable value for its feature set.`
            : `You can check their website for the latest pricing and plan details.`;

    return `With a ${ratingLabel} ${ratings.overall}/5 user rating, ${name} remains a competitive choice in ${year}. ${valueNote} Most users find it delivers good value relative to comparable tools in the market.`;
  })();

  // 2. "Does {tool.name} have a free plan?"
  const freePlanAnswer = (() => {
    if (pricing.hasFreeplan) {
      const trialExtra =
        pricing.freeTrialDays !== null
          ? ` Paid plans also come with a ${pricing.freeTrialDays}-day free trial for full-feature access.`
          : "";
      return `Yes, ${name} offers a free plan that lets you explore its core features without a credit card.${trialExtra} It's a great way to evaluate whether the tool fits your workflow before upgrading.`;
    }

    if (pricing.freeTrialDays !== null) {
      return `${name} does not have a permanent free plan, but it does offer a ${pricing.freeTrialDays}-day free trial. This gives you enough time to test the full feature set. After the trial you can choose the paid tier that matches your needs.`;
    }

    return `${name} does not currently offer a free plan or free trial. ${pricing.startingPrice !== null ? `Paid plans start at ${formatPrice(pricing.startingPrice)}/month.` : "Check their website for the latest pricing."} You may want to request a demo or contact their sales team for a guided walkthrough before purchasing.`;
  })();

  // 3. "What are the best {tool.name} alternatives?"
  const alternativesAnswer = `Several tools compete directly with ${name} in the ${categorySlug.replace(/-/g, " ")} space. We maintain a curated alternatives page that compares features, pricing, and user ratings side by side. Visit our ${name} alternatives page to find the best fit for ${audience}.`;

  // 4. "How much does {tool.name} cost?"
  const costAnswer = (() => {
    const summary = buildPricingSummary(pricing);
    const freeNote = pricing.hasFreeplan
      ? `${name} has a free tier alongside its paid options.`
      : `${name} is a paid tool with multiple tiers.`;
    return `${freeNote} ${summary}. Visit the official pricing page for the most up-to-date information and any available discounts.`;
  })();

  // 5. "Is {tool.name} good for {use case}?"
  const useCaseAnswer = `${name} is well-suited for ${audience}, especially those looking for ${ratingLabel === "excellent" || ratingLabel === "strong" ? "a top-rated" : "a reliable"} solution in the ${categorySlug.replace(/-/g, " ")} category. Its ${ratings.overall >= 4.0 ? "high user satisfaction score" : "feature set"} suggests it handles common workflows effectively. We recommend starting with ${pricing.hasFreeplan ? "the free plan" : pricing.freeTrialDays ? "the free trial" : "a demo"} to see if it meets your specific requirements.`;

  return [
    {
      question: `Is ${name} worth it in ${year}?`,
      answer: worthItAnswer,
    },
    {
      question: `Does ${name} have a free plan?`,
      answer: freePlanAnswer,
    },
    {
      question: `What are the best ${name} alternatives?`,
      answer: alternativesAnswer,
    },
    {
      question: `How much does ${name} cost?`,
      answer: costAnswer,
    },
    {
      question: `Is ${name} good for ${audience}?`,
      answer: useCaseAnswer,
    },
  ];
}

// ---------------------------------------------------------------------------
// generateComparisonFAQs — auto-generated FAQs for comparison pages
// Targets search queries like "X vs Y", "which is better X or Y", etc.
// ---------------------------------------------------------------------------

export function generateComparisonFAQs(
  toolA: ToolInput,
  toolB: ToolInput,
): FAQ[] {
  const year = new Date().getFullYear();
  const { name: nameA, pricing: pricingA, ratings: ratingsA } = toolA;
  const { name: nameB, pricing: pricingB, ratings: ratingsB } = toolB;

  const winner = ratingsA.overall > ratingsB.overall ? nameA : ratingsB.overall > ratingsA.overall ? nameB : null;
  const winnerScore = Math.max(ratingsA.overall, ratingsB.overall);
  const loserScore = Math.min(ratingsA.overall, ratingsB.overall);

  // 1. "Which is better, X or Y?"
  const betterAnswer = winner
    ? `Based on our analysis, ${winner} has a slight edge with a ${winnerScore}/10 rating compared to ${loserScore}/10. However, the best choice depends on your specific needs, budget, and use case. We recommend trying both if possible — ${pricingA.hasFreeplan ? `${nameA} offers a free plan` : pricingA.freeTrialDays ? `${nameA} has a ${pricingA.freeTrialDays}-day free trial` : `${nameA} offers paid plans`} and ${pricingB.hasFreeplan ? `${nameB} offers a free plan` : pricingB.freeTrialDays ? `${nameB} has a ${pricingB.freeTrialDays}-day free trial` : `${nameB} offers paid plans`}.`
    : `${nameA} and ${nameB} are very evenly matched with identical overall ratings of ${ratingsA.overall}/10. The best choice comes down to your specific priorities — pricing, specific features, or integration needs. We recommend reviewing the detailed feature comparison above and trying both tools.`;

  // 2. "Is X cheaper than Y?"
  const cheaperAnswer = (() => {
    const priceA = pricingA.startingPrice;
    const priceB = pricingB.startingPrice;
    const freeA = pricingA.hasFreeplan;
    const freeB = pricingB.hasFreeplan;

    if (freeA && freeB) {
      return `Both ${nameA} and ${nameB} offer free plans, making them accessible to start with no commitment. ${priceA && priceB ? `For paid plans, ${nameA} starts at $${priceA}/month while ${nameB} starts at $${priceB}/month.` : 'Check their respective pricing pages for paid plan details.'}`;
    }
    if (freeA && !freeB) {
      return `${nameA} has an advantage here with a free plan available, while ${nameB} ${priceB ? `starts at $${priceB}/month` : 'requires a paid subscription'}. ${nameA} is the more budget-friendly option to get started.`;
    }
    if (!freeA && freeB) {
      return `${nameB} has the edge on pricing with a free plan available, while ${nameA} ${priceA ? `starts at $${priceA}/month` : 'requires a paid subscription'}. ${nameB} is more accessible for budget-conscious users.`;
    }
    if (priceA && priceB) {
      const cheaper = priceA < priceB ? nameA : priceB < priceA ? nameB : null;
      return cheaper
        ? `${cheaper} is more affordable, starting at $${Math.min(priceA, priceB)}/month compared to $${Math.max(priceA, priceB)}/month. However, pricing alone shouldn't drive your decision — compare the features included at each price point.`
        : `Both tools start at similar price points around $${priceA}/month. The value difference comes down to which features matter most for your workflow.`;
    }
    return `Both ${nameA} and ${nameB} offer competitive pricing. Visit their official pricing pages for the most current plan details and any available discounts or annual billing savings.`;
  })();

  // 3. "Can I switch from X to Y?"
  const switchAnswer = `Switching from ${nameA} to ${nameB} (or vice versa) is generally possible, though the process depends on the specific data and integrations involved. Most modern tools offer data export features (CSV, API, or native migration tools). Before switching, we recommend: (1) Export your data from the current tool, (2) Use the new tool's free trial or free plan to test the migration, (3) Run both tools in parallel during the transition period. Check both tools' documentation for specific migration guides.`;

  // 4. "What are the main differences between X and Y?"
  const differencesAnswer = `The key differences between ${nameA} and ${nameB} come down to their ratings, pricing, and target audience. ${nameA} scores ${ratingsA.overall}/10 overall while ${nameB} scores ${ratingsB.overall}/10. ${pricingA.hasFreeplan !== pricingB.hasFreeplan ? `On the pricing front, ${pricingA.hasFreeplan ? nameA : nameB} offers a free plan while ${pricingA.hasFreeplan ? nameB : nameA} does not.` : ''} See our detailed feature matrix and score comparison above for a complete breakdown of how they compare across specific capabilities.`;

  // 5. Year-specific query
  const yearAnswer = `In ${year}, both ${nameA} and ${nameB} remain actively maintained and competitive. ${winner ? `${winner} currently holds a higher overall rating (${winnerScore}/10 vs ${loserScore}/10), suggesting it may offer a slightly better overall experience.` : `Both tools are neck-and-neck with identical ratings.`} We update our comparisons regularly to reflect the latest features, pricing changes, and user feedback.`;

  return [
    {
      question: `Which is better, ${nameA} or ${nameB}?`,
      answer: betterAnswer,
    },
    {
      question: `Is ${nameA} cheaper than ${nameB}?`,
      answer: cheaperAnswer,
    },
    {
      question: `Can I switch from ${nameA} to ${nameB}?`,
      answer: switchAnswer,
    },
    {
      question: `What are the main differences between ${nameA} and ${nameB}?`,
      answer: differencesAnswer,
    },
    {
      question: `${nameA} vs ${nameB}: Which should I choose in ${year}?`,
      answer: yearAnswer,
    },
  ];
}

// ---------------------------------------------------------------------------
// generateComparisonBottomLine
// ---------------------------------------------------------------------------

export function generateComparisonBottomLine(
  toolAName: string,
  toolBName: string,
  aScore: number,
  bScore: number,
  verdictContent: string
): ComparisonBottomLine {
  const diff = Math.abs(aScore - bScore);
  const winner = aScore >= bScore ? toolAName : toolBName;
  const loser = aScore >= bScore ? toolBName : toolAName;
  const winnerScore = Math.max(aScore, bScore);
  const loserScore = Math.min(aScore, bScore);

  const closeness =
    diff < 0.3 ? "a very close call" : diff < 1 ? "a moderate edge" : "a clear advantage";

  const headline = `${winner} edges out ${loser} with a ${winnerScore}/5 vs ${loserScore}/5 rating — ${closeness}.`;
  const summary = `${verdictContent} Ultimately, ${winner} offers ${closeness} overall, but ${loser} may still be the better pick depending on your specific priorities and budget.`;

  return { headline, summary };
}

// ---------------------------------------------------------------------------
// generateKeyDifferences
// ---------------------------------------------------------------------------

export function generateKeyDifferences(
  toolAName: string,
  toolBName: string,
  featureMatrix: FeatureMatrixRow[]
): KeyDifference[] {
  // Rank features by how different the two tools are.
  // A clear winner (not "tie") and distinct values score higher.
  const scored = featureMatrix.map((row) => {
    let impactScore = 0;

    // Having a declared winner is the strongest signal.
    if (row.winner && row.winner !== "tie" && row.winner !== "draw") {
      impactScore += 2;
    }

    // Longer, more descriptive values hint at a meaningful distinction.
    const aStr = String(row.toolAValue);
    const bStr = String(row.toolBValue);
    const avgLength = (aStr.length + bStr.length) / 2;
    if (avgLength > 10) impactScore += 1;

    // Completely different values are more impactful than similar ones.
    if (aStr.toLowerCase() !== bStr.toLowerCase()) {
      impactScore += 1;
    }

    return { row, impactScore };
  });

  // Sort descending by impact, take top 3.
  scored.sort((a, b) => b.impactScore - a.impactScore);

  return scored.slice(0, 3).map(({ row }) => ({
    area: row.feature,
    toolAPoint: `${toolAName}: ${row.toolAValue}`,
    toolBPoint: `${toolBName}: ${row.toolBValue}`,
    winner: row.winner,
  }));
}
