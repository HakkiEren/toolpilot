'use client';

import Link from 'next/link';

export default function CompareError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-indigo-950/10 dark:to-blue-950/10 rounded-3xl border border-indigo-200/60 dark:border-indigo-800/30 p-8 md:p-12 text-center max-w-xl w-full">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-2">Comparison Unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t load this comparison. Please try again or explore other comparisons.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-md cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/search"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Search
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
