import type { Category } from '@/types';

// ============================================================
// SITE CONFIGURATION
// ============================================================

export const SITE_NAME = 'ProPicked';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://propicked.com';
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
// SUBCATEGORIES PER VERTICAL
// ============================================================

export const SUBCATEGORIES: Record<string, { slug: string; name: string; description: string }[]> = {
  'ai-tools': [
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
  ],
  'saas': [
    { slug: 'crm', name: 'CRM Software', description: 'Customer relationship management platforms for sales teams and businesses.' },
    { slug: 'project-management', name: 'Project Management', description: 'Task tracking, team collaboration, and project planning tools.' },
    { slug: 'hr-software', name: 'HR Software', description: 'Human resources management, payroll, and employee engagement platforms.' },
    { slug: 'helpdesk', name: 'Help Desk & Support', description: 'Customer support ticketing, live chat, and knowledge base solutions.' },
    { slug: 'communication', name: 'Team Communication', description: 'Business messaging, video conferencing, and team collaboration tools.' },
    { slug: 'document-management', name: 'Document Management', description: 'File storage, document collaboration, and digital asset management platforms.' },
    { slug: 'erp', name: 'ERP Systems', description: 'Enterprise resource planning solutions for mid-market and large businesses.' },
    { slug: 'scheduling', name: 'Scheduling & Booking', description: 'Appointment scheduling, calendar management, and booking software.' },
  ],
  'ecommerce': [
    { slug: 'store-builders', name: 'Online Store Builders', description: 'Complete e-commerce platforms for building and managing online stores.' },
    { slug: 'payment-processing', name: 'Payment Processing', description: 'Payment gateways, checkout solutions, and transaction processing tools.' },
    { slug: 'shipping', name: 'Shipping & Fulfillment', description: 'Shipping label platforms, order fulfillment, and logistics management.' },
    { slug: 'inventory', name: 'Inventory Management', description: 'Stock tracking, warehouse management, and inventory optimization tools.' },
    { slug: 'marketplace', name: 'Marketplace Platforms', description: 'Multi-vendor marketplaces, dropshipping platforms, and digital product stores.' },
    { slug: 'ecommerce-analytics', name: 'E-commerce Analytics', description: 'Sales analytics, customer behavior tracking, and revenue optimization tools.' },
  ],
  'marketing': [
    { slug: 'email-marketing', name: 'Email Marketing', description: 'Email campaign management, automation, and newsletter platforms.' },
    { slug: 'seo-tools', name: 'SEO Tools', description: 'Search engine optimization, keyword research, and rank tracking software.' },
    { slug: 'social-media', name: 'Social Media Management', description: 'Social media scheduling, analytics, and content management tools.' },
    { slug: 'content-marketing', name: 'Content Marketing', description: 'Content planning, creation, distribution, and performance tracking platforms.' },
    { slug: 'advertising', name: 'Advertising Platforms', description: 'PPC management, ad optimization, and cross-channel advertising tools.' },
    { slug: 'analytics', name: 'Marketing Analytics', description: 'Web analytics, attribution modeling, and marketing performance measurement tools.' },
    { slug: 'landing-pages', name: 'Landing Page Builders', description: 'Drag-and-drop landing page creation and conversion optimization tools.' },
    { slug: 'marketing-automation', name: 'Marketing Automation', description: 'Workflow automation, lead nurturing, and multi-channel campaign orchestration.' },
  ],
  'hosting': [
    { slug: 'shared-hosting', name: 'Shared Hosting', description: 'Affordable shared web hosting for blogs, personal sites, and small businesses.' },
    { slug: 'vps-hosting', name: 'VPS Hosting', description: 'Virtual private servers for growing websites that need dedicated resources.' },
    { slug: 'cloud-hosting', name: 'Cloud Hosting', description: 'Scalable cloud infrastructure including AWS, Google Cloud, and Azure alternatives.' },
    { slug: 'wordpress-hosting', name: 'WordPress Hosting', description: 'Managed and optimized hosting specifically for WordPress websites.' },
    { slug: 'domain-registrars', name: 'Domain Registrars', description: 'Domain name registration, transfer, and management services.' },
    { slug: 'cdn', name: 'CDN Services', description: 'Content delivery networks for faster global page load times and DDoS protection.' },
  ],
  'business': [
    { slug: 'accounting', name: 'Accounting Software', description: 'Bookkeeping, invoicing, expense tracking, and financial reporting tools.' },
    { slug: 'legal-tools', name: 'Legal & Compliance', description: 'Contract management, e-signature, and legal compliance tools.' },
    { slug: 'productivity', name: 'Productivity Tools', description: 'Note-taking, to-do lists, time tracking, and personal productivity apps.' },
    { slug: 'collaboration', name: 'Collaboration Platforms', description: 'Team workspaces, whiteboarding, and real-time document collaboration tools.' },
    { slug: 'cybersecurity', name: 'Cybersecurity Tools', description: 'Password managers, VPNs, endpoint protection, and security monitoring.' },
    { slug: 'no-code', name: 'No-Code / Low-Code', description: 'Visual app builders, workflow automation, and no-code development platforms.' },
  ],
};

// Legacy alias for AI Tools subcategories
export const AI_SUBCATEGORIES = SUBCATEGORIES['ai-tools'];

// ============================================================
// PAGE GENERATION LIMITS
// ============================================================

export const LIMITS = {
  /** Max tools to generate in ISR at build time */
  BUILD_TIME_TOOLS: 1000,
  /** Max comparisons to generate at build time */
  BUILD_TIME_COMPARISONS: 500,
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
  twitterHandle: '@propicked',
  locale: 'en_US',
};
