'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PLACEHOLDERS = [
  'Compare ChatGPT vs Claude...',
  'Find the best CRM software...',
  'Search email marketing tools...',
  'Compare Shopify vs WooCommerce...',
  'Find AI coding assistants...',
  'Search project management tools...',
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Typing animation for placeholder text
  useEffect(() => {
    if (isFocused || query) return; // Pause animation when user is interacting

    const currentText = PLACEHOLDERS[placeholderIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIdx <= currentText.length) {
      timeout = setTimeout(() => {
        setPlaceholder(currentText.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, 60); // typing speed
    } else if (!isDeleting && charIdx > currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000); // pause at end
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setCharIdx((c) => c - 1);
        setPlaceholder(currentText.slice(0, charIdx - 1));
      }, 30); // delete speed
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, placeholderIdx, isFocused, query]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/search');
      }
    },
    [query, router]
  );

  return (
    <div className="max-w-xl mx-auto mb-10">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 px-5 py-4 glass rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-300 focus-within:shadow-xl focus-within:border-blue-400 transition-all">
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
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
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? 'Search tools, compare features...' : placeholder || '|'}
            className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 text-sm md:text-base"
            aria-label="Search tools"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
