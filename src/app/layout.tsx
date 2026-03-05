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
        {/* Preconnect to logo CDN for faster image loads */}
        <link rel="preconnect" href="https://logo.clearbit.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        {/* Google Analytics (GA4) — set NEXT_PUBLIC_GA_ID env var */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
        {/* Google AdSense — set NEXT_PUBLIC_ADSENSE_ID env var */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
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
        <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-extrabold gradient-text hover:opacity-80 transition-opacity">
              {SITE_NAME}
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="/ai-tools" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">AI Tools</a>
              <a href="/saas" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">SaaS</a>
              <a href="/ecommerce" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">E-commerce</a>
              <a href="/marketing" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">Marketing</a>
              <a href="/hosting" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">Hosting</a>
              <a href="/business" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">Business</a>
              <a href="/best" className="relative hover:text-purple-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 after:transition-all hover:after:w-full">Best Of</a>
              <a href="/blog" className="relative hover:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">Blog</a>
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
