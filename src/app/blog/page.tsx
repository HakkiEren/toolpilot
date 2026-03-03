import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SEO, SITE_NAME } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

// ============================================================
// Blog Index Page — Editorial content hub for topical authority
// ============================================================

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Blog — Expert Guides & Tool Reviews | ${SITE_NAME}`,
  description: `Read expert guides, in-depth tool reviews, and industry insights from the ${SITE_NAME} team. Stay informed about AI tools, SaaS, marketing, and more.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog — Expert Guides & Tool Reviews | ${SITE_NAME}`,
    description: `Read expert guides, in-depth tool reviews, and industry insights from the ${SITE_NAME} team.`,
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts(50);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

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

        {/* Page Header */}
        <div className="mt-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {SITE_NAME} Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Expert guides, in-depth tool reviews, and actionable insights to help
            you choose the right software for your business.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                {/* Category Badge */}
                {post.categorySlug && (
                  <span className="self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-3">
                    {post.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
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

                {/* Footer: Date + Read More */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <time
                    dateTime={post.publishedAt}
                    className="text-gray-400 dark:text-gray-500"
                  >
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Read More &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No blog posts published yet</p>
            <p className="text-sm">
              We are working on expert guides and tool reviews. Check back soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
