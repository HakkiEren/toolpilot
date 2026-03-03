import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for external logos
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Strict mode for better development
  reactStrictMode: true,

  // Headers for security & caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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
