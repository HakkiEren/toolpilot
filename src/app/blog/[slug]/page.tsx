import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogPosts, getToolBySlug, getComparisonsByCategory } from '@/lib/data';
import { generateBlogSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_URL, SEO, SITE_NAME, CATEGORIES, SUBCATEGORIES } from '@/lib/constants';
import { getAuthor, getAuthorUrl } from '@/lib/authors';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { RelatedLinks } from '@/components/common/RelatedLinks';
import { AdBanner, AdInArticle, AdSidebar } from '@/components/ads/AdSlot';
import { ShareButtons } from '@/components/common/ShareButtons';
import { CopyLinkButton } from '@/components/common/CopyLinkButton';
import { ReadingProgress } from '@/components/common/ReadingProgress';
import { InlineNewsletterCTA } from '@/components/ui/InlineNewsletterCTA';
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
      section: post.categorySlug
        ? post.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        : 'Technology',
      tags: post.relatedToolSlugs?.map(s => s.split('/').pop()).filter(Boolean) as string[] || [],
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

  // Fetch category comparisons for cross-linking
  const categoryComparisons = post.categorySlug
    ? await getComparisonsByCategory(post.categorySlug, 6)
    : [];

  // Get subcategories for best-of linking
  const categorySubcategories = post.categorySlug
    ? (SUBCATEGORIES[post.categorySlug] || []).slice(0, 6)
    : [];

  // Get cross-category suggestions (exclude current category)
  const crossCategories = Object.values(CATEGORIES)
    .filter((c) => c.slug !== post.categorySlug)
    .slice(0, 4);

  // Reading time estimate (avg 200 words/min)
  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  // JSON-LD schemas
  const blogSchema = generateBlogSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <ReadingProgress />
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
            {/* Article Header — Premium magazine style */}
            <header className="mb-10">
              {/* Category Badge */}
              {post.categorySlug && (
                <Link
                  href={`/${post.categorySlug}`}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:from-blue-200 hover:to-indigo-200 dark:hover:bg-blue-900/50 transition-colors mb-4 shadow-sm"
                >
                  {post.categorySlug
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Speakable excerpt for voice search */}
              {post.excerpt && (
                <p data-speakable="true" className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {/* Author with avatar — uses centralized author data */}
                {(() => {
                  const headerAuthor = getAuthor(post.author);
                  return (
                    <Link href={`/about/team#${headerAuthor.slug}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${headerAuthor.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {headerAuthor.initials}
                      </div>
                      <span className="font-medium">{post.author}</span>
                    </Link>
                  );
                })()}
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} min read
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

              {/* Share buttons — below meta info */}
              <div className="mt-4 flex items-center gap-2">
                <ShareButtons
                  url={`${SITE_URL}/blog/${slug}`}
                  title={post.title}
                  description={post.excerpt}
                />
                <CopyLinkButton url={`${SITE_URL}/blog/${slug}`} />
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

            {/* Share buttons — after article body */}
            <div className="mt-8 mb-6 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Found this article helpful? Share it!</p>
              <ShareButtons
                url={`${SITE_URL}/blog/${slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>

            {/* Ad: After Article Body */}
            <AdInArticle />

            {/* Inline Newsletter CTA — Blog subscriber conversion */}
            <InlineNewsletterCTA />

            {/* Related Tools & Comparisons */}
            {relatedLinks.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  Related Tools & Comparisons
                </h2>
                <RelatedLinks links={relatedLinks} />
              </section>
            )}

            {/* Popular Comparisons — Cross-link to comparison pages */}
            {categoryComparisons.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-2">Popular Comparisons</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  See how top {CATEGORIES[post.categorySlug!]?.name || 'tools'} stack up against each other
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {categoryComparisons.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/${comp.categorySlug}/compare/${comp.slug}`}
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all"
                    >
                      <div className="flex -space-x-2 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 z-10">
                          {comp.toolA?.name?.[0] || 'A'}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
                          {comp.toolB?.name?.[0] || 'B'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {comp.toolA?.name || 'Tool A'} vs {comp.toolB?.name || 'Tool B'}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Side-by-side comparison</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
                {post.categorySlug && (
                  <div className="mt-3 text-center">
                    <Link
                      href={`/${post.categorySlug}/compare`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      View all {CATEGORIES[post.categorySlug]?.name} comparisons
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                )}
              </section>
            )}

            {/* Best Tools — Link to best-of pages for subcategories */}
            {categorySubcategories.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-2">Best Tools by Category</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Expert-curated rankings to help you find the right tool
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categorySubcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/best/${sub.slug}`}
                      className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-amber-500 text-sm">🏆</span>
                        <h3 className="font-semibold text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          Best {sub.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Explore More Categories — Cross-category internal links */}
            {crossCategories.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-2">Explore More Categories</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Discover top-rated tools across different verticals
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {crossCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="group text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${cat.color}15` }}
                      >
                        {cat.icon === 'brain' ? '🧠' : cat.icon === 'cloud' ? '☁️' : cat.icon === 'shopping-cart' ? '🛒' : cat.icon === 'megaphone' ? '📢' : cat.icon === 'server' ? '🖥️' : cat.icon === 'briefcase' ? '💼' : '🔧'}
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1">{cat.toolCount}+ tools</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Blog Posts — Internal linking for SEO */}
            {(() => {
              const relatedPosts = allPosts
                .filter((p) => p.slug !== slug)
                .filter((p) => post.categorySlug ? p.categorySlug === post.categorySlug : true)
                .slice(0, 3);
              if (relatedPosts.length === 0) return null;
              return (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="group rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all"
                      >
                        {rp.categorySlug && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 mb-2">
                            {rp.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        )}
                        <h3 className="font-semibold text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                          {rp.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {rp.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                          <span>{rp.author}</span>
                          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                          <time dateTime={rp.publishedAt}>
                            {new Date(rp.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </time>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })()}

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

            {/* Freshness Signal — Enhanced trust badge */}
            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Last updated: {new Date(post.updatedAt || post.publishedAt).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <span>✍️</span>
                <Link href="/about/team" className="hover:text-blue-500 transition-colors">
                  By {post.author}
                </Link>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </article>

          {/* Sidebar — Premium with AdSidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* About the Author — Enhanced E-E-A-T */}
              {(() => {
                const author = getAuthor(post.author);
                return (
                  <div className="glass p-6 rounded-2xl shadow-sm" id={author.slug}>
                    <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">About the Author</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${author.gradient} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
                        {author.initials}
                      </div>
                      <div>
                        <Link href={`/about/team#${author.slug}`} className="font-semibold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {author.name}
                        </Link>
                        <div className="text-xs text-gray-400">{author.role}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                      {author.shortBio}
                    </p>
                    {/* Author Stats */}
                    <div className="flex gap-4 mb-3 py-2 border-t border-b border-gray-200/60 dark:border-gray-700/60">
                      <div className="text-center">
                        <div className="text-sm font-black text-blue-600">{author.articles}</div>
                        <div className="text-[10px] text-gray-400">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black text-purple-600">{author.reviews}</div>
                        <div className="text-[10px] text-gray-400">Reviews</div>
                      </div>
                    </div>
                    {/* Social Links */}
                    <div className="flex gap-2">
                      {author.social.twitter && (
                        <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${author.name} on Twitter`}>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                      {author.social.linkedin && (
                        <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" aria-label={`${author.name} on LinkedIn`}>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                        </a>
                      )}
                      {author.social.github && (
                        <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label={`${author.name} on GitHub`}>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Sidebar Ad */}
              <AdSidebar />

              {/* Related Tools (sidebar version) */}
              {relatedLinks.filter((l) => l.type === 'sibling').length > 0 && (
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80">
                  <h3 className="font-semibold mb-4 text-sm">Mentioned Tools</h3>
                  <div className="space-y-2.5">
                    {relatedLinks
                      .filter((l) => l.type === 'sibling')
                      .map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          className="flex items-center gap-2.5 p-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors -mx-2"
                        >
                          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                            {link.text[0]}
                          </span>
                          {link.text}
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* Best-of Picks (sidebar) */}
              {categorySubcategories.length > 0 && (
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80">
                  <h3 className="font-semibold mb-4 text-sm">🏆 Best-of Rankings</h3>
                  <div className="space-y-2">
                    {categorySubcategories.slice(0, 5).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/best/${sub.slug}`}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors py-1"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                        Best {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Categories */}
              <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80">
                <h3 className="font-semibold mb-4 text-sm">Browse Categories</h3>
                <div className="space-y-1.5">
                  {Object.values(CATEGORIES).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-gray-400">{cat.toolCount}</span>
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
