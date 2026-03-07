'use client';

// ============================================================
// TOOL GRID — Client-side sortable + filterable tool list
// Works with SSG pages — tools are passed as props, all filtering
// happens in the browser for instant interaction.
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ToolLogo } from '@/components/common/ToolLogo';

interface ToolGridTool {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  tagline: string;
  logoUrl: string;
  subcategorySlug: string;
  ratings: {
    overall: number;
    easeOfUse: number;
    features: number;
    valueForMoney: number;
    support: number;
  };
  pricing: {
    hasFreeplan: boolean;
    startingPrice: number | null;
  };
}

type SortOption = 'rating' | 'name' | 'price-low' | 'price-high' | 'ease' | 'value';

interface ToolGridProps {
  tools: ToolGridTool[];
  categorySlug: string;
  categoryName: string;
}

export function ToolGrid({ tools, categorySlug, categoryName }: ToolGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [filterFree, setFilterFree] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sortedAndFiltered = useMemo(() => {
    let result = [...tools];

    // Filter: free plan
    if (filterFree) {
      result = result.filter(t => t.pricing.hasFreeplan);
    }

    // Filter: search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.ratings.overall - a.ratings.overall);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result.sort((a, b) => (a.pricing.startingPrice ?? 999) - (b.pricing.startingPrice ?? 999));
        break;
      case 'price-high':
        result.sort((a, b) => (b.pricing.startingPrice ?? 0) - (a.pricing.startingPrice ?? 0));
        break;
      case 'ease':
        result.sort((a, b) => b.ratings.easeOfUse - a.ratings.easeOfUse);
        break;
      case 'value':
        result.sort((a, b) => b.ratings.valueForMoney - a.ratings.valueForMoney);
        break;
    }

    return result;
  }, [tools, sortBy, filterFree, searchQuery]);

  return (
    <section>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">
          All {categoryName} ({sortedAndFiltered.length}{sortedAndFiltered.length !== tools.length ? ` of ${tools.length}` : ''})
        </h2>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-44 pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Free Filter Toggle */}
          <button
            onClick={() => setFilterFree(!filterFree)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              filterFree
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800'
                : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
            }`}
          >
            {filterFree ? '✓ ' : ''}Free Plans
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="name">Sort: A → Z</option>
            <option value="price-low">Sort: Price ↑</option>
            <option value="price-high">Sort: Price ↓</option>
            <option value="ease">Sort: Easiest</option>
            <option value="value">Sort: Best Value</option>
          </select>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedAndFiltered.map((tool, idx) => (
          <Link
            key={tool.id}
            href={`/${categorySlug}/${tool.slug}`}
            className="group hover-lift flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-white dark:bg-gray-900"
          >
            {/* Rank */}
            <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-6 text-right mt-1">
              {idx + 1}
            </span>

            {/* Logo */}
            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold group-hover:text-blue-600 transition-colors truncate">
                  {tool.name}
                </h3>
                <span className="flex items-center gap-0.5 text-sm flex-shrink-0">
                  <span className="text-yellow-500">&#9733;</span>
                  <span className="font-medium">{tool.ratings.overall.toFixed(1)}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{tool.tagline}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                {tool.pricing.hasFreeplan && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">
                    Free
                  </span>
                )}
                {tool.pricing.startingPrice != null && (
                  <span className="text-gray-400">
                    From ${tool.pricing.startingPrice}/mo
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedAndFiltered.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No tools match your filters.</p>
          <button
            onClick={() => { setFilterFree(false); setSearchQuery(''); setSortBy('rating'); }}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
