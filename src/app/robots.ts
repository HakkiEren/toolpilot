import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// AI crawlers to block — protect original content from training datasets
const AI_CRAWLERS = [
  'GPTBot',           // OpenAI
  'ChatGPT-User',    // OpenAI ChatGPT browsing
  'CCBot',            // Common Crawl (used by many AI companies)
  'Google-Extended',  // Google Gemini/Bard training
  'anthropic-ai',     // Anthropic Claude training
  'ClaudeBot',        // Anthropic Claude web browsing
  'Bytespider',       // ByteDance / TikTok AI
  'Diffbot',          // Diffbot AI scraper
  'FacebookBot',      // Meta AI training
  'PerplexityBot',    // Perplexity AI
  'Applebot-Extended', // Apple AI training (separate from regular Applebot)
  'cohere-ai',        // Cohere AI
  'YouBot',           // You.com AI
  'Scrapy',           // Generic scraping framework
  'img2dataset',      // AI image dataset builder
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/image', '/private/', '/search'],
      },
      // Block all AI training crawlers
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        disallow: ['/'] as string[],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
