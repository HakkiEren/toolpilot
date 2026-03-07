'use client';

import Link from 'next/link';

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/10 dark:to-indigo-950/10 rounded-3xl border border-blue-200/60 dark:border-blue-800/30 p-8 md:p-12 text-center max-w-xl w-full">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-2">Tool Review Unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t load this tool review. It may be temporarily unavailable.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/search"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Search Tools
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
