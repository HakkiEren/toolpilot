import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SEO } from '@/lib/constants';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NewsletterPopup } from '@/components/ui/NewsletterPopup';
import { Footer } from '@/components/layout/Footer';

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
        <Footer />
      </body>
    </html>
  );
}
