'use client';

import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-red-950/10 dark:to-orange-950/10 rounded-3xl border border-red-200/60 dark:border-red-800/30 p-8 md:p-12 text-center max-w-2xl w-full">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-400/10 dark:bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">Oops! Something went wrong</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-2">
            We hit an unexpected issue loading this page. You can try again or browse our categories below.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-6">Error ID: {error.digest}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <button
              onClick={() => reset()}
              className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Go Home
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Search Tools
            </Link>
          </div>

          {/* Browse Categories */}
          <div className="pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Browse Categories</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="px-3.5 py-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-gray-200/40 dark:border-gray-700/40"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
