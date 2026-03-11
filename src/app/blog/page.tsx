import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SITE_NAME, SEO } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EditorialBadge } from '@/components/common/EditorialBadge';
import { AdBanner, AdMultiplex } from '@/components/ads/AdSlot';
import { BlogCard } from '@/components/blog/BlogCard';
import { InlineNewsletterCTA } from '@/components/ui/InlineNewsletterCTA';

// ============================================================
// Blog Index Page — Editorial content hub for topical authority
// ============================================================

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Blog — Expert Guides, Tutorials & Tool Reviews | ${SITE_NAME}`,
  description: `Read expert guides, in-depth tool reviews, comparison roundups, and industry insights from the ${SITE_NAME} team. Covering AI tools, SaaS, marketing, hosting, e-commerce and more.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog — Expert Guides & Tool Reviews | ${SITE_NAME}`,
    description: `Read expert guides, in-depth tool reviews, and industry insights from the ${SITE_NAME} team.`,
    url: `${SITE_URL}/blog`,
    type: 'website',
    siteName: SITE_NAME,
    locale: SEO.locale,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitterHandle,
    title: `Blog — Expert Guides & Tool Reviews | ${SITE_NAME}`,
    description: `Read expert guides, in-depth tool reviews, and industry insights from the ${SITE_NAME} team.`,
  },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'ai-tools':   { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  'saas':       { bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-700 dark:text-blue-400' },
  'ecommerce':  { bg: 'bg-green-100 dark:bg-green-900/30',   text: 'text-green-700 dark:text-green-400' },
  'marketing':  { bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-400' },
  'hosting':    { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-700 dark:text-red-400' },
  'business':   { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts(200);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  // Group posts by category for stats
  const categoryMap: Record<string, number> = {};
  posts.forEach((p) => {
    if (p.categorySlug) {
      categoryMap[p.categorySlug] = (categoryMap[p.categorySlug] || 0) + 1;
    }
  });

  // Featured post = first/latest post
  const featured = posts[0];
  const restPosts = posts.slice(1);

  // CollectionPage + ItemList schema for blog index
  const blogCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${SITE_NAME} Blog`,
    description: `Expert guides, tool reviews, and industry insights from the ${SITE_NAME} team.`,
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '' },
          ]}
        />
        <EditorialBadge lastUpdated={new Date().toISOString().split('T')[0]} />

        {/* Page Header — Premium glassmorphism */}
        <div className="mt-6 mb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 dark:from-gray-900 dark:via-purple-950/10 dark:to-pink-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-6 md:p-8">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-pink-400/10 dark:bg-pink-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                {posts.length} Articles Published
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                <span className="gradient-text">{SITE_NAME} Blog</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                Expert guides, in-depth tool reviews, and actionable insights to help
                you choose the right software for your business.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter Chips — linked to category pages for internal linking */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-md shadow-blue-500/20">
            All ({posts.length})
          </span>
          {Object.entries(categoryMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => {
              const defaultColors = { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400' };
              const colors = CATEGORY_COLORS[cat] || defaultColors;
              const catLabel = cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              return (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity ${colors.bg} ${colors.text}`}
                >
                  {catLabel} ({count})
                </Link>
              );
            })}
        </div>

        {posts.length > 0 ? (
          <>
            {/* Featured Post */}
            {featured && (
              <BlogCard post={featured} variant="featured" priority />
            )}

            {/* Ad: After Featured Post */}
            <AdBanner />

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restPosts.map((post, idx) => (
                <React.Fragment key={post.slug}>
                  <BlogCard
                    post={post}
                    animationDelay={(idx % 9) * 60}
                    priority={idx < 3}
                  />
                  {/* Newsletter CTA after every 6 posts */}
                  {idx === 5 && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <InlineNewsletterCTA />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No blog posts published yet</p>
            <p className="text-sm">
              We are working on expert guides and tool reviews. Check back soon!
            </p>
          </div>
        )}

        {/* Ad: Before CTA */}
        <AdMultiplex className="mt-10" />

        {/* Bottom CTA — Dark premium card */}
        <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-center text-white shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl font-extrabold mb-2">Looking for Specific Tools?</h2>
            <p className="text-sm text-gray-300 mb-6">
              Browse our tool reviews and side-by-side comparisons to find the perfect software.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/search" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-bold hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 transition-all">
                Search Tools
              </Link>
              <Link href="/glossary" className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                Tech Glossary
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
