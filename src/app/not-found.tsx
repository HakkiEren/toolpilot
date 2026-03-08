import Link from 'next/link';
import { SITE_NAME, CATEGORY_LIST } from '@/lib/constants';

const QUICK_TOOLS = [
  { slug: 'roi', name: 'SaaS ROI Calculator', emoji: '📊' },
  { slug: 'ai-cost', name: 'AI Cost Estimator', emoji: '🤖' },
  { slug: 'ecommerce-profit', name: 'Profit Calculator', emoji: '💰' },
  { slug: 'hosting-cost', name: 'Hosting Cost Calculator', emoji: '🖥️' },
];

const POPULAR_COMPARISONS = [
  { slug: 'ai-tools/compare/chatgpt-vs-claude', label: 'ChatGPT vs Claude' },
  { slug: 'ai-tools/compare/chatgpt-vs-gemini', label: 'ChatGPT vs Gemini' },
  { slug: 'hosting/compare/vercel-vs-netlify', label: 'Vercel vs Netlify' },
  { slug: 'saas/compare/notion-vs-clickup', label: 'Notion vs ClickUp' },
];

const TOP_RANKINGS = [
  { slug: 'ai-coding', label: 'Best AI Coding Tools' },
  { slug: 'ai-writing', label: 'Best AI Writing Tools' },
  { slug: 'ai-chatbots', label: 'Best AI Chatbots' },
  { slug: 'website-builders', label: 'Best Website Builders' },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Premium 404 Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-12 text-center max-w-3xl w-full">
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
              href="/best"
              className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-200/60 dark:border-gray-700/60"
            >
              Best Tools
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

          {/* Popular Comparisons */}
          <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-800/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Comparisons</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_COMPARISONS.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/${comp.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50/80 dark:bg-orange-900/20 rounded-lg text-xs font-medium text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors border border-orange-200/40 dark:border-orange-700/40"
                >
                  <span className="text-[10px] font-bold">VS</span> {comp.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Top Rankings */}
          <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-800/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Top Rankings</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {TOP_RANKINGS.map((rank) => (
                <Link
                  key={rank.slug}
                  href={`/best/${rank.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 dark:bg-amber-900/20 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors border border-amber-200/40 dark:border-amber-700/40"
                >
                  🏆 {rank.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Free Calculators */}
          <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-800/50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Free Calculators</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_TOOLS.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/calculators/${calc.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200/40 dark:border-emerald-700/40"
                >
                  {calc.emoji} {calc.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Glossary + Blog */}
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              📖 Tech Glossary
            </Link>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              📝 Read Blog
            </Link>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <Link
              href="/changelog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline"
            >
              📋 Changelog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
