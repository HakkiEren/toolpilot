'use client';

// ============================================================
// TABLE OF CONTENTS — Scroll-aware active section highlighting
// Uses IntersectionObserver for zero-JS-overhead section tracking
// ============================================================

import { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  label: string;
  icon?: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
  className?: string;
}

export function TableOfContents({
  items,
  title = 'On This Page',
  className = '',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const ids = items.map(item => item.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible section
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to top
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 ${className}`}
      aria-label="Table of contents"
    >
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveId(item.id);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {item.icon && <span className="text-xs flex-shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
