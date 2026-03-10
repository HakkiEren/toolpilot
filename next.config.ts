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
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128],
  },

  // No trailing slashes — prevents duplicate content
  trailingSlash: false,

  // Strict mode for better development
  reactStrictMode: true,

  // Production compiler optimizations
  compiler: {
    // Remove console.log in production builds (keep errors)
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // Optimize commonly used packages for better tree-shaking
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },

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
          { key: 'Content-Language', value: 'en' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // CSP report-only — monitor violations without breaking anything
            // Allows: self, inline scripts/styles (Next.js needs), Google (GA4/AdSense/Fonts), Clearbit, Supabase
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://adservice.google.com https://www.google-analytics.com https://ep1.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://logo.clearbit.com https://www.google.com https://pagead2.googlesyndication.com https://www.googletagmanager.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://gqqgbfoniyfbpbognnks.supabase.co https://www.google-analytics.com https://pagead2.googlesyndication.com https://api.indexnow.org",
              "frame-src https://googleads.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
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
      {
        // CDN edge caching for HTML pages — ISR-compatible stale-while-revalidate
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Redirects for SEO — handle common patterns & old URLs
  async redirects() {
    return [
      // Trailing slash normalization (catch-all)
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Common alternative URL patterns people might try
      {
        source: '/tools',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/',
        permanent: true,
      },
      {
        source: '/reviews',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/compare',
        destination: '/search',
        permanent: false,
      },
      {
        source: '/pricing',
        destination: '/search',
        permanent: false,
      },
      // RSS aliases
      {
        source: '/rss',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/atom.xml',
        destination: '/feed.xml',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
