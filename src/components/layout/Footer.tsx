import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';

// ============================================================
// Professional Footer — Multi-column mega footer
// ============================================================

const POPULAR_COMPARISONS = [
  { label: 'ChatGPT vs Claude', href: '/ai-tools/compare/chatgpt-vs-claude' },
  { label: 'Shopify vs WooCommerce', href: '/ecommerce/compare/shopify-vs-woocommerce' },
  { label: 'Ahrefs vs Semrush', href: '/marketing/compare/ahrefs-vs-semrush' },
  { label: 'HubSpot vs Salesforce', href: '/saas/compare/hubspot-vs-salesforce' },
  { label: 'Vercel vs Netlify', href: '/hosting/compare/vercel-vs-netlify' },
  { label: 'QuickBooks vs Xero', href: '/business/compare/quickbooks-vs-xero' },
  { label: 'Zapier vs Make', href: '/business/compare/zapier-vs-make' },
  { label: 'Stripe vs PayPal', href: '/ecommerce/compare/stripe-vs-paypal' },
];

const POPULAR_TOOLS = [
  { label: 'ChatGPT Review', href: '/ai-tools/chatgpt' },
  { label: 'Shopify Review', href: '/ecommerce/shopify' },
  { label: 'Notion Review', href: '/saas/notion' },
  { label: 'Mailchimp Review', href: '/marketing/mailchimp' },
  { label: 'Vercel Review', href: '/hosting/vercel' },
  { label: 'QuickBooks Review', href: '/business/quickbooks' },
];

const BEST_OF_LINKS = [
  { label: 'Best AI Writing Tools', href: '/ai-tools/best/ai-writing' },
  { label: 'Best CRM Software', href: '/saas/best/crm' },
  { label: 'Best Email Marketing', href: '/marketing/best/email-marketing' },
  { label: 'Best WordPress Hosting', href: '/hosting/best/wordpress-hosting' },
  { label: 'Best Store Builders', href: '/ecommerce/best/store-builders' },
  { label: 'Best Accounting Tools', href: '/business/best/accounting' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white">Stay Ahead of the Curve</h3>
              <p className="text-blue-100 text-sm mt-1">
                Get weekly tool reviews, comparison guides, and exclusive deals in your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                readOnly
              />
              <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
              Unbiased tool comparisons powered by data, not sponsorships. We help you make smarter software decisions.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                200+ Tools Reviewed
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                100% Independent
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Updated {year}
              </span>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/toolpilot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group" aria-label="Twitter">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com/@toolpilot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group" aria-label="YouTube">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://linkedin.com/company/toolpilot" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group" aria-label="LinkedIn">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORY_LIST.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Comparisons */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Popular</h4>
            <ul className="space-y-2.5">
              {POPULAR_COMPARISONS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Best Of */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Best Of</h4>
            <ul className="space-y-2.5">
              {BEST_OF_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/search" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Search Tools</Link></li>
              {POPULAR_TOOLS.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {year} {SITE_NAME}. All rights reserved. All trademarks are the property of their respective owners.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Made with data, not ads</span>
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <span>{year} Edition</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
