// ============================================================
// BlogCard — Reusable premium blog post card component
// Used across: blog index, homepage, category pages, related posts
// ============================================================

import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

// Category display configuration
const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  'ai-tools':   { label: 'AI Tools',    color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  'saas':       { label: 'SaaS',        color: 'text-blue-700 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/30' },
  'ecommerce':  { label: 'E-commerce',  color: 'text-green-700 dark:text-green-400',   bg: 'bg-green-100 dark:bg-green-900/30' },
  'marketing':  { label: 'Marketing',   color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  'hosting':    { label: 'Hosting',     color: 'text-red-700 dark:text-red-400',       bg: 'bg-red-100 dark:bg-red-900/30' },
  'business':   { label: 'Business',    color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

export interface BlogCardPost {
  slug: string;
  title: string;
  excerpt?: string;
  categorySlug?: string | null;
  author?: string;
  publishedAt?: string;
  content?: string;
}

interface BlogCardProps {
  post: BlogCardPost;
  variant?: 'default' | 'featured' | 'compact';
  priority?: boolean;
  animationDelay?: number;
}

function getReadingTime(content?: string): number {
  if (!content) return 5;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

function getCategoryLabel(slug: string | null | undefined): string {
  if (!slug) return '';
  return CATEGORY_META[slug]?.label || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function BlogCard({ post, variant = 'default', priority = false, animationDelay = 0 }: BlogCardProps) {
  const catMeta = post.categorySlug ? CATEGORY_META[post.categorySlug] : null;
  const catLabel = getCategoryLabel(post.categorySlug);
  const author = post.author || `${SITE_NAME} Team`;
  const readingTime = getReadingTime(post.content);
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const shortDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  // ── FEATURED VARIANT ─────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block mb-10 overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900"
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative h-56 md:h-80 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/blog-image/${post.slug}`}
              alt={`${post.title} - ${catLabel || 'Blog'} | ${SITE_NAME}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            {/* Category badge overlay */}
            {catMeta && (
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm ${catMeta.color}`}>
                  {catLabel}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Featured</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} min read
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight tracking-tight">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400 mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {author[0]}
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">{author}</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="text-gray-400">
                  {dateStr}
                </time>
              )}
              <span className="ml-auto text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                Read Article &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── COMPACT VARIANT ───────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group hover-lift flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 overflow-hidden bg-white dark:bg-gray-900"
      >
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/blog-image/${post.slug}`}
            alt={`${post.title} - ${catLabel || 'Blog'} | ${SITE_NAME}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          {catMeta && (
            <span className={`self-start inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold mb-2 ${catMeta.bg} ${catMeta.color}`}>
              {catLabel}
            </span>
          )}
          <h3 className="font-semibold text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
              {post.excerpt}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
            <span>{author}</span>
            <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{shortDate}</time>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ── DEFAULT VARIANT ───────────────────────────────────────
  return (
    <article>
      <Link
        href={`/blog/${post.slug}`}
        className="group hover-lift card-animate flex flex-col rounded-2xl border border-gray-200/80 dark:border-gray-800/80 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900"
        style={animationDelay ? { animationDelay: `${animationDelay}ms` } : undefined}
      >
        {/* Image with overlay */}
        <div className="relative h-48 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/blog-image/${post.slug}`}
            alt={`${post.title} - ${catLabel || 'Blog'} | ${SITE_NAME}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading={priority ? 'eager' : 'lazy'}
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          {/* Category badge overlay */}
          {catMeta && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md bg-white/85 dark:bg-gray-900/85 shadow-sm ${catMeta.color}`}>
                {catLabel}
              </span>
            </div>
          )}
          {/* Reading time badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-md bg-white/85 dark:bg-gray-900/85 text-gray-600 dark:text-gray-300 shadow-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Title */}
          <h2 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug tracking-tight">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Footer: Author + Date + Arrow */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {author[0]}
              </div>
              <span className="text-gray-500 dark:text-gray-400 truncate text-xs font-medium">
                {author}
              </span>
            </div>
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="text-gray-400 dark:text-gray-500 text-xs flex-shrink-0"
              >
                {shortDate}
              </time>
            )}
            <span className="text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
