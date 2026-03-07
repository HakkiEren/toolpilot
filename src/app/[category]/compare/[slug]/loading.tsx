export default function ComparisonLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-4 ${i % 2 === 0 ? 'w-16' : 'w-4'} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`} />
        ))}
      </div>

      {/* VS Hero skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 p-8 mb-8">
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mb-3" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="text-3xl font-black text-gray-300 dark:text-gray-700 select-none">VS</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mb-3" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Comparison table skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex border-b border-gray-100 dark:border-gray-800/50 last:border-0">
            <div className="w-1/3 p-4 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="w-1/3 p-4 border-x border-gray-100 dark:border-gray-800/50">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="w-1/3 p-4">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
