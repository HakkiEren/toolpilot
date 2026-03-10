import Link from 'next/link';

/**
 * EditorialBadge — Shows editorial review metadata to signal
 * that content has been human-reviewed, not auto-generated.
 *
 * Displays: Reviewed by [Team] · Last updated [Date] · Editorial Policy link
 * Visible to both users and Google crawlers (E-E-A-T signal).
 */
export function EditorialBadge({
  lastUpdated,
  author = 'ProPicked Editorial Team',
}: {
  lastUpdated: string;
  author?: string;
}) {
  const date = new Date(lastUpdated);
  const formatted = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
      <span className="inline-flex items-center gap-1">
        <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Reviewed by{' '}
        <Link href="/about/team" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {author}
        </Link>
      </span>
      <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">·</span>
      <time dateTime={lastUpdated} className="inline-flex items-center gap-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Updated {formatted}
      </time>
      <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">·</span>
      <Link href="/editorial-policy" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Editorial Policy
      </Link>
    </div>
  );
}
