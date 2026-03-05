import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogPosts, getToolBySlug } from '@/lib/data';
import { generateBlogSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SEO, SITE_NAME, CATEGORIES } from '@/lib/constants';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { AdBanner, AdInArticle } from '@/components/ads/AdSlot';
import type { InternalLink } from '@/types';

// ============================================================
// Blog Post Page — Individual article with related tools & links
// ============================================================

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getBlogPosts(200);
  return posts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle || `${post.title}${SEO.titleSuffix}`,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  // Fetch all posts for prev/next navigation
  const allPosts = await getBlogPosts(100);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Build related tool links
  const relatedLinks: InternalLink[] = [];

  // Add related tools
  if (post.relatedToolSlugs && post.relatedToolSlugs.length > 0) {
    for (const toolRef of post.relatedToolSlugs) {
      // toolRef may be "category/slug" or just "slug"
      const parts = toolRef.split('/');
      if (parts.length === 2) {
        const tool = await getToolBySlug(parts[0], parts[1]);
        if (tool) {
          relatedLinks.push({
            url: `/${tool.categorySlug}/${tool.slug}`,
            text: tool.name,
            type: 'sibling',
          });
        }
      }
    }
  }

  // Add related comparison links
  if (post.relatedComparisonSlugs && post.relatedComparisonSlugs.length > 0) {
    for (const compRef of post.relatedComparisonSlugs) {
      // compRef format: "category/comparison-slug"
      const parts = compRef.split('/');
      if (parts.length === 2) {
        relatedLinks.push({
          url: `/${parts[0]}/compare/${parts[1]}`,
          text: `Compare ${parts[1].replace(/-vs-/g, ' vs ')}`,
          type: 'comparison',
        });
      }
    }
  }

  // Add category hub link if post has a category
  if (post.categorySlug) {
    const cat = CATEGORIES[post.categorySlug];
    if (cat) {
      relatedLinks.push({
        url: `/${cat.slug}`,
        text: cat.name,
        type: 'hub',
      });
    }
  }

  // JSON-LD schemas
  const blogSchema = generateBlogSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: '' },
          ]}
        />

        <div className="mt-8 grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Main Article Content */}
          <article className="min-w-0">
            {/* Article Header */}
            <header className="mb-10">
              {/* Category Badge */}
              {post.categorySlug && (
                <Link
                  href={`/${post.categorySlug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors mb-4"
                >
                  {post.categorySlug
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <span className="text-gray-400 dark:text-gray-500">
                    (Updated:{' '}
                    <time dateTime={post.updatedAt}>
                      {new Date(post.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    )
                  </span>
                )}
              </div>
            </header>

            {/* Ad: Before Article Body */}
            <AdBanner />

            {/* Article Body */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-lg prose-blockquote:py-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Ad: After Article Body */}
            <AdInArticle />

            {/* Related Tools & Comparisons */}
            {relatedLinks.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  Related Tools & Comparisons
                </h2>
                <RelatedLinks links={relatedLinks} />
              </section>
            )}

            {/* Prev / Next Navigation */}
            <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="grid sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group flex flex-col p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                  >
                    <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      &larr; Previous
                    </span>
                    <span className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group flex flex-col items-end text-right p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
                  >
                    <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                      Next &rarr;
                    </span>
                    <span className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </nav>

            {/* Freshness Signal */}
            <div className="text-sm text-gray-400 mt-8">
              Last updated:{' '}
              {new Date(post.updatedAt || post.publishedAt).toLocaleDateString(
                'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-8">
              {/* About the Author */}
              <div className="glass p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold mb-3">About the Author</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                    {post.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{post.author}</div>
                    <div className="text-xs text-gray-400">{SITE_NAME}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Our team rigorously tests and reviews tools to provide
                  unbiased, data-driven recommendations.
                </p>
              </div>

              {/* Related Tools (sidebar version) */}
              {relatedLinks.filter((l) => l.type === 'sibling').length > 0 && (
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <h3 className="font-semibold mb-4">Mentioned Tools</h3>
                  <div className="space-y-3">
                    {relatedLinks
                      .filter((l) => l.type === 'sibling')
                      .map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                            {link.text[0]}
                          </span>
                          {link.text}
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Browse More */}
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="font-semibold mb-4">Browse Categories</h3>
                <div className="space-y-2">
                  {Object.values(CATEGORIES).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
