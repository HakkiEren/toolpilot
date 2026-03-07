'use client';

import Link from 'next/link';
import { CATEGORY_LIST } from '@/lib/constants';

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/30 dark:from-gray-900 dark:via-amber-950/10 dark:to-orange-950/10 rounded-3xl border border-amber-200/60 dark:border-amber-800/30 p-8 md:p-12 text-center max-w-xl w-full">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-2">Category Unavailable</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            We couldn&apos;t load this category right now. Please try again or explore other categories.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-md cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Home
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border border-gray-200/40 dark:border-gray-700/40"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
