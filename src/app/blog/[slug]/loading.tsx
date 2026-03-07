export default function BlogPostLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Article header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-20 bg-blue-200 dark:bg-blue-800/30 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-4" />
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div>
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className={`h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2`} style={{ width: `${65 + (i * 7) % 30}%` }} />
            {i % 3 === 2 && <div className="h-6" />}
          </div>
        ))}
      </div>
    </div>
  );
}
