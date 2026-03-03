import Link from 'next/link';
import type { InternalLink } from '@/types';

interface Props {
  links: InternalLink[];
}

const typeLabels: Record<string, string> = {
  hub: 'Category',
  sibling: 'Similar Tool',
  comparison: 'Comparison',
  'cross-category': 'Related',
  blog: 'Guide',
};

const typeColors: Record<string, string> = {
  hub: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  sibling: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  comparison: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'cross-category': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  blog: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function RelatedLinks({ links }: Props) {
  if (!links || links.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {links.map((link, idx) => (
        <Link
          key={idx}
          href={link.url}
          className="group flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
        >
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColors[link.type] || typeColors.blog}`}>
            {typeLabels[link.type] || link.type}
          </span>
          <span className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {link.text}
          </span>
        </Link>
      ))}
    </div>
  );
}
