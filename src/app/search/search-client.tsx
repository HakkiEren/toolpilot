'use client';

import { useState, useMemo } from 'react';

interface SearchTool {
  slug: string;
  name: string;
  category_slug: string;
  subcategory_slug: string | null;
  tagline: string | null;
  ratings_overall: number;
  pricing: {
    hasFreeplan?: boolean;
    startingPrice?: number | null;
  };
}

export function SearchClient({ tools }: { tools: SearchTool[] }) {
  const [query, setQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [subcatFilter, setSubcatFilter] = useState<string>('all');

  const subcategories = useMemo(() => {
    const set = new Set(tools.map((t) => t.subcategory_slug).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [tools]);

  const subcatLabels: Record<string, string> = {
    'ai-chatbots': '💬 Chatbots',
    'ai-coding': '💻 Coding',
    'ai-writing': '✍️ Writing',
    'ai-image': '🎨 Image',
    'ai-video': '🎬 Video',
    'ai-voice': '🎤 Voice',
    'ai-productivity': '⚡ Productivity',
    'ai-research': '🔬 Research',
    'ai-design': '🎯 Design',
    'ai-music': '🎵 Music',
    'ai-data': '📊 Data',
    'ai-agents': '🤖 Agents',
  };

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      // Text search
      if (query) {
        const q = query.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchTagline = tool.tagline?.toLowerCase().includes(q);
        if (!matchName && !matchTagline) return false;
      }

      // Price filter
      if (priceFilter === 'free' && !tool.pricing?.hasFreeplan) return false;
      if (priceFilter === 'paid' && tool.pricing?.hasFreeplan) return false;

      // Rating filter
      if (ratingFilter > 0 && tool.ratings_overall < ratingFilter) return false;

      // Subcategory filter
      if (subcatFilter !== 'all' && tool.subcategory_slug !== subcatFilter) return false;

      return true;
    });
  }, [tools, query, priceFilter, ratingFilter, subcatFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          🔍 Search AI Tools
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Instantly search and filter {tools.length}+ AI tools. Find the perfect tool for your needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... (e.g. ChatGPT, coding, image generation)"
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
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
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
              {v === 'all' ? '🏷️ All' : v === 'free' ? '🆓 Free' : '💰 Paid'}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[0, 8, 8.5, 9].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                ratingFilter === r
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r === 0 ? '⭐ Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setSubcatFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            subcatFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Categories
        </button>
        {subcategories.map((sc) => (
          <button
            key={sc}
            onClick={() => setSubcatFilter(sc)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              subcatFilter === sc
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {subcatLabels[sc] || sc}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-6">
        Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filtered.length}</span> of{' '}
        {tools.length} tools
        {query && (
          <span>
            {' '}
            matching &quot;<span className="font-semibold">{query}</span>&quot;
          </span>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <a
            key={tool.slug}
            href={`/${tool.category_slug}/${tool.slug}`}
            className="group block p-5 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <span className="flex items-center gap-1 text-sm font-semibold bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-lg">
                ⭐ {tool.ratings_overall}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tool.tagline}</p>
            <div className="flex items-center gap-2">
              {tool.pricing?.hasFreeplan && (
                <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                  Free plan
                </span>
              )}
              {tool.pricing?.startingPrice && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  From ${tool.pricing.startingPrice}/mo
                </span>
              )}
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full">
                {subcatLabels[tool.subcategory_slug || ''] || tool.subcategory_slug}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔎</div>
          <h3 className="text-xl font-bold mb-2">No tools found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setPriceFilter('all');
              setRatingFilter(0);
              setSubcatFilter('all');
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
