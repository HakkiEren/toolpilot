'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ToolLogo } from '@/components/common/ToolLogo';

// ============================================================
// QUICK COMPARE WIDGET — Side-by-side tool comparison picker
// Users select two tools from the category to instantly compare
// ============================================================

interface CompareTool {
  slug: string;
  name: string;
  logoUrl: string;
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

interface QuickCompareProps {
  tools: CompareTool[];
  categorySlug: string;
  /** Existing comparison slugs for direct links */
  existingComparisons?: { slug: string; toolASlugs: string; toolBSlug: string }[];
}

export function QuickCompare({ tools, categorySlug, existingComparisons = [] }: QuickCompareProps) {
  const [toolA, setToolA] = useState<string>('');
  const [toolB, setToolB] = useState<string>('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const selectedA = tools.find((t) => t.slug === toolA);
  const selectedB = tools.find((t) => t.slug === toolB);

  const filteredToolsA = useMemo(() => {
    return tools
      .filter((t) => t.slug !== toolB)
      .filter((t) => !searchA || t.name.toLowerCase().includes(searchA.toLowerCase()))
      .slice(0, 8);
  }, [tools, toolB, searchA]);

  const filteredToolsB = useMemo(() => {
    return tools
      .filter((t) => t.slug !== toolA)
      .filter((t) => !searchB || t.name.toLowerCase().includes(searchB.toLowerCase()))
      .slice(0, 8);
  }, [tools, toolA, searchB]);

  // Find existing comparison link
  const comparisonLink = useMemo(() => {
    if (!selectedA || !selectedB) return null;
    const comp = existingComparisons.find(
      (c) =>
        (c.toolASlugs === selectedA.slug && c.toolBSlug === selectedB.slug) ||
        (c.toolASlugs === selectedB.slug && c.toolBSlug === selectedA.slug)
    );
    return comp ? `/${categorySlug}/compare/${comp.slug}` : null;
  }, [selectedA, selectedB, existingComparisons, categorySlug]);

  const ratingBars = [
    { label: 'Overall', keyA: selectedA?.ratings.overall, keyB: selectedB?.ratings.overall },
    { label: 'Features', keyA: selectedA?.ratings.features, keyB: selectedB?.ratings.features },
    { label: 'Ease of Use', keyA: selectedA?.ratings.easeOfUse, keyB: selectedB?.ratings.easeOfUse },
    { label: 'Value', keyA: selectedA?.ratings.valueForMoney, keyB: selectedB?.ratings.valueForMoney },
    { label: 'Support', keyA: selectedA?.ratings.support, keyB: selectedB?.ratings.support },
  ];

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold">Quick Compare</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Select two tools to see how they stack up</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40 dark:from-gray-900 dark:via-purple-950/10 dark:to-blue-950/10 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-5 md:p-6">
        {/* Tool Selectors */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 md:gap-4 mb-6 items-start">
          {/* Tool A Selector */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Tool A</label>
            {selectedA ? (
              <div
                className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => { setShowDropdownA(!showDropdownA); setShowDropdownB(false); }}
              >
                <ToolLogo logoUrl={selectedA.logoUrl} name={selectedA.name} size={28} />
                <span className="font-semibold text-sm truncate">{selectedA.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setToolA(''); setSearchA(''); }}
                  className="ml-auto text-gray-400 hover:text-red-500 text-xs"
                >
                  &#10005;
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchA}
                  onChange={(e) => { setSearchA(e.target.value); setShowDropdownA(true); }}
                  onFocus={() => { setShowDropdownA(true); setShowDropdownB(false); }}
                  className="w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all"
                />
              </div>
            )}
            {showDropdownA && !selectedA && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-20 max-h-56 overflow-y-auto">
                {filteredToolsA.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => { setToolA(t.slug); setSearchA(''); setShowDropdownA(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-left transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <ToolLogo logoUrl={t.logoUrl} name={t.name} size={24} />
                    <span className="font-medium truncate">{t.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{t.ratings.overall.toFixed(1)}</span>
                  </button>
                ))}
                {filteredToolsA.length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-gray-400">No tools found</div>
                )}
              </div>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center mt-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-lg">
              VS
            </div>
          </div>

          {/* Tool B Selector */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Tool B</label>
            {selectedB ? (
              <div
                className="flex items-center gap-2.5 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-300 transition-colors"
                onClick={() => { setShowDropdownB(!showDropdownB); setShowDropdownA(false); }}
              >
                <ToolLogo logoUrl={selectedB.logoUrl} name={selectedB.name} size={28} />
                <span className="font-semibold text-sm truncate">{selectedB.name}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setToolB(''); setSearchB(''); }}
                  className="ml-auto text-gray-400 hover:text-red-500 text-xs"
                >
                  &#10005;
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchB}
                  onChange={(e) => { setSearchB(e.target.value); setShowDropdownB(true); }}
                  onFocus={() => { setShowDropdownB(true); setShowDropdownA(false); }}
                  className="w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all"
                />
              </div>
            )}
            {showDropdownB && !selectedB && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-20 max-h-56 overflow-y-auto">
                {filteredToolsB.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => { setToolB(t.slug); setSearchB(''); setShowDropdownB(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm text-left transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <ToolLogo logoUrl={t.logoUrl} name={t.name} size={24} />
                    <span className="font-medium truncate">{t.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{t.ratings.overall.toFixed(1)}</span>
                  </button>
                ))}
                {filteredToolsB.length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-gray-400">No tools found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Close dropdowns when clicking outside */}
        {(showDropdownA || showDropdownB) && (
          <div className="fixed inset-0 z-10" onClick={() => { setShowDropdownA(false); setShowDropdownB(false); }} />
        )}

        {/* Comparison Preview — Only show when both tools selected */}
        {selectedA && selectedB && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Rating Comparison Bars */}
            <div className="space-y-3 mb-5">
              {ratingBars.map(({ label, keyA, keyB }) => {
                const scoreA = keyA ?? 0;
                const scoreB = keyB ?? 0;
                const winner = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'tie';

                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${winner === 'A' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {scoreA.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{label}</span>
                      <span className={`text-xs font-bold ${winner === 'B' ? 'text-purple-600' : 'text-gray-500'}`}>
                        {scoreB.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex justify-end">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${winner === 'A' ? 'bg-blue-500' : 'bg-blue-300'}`}
                          style={{ width: `${(scoreA / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${winner === 'B' ? 'bg-purple-500' : 'bg-purple-300'}`}
                          style={{ width: `${(scoreB / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Starting Price</div>
                <div className="font-bold text-sm">
                  {selectedA.pricing.startingPrice ? `$${selectedA.pricing.startingPrice}/mo` : 'Custom'}
                </div>
                {selectedA.pricing.hasFreeplan && (
                  <span className="text-[10px] text-green-600 font-semibold">+ Free plan</span>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Starting Price</div>
                <div className="font-bold text-sm">
                  {selectedB.pricing.startingPrice ? `$${selectedB.pricing.startingPrice}/mo` : 'Custom'}
                </div>
                {selectedB.pricing.hasFreeplan && (
                  <span className="text-[10px] text-green-600 font-semibold">+ Free plan</span>
                )}
              </div>
            </div>

            {/* Winner Badge */}
            {selectedA.ratings.overall !== selectedB.ratings.overall && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                  <span>&#127942;</span>
                  {selectedA.ratings.overall > selectedB.ratings.overall ? selectedA.name : selectedB.name} wins by{' '}
                  {Math.abs(selectedA.ratings.overall - selectedB.ratings.overall).toFixed(1)} points
                </span>
              </div>
            )}

            {/* CTA */}
            {comparisonLink ? (
              <Link
                href={comparisonLink}
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/25"
              >
                Read Full Comparison &#8594;
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  href={`/${categorySlug}/${selectedA.slug}`}
                  className="flex-1 text-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-blue-300 transition-colors"
                >
                  Review {selectedA.name}
                </Link>
                <Link
                  href={`/${categorySlug}/${selectedB.slug}`}
                  className="flex-1 text-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-blue-300 transition-colors"
                >
                  Review {selectedB.name}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Placeholder when no selection */}
        {(!selectedA || !selectedB) && (
          <div className="text-center py-4 text-sm text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Select two tools above to see an instant side-by-side comparison
          </div>
        )}
      </div>
    </section>
  );
}
