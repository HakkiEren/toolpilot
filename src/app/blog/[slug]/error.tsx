'use client';

import Link from 'next/link';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50/30 to-rose-50/30 dark:from-gray-900 dark:via-purple-950/10 dark:to-pink-950/10 rounded-3xl border border-purple-200/60 dark:border-purple-800/30 p-8 md:p-12 text-center max-w-xl w-full">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-2">Article Unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t load this article right now. Please try again or browse our blog.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-md cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/blog"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              All Articles
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
