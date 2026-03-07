export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Blog hero skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto mb-3" />
        <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
      </div>

      {/* Category chips skeleton */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        ))}
      </div>

      {/* Blog cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
            {/* Image placeholder */}
            <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-16 bg-blue-200 dark:bg-blue-800/30 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
