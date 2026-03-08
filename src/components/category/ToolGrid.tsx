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

interface Subcategory {
  slug: string;
  name: string;
}

type SortOption = 'rating' | 'name' | 'price-low' | 'price-high' | 'ease' | 'value';
type ViewMode = 'grid' | 'list';
type RatingFilter = 'all' | '9+' | '8+' | '7+';

interface ToolGridProps {
  tools: ToolGridTool[];
  categorySlug: string;
  categoryName: string;
  subcategories?: Subcategory[];
}

export function ToolGrid({ tools, categorySlug, categoryName, subcategories = [] }: ToolGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [filterFree, setFilterFree] = useState(false);
  const [filterTrial, setFilterTrial] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Determine which subcategories actually have tools
  const availableSubcategories = useMemo(() => {
    if (subcategories.length === 0) return [];
    const toolSubcatSlugs = new Set(tools.map(t => t.subcategorySlug).filter(Boolean));
    return subcategories.filter(sub => toolSubcatSlugs.has(sub.slug));
  }, [tools, subcategories]);

  // Compute stats for filter badges
  const stats = useMemo(() => {
    const freeCount = tools.filter(t => t.pricing.hasFreeplan).length;
    const avg = tools.length > 0 ? tools.reduce((s, t) => s + t.ratings.overall, 0) / tools.length : 0;
    const highRated = tools.filter(t => t.ratings.overall >= 8).length;
    return { freeCount, avg: avg.toFixed(1), highRated };
  }, [tools]);

  const sortedAndFiltered = useMemo(() => {
    let result = [...tools];

    // Filter: subcategory
    if (activeSubcategory !== 'all') {
      result = result.filter(t => t.subcategorySlug === activeSubcategory);
    }

    // Filter: free plan
    if (filterFree) {
      result = result.filter(t => t.pricing.hasFreeplan);
    }

    // Filter: free trial
    if (filterTrial) {
      result = result.filter(t => t.pricing.startingPrice !== null && t.pricing.startingPrice > 0);
    }

    // Filter: rating threshold
    if (ratingFilter !== 'all') {
      const threshold = parseFloat(ratingFilter);
      result = result.filter(t => t.ratings.overall >= threshold);
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
  }, [tools, sortBy, filterFree, filterTrial, ratingFilter, searchQuery, activeSubcategory]);

  const clearAllFilters = () => {
    setFilterFree(false);
    setFilterTrial(false);
    setRatingFilter('all');
    setSearchQuery('');
    setSortBy('rating');
    setActiveSubcategory('all');
  };

  const hasActiveFilters = filterFree || filterTrial || ratingFilter !== 'all' || searchQuery.trim() || activeSubcategory !== 'all';

  // Active filter pills for visibility
  const activeFilterPills: { label: string; onRemove: () => void }[] = [];
  if (filterFree) activeFilterPills.push({ label: 'Free Plans', onRemove: () => setFilterFree(false) });
  if (filterTrial) activeFilterPills.push({ label: 'Paid Only', onRemove: () => setFilterTrial(false) });
  if (ratingFilter !== 'all') activeFilterPills.push({ label: `Rating ${ratingFilter}`, onRemove: () => setRatingFilter('all') });
  if (activeSubcategory !== 'all') {
    const subName = availableSubcategories.find(s => s.slug === activeSubcategory)?.name || activeSubcategory;
    activeFilterPills.push({ label: subName, onRemove: () => setActiveSubcategory('all') });
  }
  if (searchQuery.trim()) activeFilterPills.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') });

  return (
    <section>
      {/* Subcategory Tabs */}
      {availableSubcategories.length > 1 && (
        <div className="mb-5 -mx-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 px-1 min-w-max">
            <button
              onClick={() => setActiveSubcategory('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeSubcategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              All ({tools.length})
            </button>
            {availableSubcategories.map((sub) => {
              const count = tools.filter(t => t.subcategorySlug === sub.slug).length;
              return (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSubcategory(sub.slug === activeSubcategory ? 'all' : sub.slug)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeSubcategory === sub.slug
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {sub.name.replace(/ Tools?$/i, '')} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Top row: title + view toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {activeSubcategory !== 'all'
              ? `${availableSubcategories.find(s => s.slug === activeSubcategory)?.name || categoryName} (${sortedAndFiltered.length})`
              : `All ${categoryName} (${sortedAndFiltered.length}${sortedAndFiltered.length !== tools.length ? ` of ${tools.length}` : ''})`
            }
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filter + sort row */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
            className={`px-3 py-2 text-xs font-medium border rounded-lg outline-none cursor-pointer transition-all ${
              ratingFilter !== 'all'
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800'
                : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700'
            }`}
          >
            <option value="all">Any Rating</option>
            <option value="9+">9+ Excellent</option>
            <option value="8+">8+ Very Good ({stats.highRated})</option>
            <option value="7+">7+ Good</option>
          </select>

          {/* Free Filter Toggle */}
          <button
            onClick={() => setFilterFree(!filterFree)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
              filterFree
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800'
                : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
            }`}
          >
            {filterFree ? '✓ ' : ''}Free ({stats.freeCount})
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="name">Sort: A &rarr; Z</option>
            <option value="price-low">Sort: Price &#8593;</option>
            <option value="price-high">Sort: Price &#8595;</option>
            <option value="ease">Sort: Easiest</option>
            <option value="value">Sort: Best Value</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active filter pills */}
        {activeFilterPills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mr-1">Filters:</span>
            {activeFilterPills.map((pill) => (
              <button
                key={pill.label}
                onClick={pill.onRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[11px] font-medium rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                {pill.label}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tool Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedAndFiltered.map((tool, idx) => (
            <ToolCardGrid key={tool.id} tool={tool} idx={idx} categorySlug={categorySlug} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedAndFiltered.map((tool, idx) => (
            <ToolCardList key={tool.id} tool={tool} idx={idx} categorySlug={categorySlug} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedAndFiltered.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium">No tools match your filters.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Try adjusting your criteria or clearing filters.</p>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}

// ============================================================
// GRID CARD — Vertical card with rating bars
// ============================================================
function ToolCardGrid({ tool, idx, categorySlug }: { tool: ToolGridTool; idx: number; categorySlug: string }) {
  const score = tool.ratings.overall;
  const scoreColor = score >= 8 ? 'text-green-600 dark:text-green-400' : score >= 6 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500';
  const scoreBg = score >= 8 ? 'bg-green-100 dark:bg-green-900/30' : score >= 6 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <Link
      href={`/${categorySlug}/${tool.slug}`}
      className="group hover-lift flex flex-col p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-white dark:bg-gray-900"
    >
      {/* Top row: rank, logo, name, score */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-5 text-right flex-shrink-0">
          {idx + 1}
        </span>
        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={40} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold group-hover:text-blue-600 transition-colors truncate">
            {tool.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{tool.tagline}</p>
        </div>
        <div className={`flex-shrink-0 ${scoreBg} ${scoreColor} px-2 py-1 rounded-lg text-center`}>
          <div className="text-lg font-extrabold leading-none">{score.toFixed(1)}</div>
          <div className="text-[9px] opacity-60">/10</div>
        </div>
      </div>

      {/* Mini rating bars */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
        {[
          { label: 'Features', val: tool.ratings.features },
          { label: 'Ease', val: tool.ratings.easeOfUse },
          { label: 'Value', val: tool.ratings.valueForMoney },
          { label: 'Support', val: tool.ratings.support },
        ].map(({ label, val }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px]">
            <span className="w-12 text-gray-400 truncate">{label}</span>
            <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${val >= 8 ? 'bg-green-500' : val >= 6 ? 'bg-yellow-500' : 'bg-red-400'}`}
                style={{ width: `${(val / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: pricing + CTA */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs">
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
        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View review &#8594;
        </span>
      </div>
    </Link>
  );
}

// ============================================================
// LIST CARD — Horizontal compact row with full details
// ============================================================
function ToolCardList({ tool, idx, categorySlug }: { tool: ToolGridTool; idx: number; categorySlug: string }) {
  const score = tool.ratings.overall;
  const scoreColor = score >= 8 ? 'text-green-600 dark:text-green-400' : score >= 6 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500';
  const scoreBg = score >= 8 ? 'bg-green-100 dark:bg-green-900/30' : score >= 6 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const barColor = score >= 8 ? 'bg-green-500' : score >= 6 ? 'bg-yellow-500' : 'bg-red-400';

  return (
    <Link
      href={`/${categorySlug}/${tool.slug}`}
      className="group hover-lift flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-white dark:bg-gray-900"
    >
      {/* Rank */}
      <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-6 text-right flex-shrink-0">
        {idx + 1}
      </span>

      {/* Logo */}
      <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size={36} />

      {/* Name + tagline */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate">
            {tool.name}
          </h3>
          {tool.pricing.hasFreeplan && (
            <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-[10px] font-medium flex-shrink-0">
              Free
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{tool.tagline}</p>
      </div>

      {/* Compact rating bars (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        {[
          { label: 'F', val: tool.ratings.features, title: 'Features' },
          { label: 'E', val: tool.ratings.easeOfUse, title: 'Ease' },
          { label: 'V', val: tool.ratings.valueForMoney, title: 'Value' },
          { label: 'S', val: tool.ratings.support, title: 'Support' },
        ].map(({ label, val, title }) => (
          <div key={label} className="flex flex-col items-center gap-0.5" title={`${title}: ${val.toFixed(1)}/10`}>
            <span className="text-[9px] text-gray-400 font-semibold">{label}</span>
            <div className="w-8 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${val >= 8 ? 'bg-green-500' : val >= 6 ? 'bg-yellow-500' : 'bg-red-400'}`}
                style={{ width: `${(val / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Price (hidden on mobile) */}
      <div className="hidden sm:block text-xs text-gray-400 w-20 text-right flex-shrink-0">
        {tool.pricing.startingPrice != null ? (
          <span>${tool.pricing.startingPrice}/mo</span>
        ) : tool.pricing.hasFreeplan ? (
          <span className="text-green-600 font-medium">Free</span>
        ) : (
          <span>N/A</span>
        )}
      </div>

      {/* Score */}
      <div className={`flex-shrink-0 ${scoreBg} ${scoreColor} w-12 py-1.5 rounded-lg text-center`}>
        <div className="text-sm font-extrabold leading-none">{score.toFixed(1)}</div>
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
