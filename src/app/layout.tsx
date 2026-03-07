import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SEO, CATEGORY_LIST } from '@/lib/constants';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NewsletterPopup } from '@/components/ui/NewsletterPopup';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

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
        {/* RSS Feed auto-discovery */}
        <link rel="alternate" type="application/rss+xml" title="ToolPilot RSS Feed" href="/feed.xml" />
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preconnect" href="https://logo.clearbit.com" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <link rel="preconnect" href="https://gqqgbfoniyfbpbognnks.supabase.co" />
        <link rel="dns-prefetch" href="https://gqqgbfoniyfbpbognnks.supabase.co" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* Google Analytics (GA4) */}
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
        {/* Google AdSense */}
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
        {/* Accessibility: Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50" role="banner">
          <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" aria-label="Primary navigation">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity" aria-label={`${SITE_NAME} homepage`}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-extrabold gradient-text">{SITE_NAME}</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
              {CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />
              <Link
                href="/best"
                className="px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all"
              >
                Best Of
              </Link>
              <Link
                href="/blog"
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all"
              >
                Blog
              </Link>
              <Link
                href="/search"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-all"
                aria-label="Search tools"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              <ThemeToggle />
            </div>
            <MobileMenu />
          </nav>
        </header>

        {/* Main */}
        <main id="main-content" className="min-h-screen">{children}</main>

        {/* Newsletter Popup */}
        <NewsletterPopup />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
