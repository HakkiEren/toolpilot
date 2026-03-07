export default function BestOfDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Hero skeleton */}
      <div className="mb-10">
        <div className="h-10 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-full max-w-2xl bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-5 w-3/4 max-w-xl bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Ranked tools skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6 flex items-start gap-5">
            <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800/30 rounded-xl animate-pulse flex-shrink-0 flex items-center justify-center font-bold text-purple-300">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                <div>
                  <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
