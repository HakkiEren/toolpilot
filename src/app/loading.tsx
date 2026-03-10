export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 p-8 md:p-12 mb-10 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="w-80 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-96 h-5 bg-gray-200/60 dark:bg-gray-700/60 rounded-lg" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800/50 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-900 p-5 animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Logo + title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                <div className="w-48 h-3 bg-gray-100 dark:bg-gray-800 rounded-lg" />
              </div>
              <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            {/* Rating bars */}
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-16 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-200 dark:bg-gray-700 rounded-full"
                      style={{ width: `${65 + j * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom row */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
