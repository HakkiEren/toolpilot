'use client';

import { SITE_NAME } from '@/lib/constants';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-red-950/20 dark:to-orange-950/10 rounded-3xl border border-red-200/60 dark:border-red-900/40 p-8 md:p-12 text-center max-w-2xl w-full shadow-xl">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-400/10 dark:bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Something Went Wrong</h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-2">
                We encountered an unexpected error. Our team has been notified.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-6">Error ID: {error.digest}</p>
              )}

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => reset()}
                  className="px-7 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-sm hover:from-red-700 hover:to-orange-700 transition-all shadow-lg shadow-red-600/25 cursor-pointer"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
                >
                  Go to {SITE_NAME}
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
