import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="mx-1">/</span>}
            {idx < items.length - 1 && item.url ? (
              <Link
                href={item.url}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-700 dark:text-gray-200 font-medium">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
