import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for tool logos (Clearbit + Google Favicons)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'www.google.com', pathname: '/s2/favicons**' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },

  // Strict mode for better development
  reactStrictMode: true,

  // Headers for security, caching & crawl budget
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Cache static assets aggressively (1 year)
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|css|js)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Crawl budget: don't index search page (thin content)
        source: '/search',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
        ],
      },
      {
        // Crawl budget: don't index sitemap-html (duplicate of XML)
        source: '/sitemap-html',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, follow' },
        ],
      },
    ];
  },

  // Redirects for SEO (trailing slash normalization)
  async redirects() {
    return [];
  },
};

export default nextConfig;
