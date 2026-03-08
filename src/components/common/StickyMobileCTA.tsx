'use client';

import { useEffect, useState } from 'react';

// ============================================================
// STICKY MOBILE CTA BAR — Fixed bottom bar on mobile for tool pages
// Shows tool name, rating, and Visit CTA for higher conversions
// Only appears after user scrolls past the hero section
// ============================================================

interface StickyMobileCTAProps {
  toolName: string;
  rating: number;
  websiteUrl: string;
  hasFreeplan: boolean;
  freeTrialDays?: number | null;
}

export function StickyMobileCTA({ toolName, rating, websiteUrl, hasFreeplan, freeTrialDays }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 400px (past the hero)
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ctaText = hasFreeplan
    ? 'Try Free'
    : freeTrialDays
      ? `${freeTrialDays}-Day Trial`
      : 'Visit Site';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Gradient shadow above */}
      <div className="h-6 bg-gradient-to-t from-white/90 dark:from-gray-950/90 to-transparent pointer-events-none" />

      {/* CTA Bar */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-gray-800/80 px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Tool info */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{toolName}</div>
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-500 text-xs">&#9733;</span>
              <span className={`text-xs font-bold ${rating >= 8 ? 'text-green-600' : rating >= 6 ? 'text-yellow-600' : 'text-red-500'}`}>
                {rating.toFixed(1)}/10
              </span>
              <span className="text-gray-400 text-[10px]">
                {rating >= 8.5 ? 'Excellent' : rating >= 7.5 ? 'Very Good' : rating >= 6 ? 'Good' : 'Average'}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 active:scale-95"
          >
            {ctaText} &#8599;
          </a>
        </div>
      </div>
    </div>
  );
}
