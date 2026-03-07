export default function CompareHubLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Hero skeleton */}
      <div className="text-center mb-10">
        <div className="h-10 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto mb-3" />
        <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
      </div>

      {/* Comparison cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="h-5 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
