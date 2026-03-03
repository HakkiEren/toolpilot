import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SEO } from '@/lib/constants';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NewsletterPopup } from '@/components/ui/NewsletterPopup';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Compare the Best Digital Tools`,
    template: `%s${SEO.titleSuffix}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: SEO.locale,
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteSchema()),
          }}
        />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600">
              {SITE_NAME}
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/ai-tools" className="hover:text-blue-600 transition-colors">AI Tools</a>
              <a href="/saas" className="hover:text-blue-600 transition-colors">SaaS</a>
              <a href="/ecommerce" className="hover:text-blue-600 transition-colors">E-commerce</a>
              <a href="/marketing" className="hover:text-blue-600 transition-colors">Marketing</a>
              <a href="/hosting" className="hover:text-blue-600 transition-colors">Hosting</a>
              <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
              <a href="/search" className="hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
            <MobileMenu />
          </nav>
        </header>

        {/* Main */}
        <main className="min-h-screen">{children}</main>

        {/* Newsletter Popup */}
        <NewsletterPopup />

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">{SITE_NAME}</h3>
                <p className="text-sm text-gray-500">
                  Unbiased tool comparisons powered by data, not sponsorships.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/ai-tools" className="hover:text-blue-600">AI Tools</a></li>
                  <li><a href="/saas" className="hover:text-blue-600">SaaS Tools</a></li>
                  <li><a href="/ecommerce" className="hover:text-blue-600">E-commerce</a></li>
                  <li><a href="/marketing" className="hover:text-blue-600">Marketing</a></li>
                  <li><a href="/hosting" className="hover:text-blue-600">Web Hosting</a></li>
                  <li><a href="/business" className="hover:text-blue-600">Business Tools</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
                  <li><a href="/ai-tools/best/ai-chatbots" className="hover:text-blue-600">Best AI Chatbots</a></li>
                  <li><a href="/ai-tools/best/ai-coding" className="hover:text-blue-600">Best AI Coding Tools</a></li>
                  <li><a href="/ai-tools/best/ai-writing" className="hover:text-blue-600">Best AI Writing Tools</a></li>
                  <li><a href="/ai-tools/best/ai-image" className="hover:text-blue-600">Best AI Image Generators</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/about" className="hover:text-blue-600">About Us</a></li>
                  <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
                  <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
