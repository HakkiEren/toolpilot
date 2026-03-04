'use client';

import { useState, useMemo } from 'react';

interface SearchTool {
  slug: string;
  name: string;
  category_slug: string;
  subcategory_slug: string | null;
  tagline: string | null;
  ratings_overall: number;
  logo_url: string | null;
  pricing: {
    hasFreeplan?: boolean;
    hasFreePlan?: boolean;
    startingPrice?: number | null;
  };
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  'ai-tools': { label: 'AI Tools', color: '#8B5CF6' },
  'saas': { label: 'SaaS', color: '#3B82F6' },
  'ecommerce': { label: 'E-commerce', color: '#10B981' },
  'marketing': { label: 'Marketing', color: '#F59E0B' },
  'hosting': { label: 'Hosting', color: '#EF4444' },
  'business': { label: 'Business', color: '#6366F1' },
};

export function SearchClient({ tools }: { tools: SearchTool[] }) {
  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'price'>('rating');

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach((t) => {
      counts[t.category_slug] = (counts[t.category_slug] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, count]) => ({ slug, count }));
  }, [tools]);

  const filtered = useMemo(() => {
    let result = tools.filter((tool) => {
      // Text search
      if (query) {
        const q = query.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchTagline = tool.tagline?.toLowerCase().includes(q);
        const matchCategory = tool.category_slug.toLowerCase().includes(q);
        const matchSubcat = tool.subcategory_slug?.toLowerCase().includes(q);
        if (!matchName && !matchTagline && !matchCategory && !matchSubcat) return false;
      }

      // Price filter
      const hasFree = tool.pricing?.hasFreeplan || tool.pricing?.hasFreePlan;
      if (priceFilter === 'free' && !hasFree) return false;
      if (priceFilter === 'paid' && hasFree) return false;

      // Rating filter
      if (ratingFilter > 0 && tool.ratings_overall < ratingFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && tool.category_slug !== categoryFilter) return false;

      return true;
    });

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      result.sort((a, b) => (a.pricing?.startingPrice ?? 999) - (b.pricing?.startingPrice ?? 999));
    } else {
      result.sort((a, b) => b.ratings_overall - a.ratings_overall);
    }

    return result;
  }, [tools, query, priceFilter, ratingFilter, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Search & Compare Tools
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Instantly search and filter {tools.length}+ tools across AI, SaaS, E-commerce, Marketing, Hosting & Business.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... (e.g. ChatGPT, Shopify, email marketing)"
            className="w-full px-5 py-4 pl-12 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all dark:bg-gray-900 dark:border-gray-700"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {/* Price filter */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(['all', 'free', 'paid'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setPriceFilter(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                priceFilter === v
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v === 'all' ? 'All Prices' : v === 'free' ? 'Free Plans' : 'Paid Only'}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[0, 7, 8, 9].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                ratingFilter === r
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r === 0 ? 'Any Rating' : `${r}+ /10`}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {([
            { key: 'rating', label: 'Top Rated' },
            { key: 'name', label: 'A-Z' },
            { key: 'price', label: 'Lowest Price' },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === s.key
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            categoryFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Categories ({tools.length})
        </button>
        {categories.map(({ slug, count }) => {
          const info = CATEGORY_LABELS[slug];
          return (
            <button
              key={slug}
              onClick={() => setCategoryFilter(slug)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                categoryFilter === slug
                  ? 'text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
              }`}
              style={categoryFilter === slug ? { backgroundColor: info?.color || '#3B82F6' } : {}}
            >
              {info?.label || slug} ({count})
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-6 flex items-center justify-between">
        <span>
          Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filtered.length}</span> of{' '}
          {tools.length} tools
          {query && (
            <span>
              {' '}
              matching &quot;<span className="font-semibold">{query}</span>&quot;
            </span>
          )}
        </span>
        {(query || priceFilter !== 'all' || ratingFilter > 0 || categoryFilter !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setPriceFilter('all');
              setRatingFilter(0);
              setCategoryFilter('all');
              setSortBy('rating');
            }}
            className="text-blue-600 hover:underline text-xs font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => {
          const catInfo = CATEGORY_LABELS[tool.category_slug];
          const hasFree = tool.pricing?.hasFreeplan || tool.pricing?.hasFreePlan;
          return (
            <a
              key={`${tool.category_slug}-${tool.slug}`}
              href={`/${tool.category_slug}/${tool.slug}`}
              className="group block p-5 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-900"
            >
              <div className="flex items-start gap-3 mb-3">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt={tool.name} className="w-10 h-10 rounded-lg object-contain bg-gray-50 dark:bg-gray-800 p-0.5" loading="lazy" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: catInfo?.color || '#3B82F6' }}
                  >
                    {tool.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base group-hover:text-blue-600 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${catInfo?.color || '#3B82F6'}15`,
                        color: catInfo?.color || '#3B82F6',
                      }}
                    >
                      {catInfo?.label || tool.category_slug}
                    </span>
                    <span className="text-xs font-semibold text-yellow-600">
                      &#9733; {tool.ratings_overall}/10
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tool.tagline}</p>
              <div className="flex items-center gap-2">
                {hasFree && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    Free plan
                  </span>
                )}
                {tool.pricing?.startingPrice && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                    From ${tool.pricing.startingPrice}/mo
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">&#128270;</div>
          <h3 className="text-xl font-bold mb-2">No tools found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setPriceFilter('all');
              setRatingFilter(0);
              setCategoryFilter('all');
              setSortBy('rating');
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
