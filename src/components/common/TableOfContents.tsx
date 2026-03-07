// ============================================================
// TABLE OF CONTENTS — Server-rendered sticky TOC
// Generates section links from the known page structure
// ============================================================

import Link from 'next/link';

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
  if (items.length < 3) return null;

  return (
    <nav
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 ${className}`}
      aria-label="Table of contents"
    >
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.icon && <span className="text-xs flex-shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
