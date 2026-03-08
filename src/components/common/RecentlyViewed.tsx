'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ToolLogo } from './ToolLogo';

// ============================================================
// RECENTLY VIEWED TOOLS — localStorage-backed browsing history
// Shows tools the user has recently visited for quick re-access
// ============================================================

interface RecentTool {
  slug: string;
  categorySlug: string;
  name: string;
  logoUrl: string;
  rating: number;
  tagline: string;
  hasFree: boolean;
  viewedAt: number; // timestamp
}

const STORAGE_KEY = 'propicked_recently_viewed';
const MAX_ITEMS = 12;

/** Record a tool visit — call this on tool page mount */
export function useRecordToolView(tool: {
  slug: string;
  categorySlug: string;
  name: string;
  logoUrl: string;
  rating: number;
  tagline: string;
  hasFree: boolean;
}) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: RecentTool[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists (will re-add at front)
      const filtered = items.filter(
        (item) => !(item.slug === tool.slug && item.categorySlug === tool.categorySlug)
      );

      // Add to front
      filtered.unshift({
        ...tool,
        viewedAt: Date.now(),
      });

      // Keep max items
      const trimmed = filtered.slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // localStorage not available (SSR, private mode, etc.)
    }
  }, [tool.slug, tool.categorySlug]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Get recently viewed tools from localStorage */
function getRecentTools(excludeSlug?: string, excludeCategorySlug?: string): RecentTool[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const items: RecentTool[] = JSON.parse(stored);

    // Optionally exclude current tool
    if (excludeSlug && excludeCategorySlug) {
      return items.filter(
        (item) => !(item.slug === excludeSlug && item.categorySlug === excludeCategorySlug)
      );
    }
    return items;
  } catch {
    return [];
  }
}

interface RecentlyViewedProps {
  /** Current tool slug to exclude from the list */
  excludeSlug?: string;
  /** Current category slug to pair with excludeSlug */
  excludeCategorySlug?: string;
  /** Max tools to show */
  maxItems?: number;
  /** Title override */
  title?: string;
  /** Visual variant */
  variant?: 'strip' | 'grid' | 'compact';
}

/** Client component to record a tool view (invisible, just runs the hook) */
export function RecordToolView({ tool }: {
  tool: {
    slug: string;
    categorySlug: string;
    name: string;
    logoUrl: string;
    rating: number;
    tagline: string;
    hasFree: boolean;
  };
}) {
  useRecordToolView(tool);
  return null;
}

/** Display recently viewed tools */
export function RecentlyViewed({
  excludeSlug,
  excludeCategorySlug,
  maxItems = 6,
  title = 'Recently Viewed',
  variant = 'strip',
}: RecentlyViewedProps) {
  const [tools, setTools] = useState<RecentTool[]>([]);

  useEffect(() => {
    const recent = getRecentTools(excludeSlug, excludeCategorySlug);
    setTools(recent.slice(0, maxItems));
  }, [excludeSlug, excludeCategorySlug, maxItems]);

  // Clear all recently viewed
  const handleClear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setTools([]);
    } catch {
      // ignore
    }
  }, []);

  // Don't render if no recently viewed tools
  if (tools.length === 0) return null;

  // ---- STRIP VARIANT: Horizontal scroll, compact ----
  if (variant === 'strip') {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
            <span className="text-xs text-gray-400">Pick up where you left off</span>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            title="Clear history"
          >
            Clear
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {tools.map((tool) => (
            <Link
              key={`${tool.categorySlug}-${tool.slug}`}
              href={`/${tool.categorySlug}/${tool.slug}`}
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md group"
            >
              <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={32} />
              <div className="min-w-0">
                <div className="font-semibold text-sm group-hover:text-blue-600 transition-colors whitespace-nowrap">
                  {tool.name}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    {tool.rating.toFixed(1)}/10
                  </span>
                  {tool.hasFree && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                      Free
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // ---- GRID VARIANT: Card grid, richer ----
  if (variant === 'grid') {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tools.map((tool) => {
            const score = tool.rating;
            return (
              <Link
                key={`${tool.categorySlug}-${tool.slug}`}
                href={`/${tool.categorySlug}/${tool.slug}`}
                className="group hover-lift block p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-white dark:bg-gray-900 text-center"
              >
                <div className="flex justify-center mb-3">
                  <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={44} className="shadow-sm" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate mb-1">
                  {tool.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="text-yellow-500 text-xs">&#9733;</span>
                  <span className={`text-xs font-bold ${score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
                {/* Mini score bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(score / 10) * 100}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  // ---- COMPACT VARIANT: Small inline list ----
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h3>
        <button
          onClick={handleClear}
          className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={`${tool.categorySlug}-${tool.slug}`}
            href={`/${tool.categorySlug}/${tool.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 transition-all text-sm group"
          >
            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={20} />
            <span className="font-medium group-hover:text-blue-600 transition-colors">{tool.name}</span>
            <span className="text-xs text-gray-400">{tool.rating.toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
