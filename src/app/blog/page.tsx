import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SEO, SITE_NAME } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AdBanner, AdMultiplex } from '@/components/ads/AdSlot';

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
  },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  guides: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  tutorials: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  comparisons: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
  reviews: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  news: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

const GRADIENT_COLORS = [
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-green-400 to-teal-500',
  'from-orange-400 to-red-500',
  'from-cyan-400 to-blue-500',
  'from-rose-400 to-purple-500',
];

export default async function BlogIndexPage() {
  const posts = await getBlogPosts(200);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  // Group posts by category for stats
  const categoryMap: Record<string, number> = {};
  posts.forEach((p) => {
    const cat = p.categorySlug || 'guides';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  // Featured post = first/latest post
  const featured = posts[0];
  const restPosts = posts.slice(1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '' },
          ]}
        />

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
              const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.guides;
              const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');
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
              <Link
                href={`/blog/${featured.slug}`}
                className="group block mb-10 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="grid md:grid-cols-2">
                  <div className={`h-48 md:h-auto bg-gradient-to-br ${GRADIENT_COLORS[0]}`} />
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Featured</span>
                      {featured.categorySlug && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[featured.categorySlug]?.bg || 'bg-gray-100'} ${CATEGORY_COLORS[featured.categorySlug]?.text || 'text-gray-600'}`}>
                            {featured.categorySlug.charAt(0).toUpperCase() + featured.categorySlug.slice(1)}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(featured.author || 'T')[0]}
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">
                          {featured.author || 'ToolPilot Team'}
                        </span>
                      </div>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <time dateTime={featured.publishedAt}>
                        {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="ml-auto text-blue-600 font-medium group-hover:underline">
                        Read Article &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Ad: After Featured Post */}
            <AdBanner />

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restPosts.map((post, idx) => {
                const gradientIdx = (idx + 1) % GRADIENT_COLORS.length;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group hover-lift card-animate flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all overflow-hidden bg-white dark:bg-gray-900"
                    style={{ animationDelay: `${(idx % 9) * 60}ms` }}
                  >
                    {/* Color header */}
                    <div className={`h-2 bg-gradient-to-r ${GRADIENT_COLORS[gradientIdx]}`} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Category Badge */}
                      {post.categorySlug && (
                        <span className={`self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${CATEGORY_COLORS[post.categorySlug]?.bg || 'bg-gray-100'} ${CATEGORY_COLORS[post.categorySlug]?.text || 'text-gray-600'}`}>
                          {post.categorySlug.charAt(0).toUpperCase() + post.categorySlug.slice(1)}
                        </span>
                      )}

                      {/* Title */}
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Footer: Author + Date */}
                      <div className="mt-4 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {(post.author || 'T')[0]}
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 truncate text-xs">
                            {post.author || 'ToolPilot Team'}
                          </span>
                        </div>
                        <time
                          dateTime={post.publishedAt}
                          className="text-gray-400 dark:text-gray-500 text-xs flex-shrink-0"
                        >
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
