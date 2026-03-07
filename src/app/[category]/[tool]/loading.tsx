export default function ToolLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Tool header skeleton */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />
        <div className="flex-1">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-full max-w-lg bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
          <div className="flex gap-3 mt-4">
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Rating + Quick stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-5">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content sections skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* TL;DR */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
          {/* Pros/Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
              <div className="h-6 w-16 bg-green-200 dark:bg-green-800/30 rounded animate-pulse mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              ))}
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
              <div className="h-6 w-16 bg-red-200 dark:bg-red-800/30 rounded animate-pulse mb-4" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              ))}
            </div>
          </div>
        </div>
        {/* Sidebar skeleton */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 p-6">
            <div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
