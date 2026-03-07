export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search bar skeleton */}
      <div className="mb-10">
        <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>

      {/* Filter chips skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Search results skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
