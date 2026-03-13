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
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center flex-wrap gap-1"
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1"
          >
            {idx > 0 && <span className="mx-1" aria-hidden="true">/</span>}
            {idx < items.length - 1 && item.url ? (
              <Link
                href={item.url}
                itemProp="item"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span itemProp="name">{item.name}</span>
              </Link>
            ) : (
              <span itemProp="item" itemID={item.url || undefined}>
                <span itemProp="name" className="text-gray-700 dark:text-gray-200 font-medium">
                  {item.name}
                </span>
              </span>
            )}
            <meta itemProp="position" content={String(idx + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
