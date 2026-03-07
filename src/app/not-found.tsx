import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Premium 404 Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12 text-center max-w-2xl w-full">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative">
          {/* Animated 404 */}
          <div className="text-[120px] md:text-[160px] font-black leading-none gradient-text mb-2 select-none">
            404
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s help you find what you need.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Link
              href="/"
              className="glow-pulse px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
            >
              Go Home
            </Link>
            <Link
              href="/search"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Search Tools
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Read Blog
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

          {/* Popular Links */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs text-gray-400">
            <span>Popular:</span>
            <Link href="/ai-tools/chatgpt" className="text-blue-500 hover:underline">ChatGPT</Link>
            <span>·</span>
            <Link href="/ai-tools/compare/chatgpt-vs-claude" className="text-blue-500 hover:underline">ChatGPT vs Claude</Link>
            <span>·</span>
            <Link href="/best/ai-coding" className="text-blue-500 hover:underline">Best AI Coding</Link>
            <span>·</span>
            <Link href="/best/ai-writing" className="text-blue-500 hover:underline">Best AI Writing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
