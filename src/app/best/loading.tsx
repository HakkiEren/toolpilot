export default function BestOfLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="text-center mb-12">
        <div className="h-10 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto mb-3" />
        <div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
      </div>

      {/* Best-of list cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800/30 rounded-xl animate-pulse" />
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              ))}
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
