import type { Category } from '@/types';

// ============================================================
// SITE CONFIGURATION
// ============================================================

export const SITE_NAME = 'ToolPilot'; // Placeholder — will be updated with final domain
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolpilot.io';
export const SITE_DESCRIPTION = 'Compare the best digital tools across AI, SaaS, E-commerce, Marketing, Hosting & Business. Unbiased reviews, real pricing, and honest comparisons.';

// ============================================================
// CATEGORIES (VERTICALS)
// ============================================================

export const CATEGORIES: Record<string, Category> = {
  'ai-tools': {
    id: 'cat_ai',
    slug: 'ai-tools',
    name: 'AI Tools',
    description: 'Compare the best AI tools for writing, image generation, coding, chatbots, and more.',
    icon: 'brain',
    color: '#8B5CF6',
    toolCount: 0,
    metaTitle: 'Best AI Tools Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare 500+ AI tools side by side. Honest reviews, real pricing, feature comparisons for ChatGPT, Claude, Midjourney, Cursor and more.',
  },
  'saas': {
    id: 'cat_saas',
    slug: 'saas',
    name: 'SaaS Tools',
    description: 'Find the right SaaS tools for your business. CRM, project management, HR, and more.',
    icon: 'cloud',
    color: '#3B82F6',
    toolCount: 0,
    metaTitle: 'Best SaaS Tools Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare 1000+ SaaS tools. CRM, project management, HR software with honest reviews, real pricing and feature comparisons.',
  },
  'ecommerce': {
    id: 'cat_ecom',
    slug: 'ecommerce',
    name: 'E-commerce',
    description: 'Compare e-commerce platforms, payment gateways, and online store builders.',
    icon: 'shopping-cart',
    color: '#10B981',
    toolCount: 0,
    metaTitle: 'Best E-commerce Platforms Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare Shopify, WooCommerce, BigCommerce and 200+ e-commerce tools. Real pricing, features and honest reviews.',
  },
  'marketing': {
    id: 'cat_mkt',
    slug: 'marketing',
    name: 'Marketing Tools',
    description: 'Compare SEO tools, email marketing, social media management, and analytics platforms.',
    icon: 'megaphone',
    color: '#F59E0B',
    toolCount: 0,
    metaTitle: 'Best Marketing Tools Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare SEO tools, email marketing, social media managers. Honest reviews and pricing for Ahrefs, Semrush, Mailchimp and more.',
  },
  'hosting': {
    id: 'cat_host',
    slug: 'hosting',
    name: 'Web Hosting',
    description: 'Compare web hosting providers, cloud platforms, and managed WordPress hosting.',
    icon: 'server',
    color: '#EF4444',
    toolCount: 0,
    metaTitle: 'Best Web Hosting Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare Vercel, AWS, Cloudflare, Hostinger and 100+ hosting providers. Speed tests, pricing and real reviews.',
  },
  'business': {
    id: 'cat_biz',
    slug: 'business',
    name: 'Business Tools',
    description: 'Compare accounting, HR, legal, and productivity tools for your business.',
    icon: 'briefcase',
    color: '#6366F1',
    toolCount: 0,
    metaTitle: 'Best Business Tools Compared — Reviews, Pricing & Alternatives',
    metaDescription: 'Compare accounting, HR, legal and productivity tools. QuickBooks, Gusto, Notion and 500+ tools with real pricing.',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

// ============================================================
// AI TOOLS SUBCATEGORIES (First vertical to launch)
// ============================================================

export const AI_SUBCATEGORIES = [
  { slug: 'ai-writing', name: 'AI Writing Tools', description: 'AI-powered content creation, copywriting, and text generation tools.' },
  { slug: 'ai-image', name: 'AI Image Generators', description: 'Text-to-image, image editing, and AI art generation tools.' },
  { slug: 'ai-video', name: 'AI Video Tools', description: 'AI video generation, editing, and enhancement tools.' },
  { slug: 'ai-coding', name: 'AI Coding Assistants', description: 'AI-powered code generation, completion, and development tools.' },
  { slug: 'ai-chatbots', name: 'AI Chatbots', description: 'Conversational AI, customer service bots, and AI assistants.' },
  { slug: 'ai-voice', name: 'AI Voice & Speech', description: 'Text-to-speech, speech recognition, and voice cloning tools.' },
  { slug: 'ai-music', name: 'AI Music Tools', description: 'AI music generation, audio editing, and sound design tools.' },
  { slug: 'ai-research', name: 'AI Research Tools', description: 'AI-powered research assistants, summarizers, and knowledge tools.' },
  { slug: 'ai-productivity', name: 'AI Productivity', description: 'AI meeting assistants, note-taking, scheduling, and workflow automation.' },
  { slug: 'ai-design', name: 'AI Design Tools', description: 'AI-powered graphic design, UI/UX, and presentation tools.' },
  { slug: 'ai-data', name: 'AI Data & Analytics', description: 'AI-powered data analysis, visualization, and business intelligence.' },
  { slug: 'ai-agents', name: 'AI Agents & Automation', description: 'Autonomous AI agents, workflow automation, and multi-step AI systems.' },
];

// ============================================================
// PAGE GENERATION LIMITS
// ============================================================

export const LIMITS = {
  /** Max tools to generate in ISR at build time */
  BUILD_TIME_TOOLS: 500,
  /** Max comparisons to generate at build time */
  BUILD_TIME_COMPARISONS: 200,
  /** ISR revalidation interval in seconds */
  REVALIDATE_INTERVAL: 3600,         // 1 hour
  /** Min word count per page for quality */
  MIN_WORD_COUNT: 500,
  /** Min uniqueness between pages */
  MIN_PAGE_UNIQUENESS: 0.6,          // 60%
  /** Max VS comparisons: only 2-way */
  MAX_VS_ENTITIES: 2,
  /** Max pages per sitemap file */
  SITEMAP_MAX_URLS: 10_000,
  /** Internal links per page */
  INTERNAL_LINKS_PER_PAGE: { min: 3, max: 8 },
};

// ============================================================
// SEO DEFAULTS
// ============================================================

export const SEO = {
  titleSuffix: ` | ${SITE_NAME}`,
  defaultOgImage: '/og-default.png',
  twitterHandle: '@toolpilot',
  locale: 'en_US',
};
