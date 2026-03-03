// ============================================================
// CORE TYPES — Multi-Vertical pSEO Platform
// ============================================================

// --- Categories (Verticals) ---
export type CategorySlug =
  | 'ai-tools'
  | 'saas'
  | 'ecommerce'
  | 'marketing'
  | 'hosting'
  | 'business';

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  color: string;           // Brand color for category
  toolCount: number;
  metaTitle: string;
  metaDescription: string;
}

// --- Subcategories ---
export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  description: string;
  toolCount: number;
}

// --- Tools / Products ---
export interface Tool {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  subcategorySlug: string;
  tagline: string;          // One-liner description
  description: string;      // Full description (AI-generated + human reviewed)
  logoUrl: string;
  websiteUrl: string;

  // Pricing
  pricing: ToolPricing;

  // Features & Ratings
  features: ToolFeatures;
  ratings: ToolRatings;

  // Content blocks (pre-generated, unique per tool)
  prosConsContent: string;
  useCasesContent: string;
  bestForContent: string;

  // SEO
  metaTitle: string;
  metaDescription: string;

  // Metadata
  lastUpdated: string;      // ISO date
  createdAt: string;
  status: 'draft' | 'generated' | 'reviewed' | 'published';
}

export interface ToolPricing {
  hasFreeplan: boolean;
  freeTrialDays: number | null;
  startingPrice: number | null;   // Monthly, USD
  currency: string;
  plans: PricingPlan[];
}

export interface PricingPlan {
  name: string;
  price: number | null;     // null = custom/enterprise
  billingCycle: 'monthly' | 'yearly' | 'one-time' | 'custom';
  features: string[];
  isPopular?: boolean;
}

export interface ToolFeatures {
  [key: string]: boolean | string | number;
  // Dynamic — varies by category
  // AI Tools: hasApi, modelType, contextWindow, etc.
  // SaaS: hasIntegrations, mobileApp, etc.
}

export interface ToolRatings {
  overall: number;          // 0-10
  easeOfUse: number;
  features: number;
  valueForMoney: number;
  support: number;
  reviewCount: number;
}

// --- Comparisons ---
export interface Comparison {
  id: string;
  slug: string;             // "chatgpt-vs-claude"
  categorySlug: CategorySlug;
  toolA: Tool;
  toolB: Tool;

  // Pre-generated unique content
  introContent: string;           // 150-200 words unique intro
  verdictContent: string;         // Who should choose A, who B
  migrationContent: string;       // How to switch from A→B or B→A
  scenarioContent: string;        // Use-case scenarios

  // Feature comparison matrix
  featureMatrix: FeatureComparison[];

  // FAQ (unique per comparison)
  faqs: FAQ[];

  // SEO
  metaTitle: string;
  metaDescription: string;

  lastUpdated: string;
}

export interface FeatureComparison {
  feature: string;
  category: string;         // Group features by category
  toolAValue: string | boolean | number;
  toolBValue: string | boolean | number;
  winner: 'a' | 'b' | 'tie';
}

export interface FAQ {
  question: string;
  answer: string;
}

// --- Alternatives ---
export interface AlternativesPage {
  tool: Tool;
  alternatives: AlternativeEntry[];
  introContent: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AlternativeEntry {
  tool: Tool;
  whyAlternative: string;  // Unique paragraph per alternative
  bestFor: string;
  comparisonSlug: string;  // Link to VS page
}

// --- Best-of Lists ---
export interface BestOfPage {
  slug: string;              // "best-ai-writing-tools"
  categorySlug: CategorySlug;
  subcategorySlug: string;
  title: string;
  introContent: string;
  tools: RankedTool[];
  metaTitle: string;
  metaDescription: string;
}

export interface RankedTool {
  rank: number;
  tool: Tool;
  whyRanked: string;       // Unique paragraph explaining ranking
  bestFor: string;
}

// --- Blog / Editorial ---
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  categorySlug: CategorySlug | null;
  author: string;
  publishedAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  relatedToolSlugs: string[];
  relatedComparisonSlugs: string[];
}

// --- Calculator ---
export interface Calculator {
  slug: string;
  type: string;
  title: string;
  description: string;
  categorySlug: CategorySlug;
  inputs: CalculatorInput[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'range';
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  defaultValue: number | string;
}

// --- Internal Linking ---
export interface InternalLink {
  url: string;
  text: string;
  type: 'hub' | 'sibling' | 'comparison' | 'cross-category' | 'blog';
}

// --- Sitemap ---
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}
