'use client';

// ============================================================
// BACK TO TOP — Premium scroll-to-top with progress ring
// Shows after scrolling past 400px, displays scroll progress
// ============================================================

import { useState, useEffect, useCallback } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

    setVisible(scrollTop > 400);
    setProgress(scrollPercent);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle math: r=18, circumference = 2 * PI * 18 ≈ 113.1
  const circumference = 113.1;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 rounded-full shadow-lg shadow-black/10 dark:shadow-black/30 border border-gray-200/60 dark:border-gray-700/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-12 h-12 -rotate-90"
        viewBox="0 0 48 48"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-10"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      {/* Arrow icon */}
      <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
