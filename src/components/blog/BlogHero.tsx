// ============================================================
// BlogHero — Dynamic featured image for blog posts
// Uses generated image as background with overlay content
// ============================================================

import Image from 'next/image';

interface BlogHeroProps {
  title: string;
  slug: string;
  categorySlug: string | null;
  categoryName: string | null;
  readingTime: number;
  author: string;
}

// Category icons
const CATEGORY_ICONS: Record<string, string> = {
  'ai-tools': '\u{1F9E0}',
  'saas': '\u{2601}\u{FE0F}',
  'ecommerce': '\u{1F6D2}',
  'marketing': '\u{1F4E2}',
  'hosting': '\u{1F5A5}\u{FE0F}',
  'business': '\u{1F4BC}',
};

export function BlogHero({ title, slug, categorySlug, categoryName, readingTime, author }: BlogHeroProps) {
  const icon = (categorySlug && CATEGORY_ICONS[categorySlug]) || '\u{1F4DD}';

  return (
    <div className="relative overflow-hidden rounded-2xl mb-10 aspect-[21/9] md:aspect-[21/8]">
      {/* Generated featured image as background */}
      <Image
        src={`/api/blog-image/${slug}`}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-5 md:px-8 md:py-6">
        {/* Category badge */}
        {categoryName && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white/90 backdrop-blur-sm border border-white/10 mb-3">
            <span>{icon}</span>
            {categoryName}
          </span>
        )}

        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight max-w-3xl drop-shadow-lg">
          {title}
        </h1>

        {/* Meta info bar */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {author}
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min read
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-xs font-medium">
            ProPicked
          </span>
        </div>
      </div>
    </div>
  );
}
