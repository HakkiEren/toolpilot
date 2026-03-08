import type { Tool } from '@/types';

interface Props {
  toolA: Tool;
  toolB: Tool;
}

const ratingCategories = [
  { key: 'overall', label: 'Overall Score', icon: '&#127942;' },
  { key: 'easeOfUse', label: 'Ease of Use', icon: '&#128171;' },
  { key: 'features', label: 'Features', icon: '&#9881;' },
  { key: 'valueForMoney', label: 'Value for Money', icon: '&#128176;' },
  { key: 'support', label: 'Customer Support', icon: '&#128172;' },
] as const;

export function ScoreCompare({ toolA, toolB }: Props) {
  // Count wins
  let aWins = 0;
  let bWins = 0;
  ratingCategories.forEach(({ key }) => {
    const aScore = key === 'overall' ? toolA.ratings.overall : toolA.ratings[key];
    const bScore = key === 'overall' ? toolB.ratings.overall : toolB.ratings[key];
    if (aScore > bScore) aWins++;
    else if (bScore > aScore) bWins++;
  });

  return (
    <div className="space-y-6">
      {/* Head-to-Head Summary — Premium donut charts */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="relative inline-block mb-2">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" className="text-blue-100 dark:text-gray-700" />
                <circle cx="40" cy="40" r="32" fill="none" strokeWidth="6"
                  strokeDasharray={`${(toolA.ratings.overall / 10) * 201} 201`}
                  strokeLinecap="round" stroke="currentColor"
                  className="text-blue-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-blue-600">{toolA.ratings.overall.toFixed(1)}</span>
            </div>
            <div className="text-sm font-bold">{toolA.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{aWins} categories won</div>
          </div>
          <div className="flex-shrink-0 px-4">
            <div className="vs-divider">VS</div>
          </div>
          <div className="text-center flex-1">
            <div className="relative inline-block mb-2">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" className="text-purple-100 dark:text-gray-700" />
                <circle cx="40" cy="40" r="32" fill="none" strokeWidth="6"
                  strokeDasharray={`${(toolB.ratings.overall / 10) * 201} 201`}
                  strokeLinecap="round" stroke="currentColor"
                  className="text-purple-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-purple-600">{toolB.ratings.overall.toFixed(1)}</span>
            </div>
            <div className="text-sm font-bold">{toolB.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{bWins} categories won</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_1fr] md:grid-cols-[1fr_1.5fr_auto_1.5fr] gap-0">
          {/* Header */}
          <div className="py-3 px-4 bg-gray-50 dark:bg-gray-800 font-semibold text-sm text-gray-500">Category</div>
          <div className="py-3 px-4 bg-blue-50 dark:bg-blue-900/20 font-semibold text-sm text-center text-blue-700 dark:text-blue-400">{toolA.name}</div>
          <div className="py-3 px-2 bg-gray-50 dark:bg-gray-800" />
          <div className="py-3 px-4 bg-purple-50 dark:bg-purple-900/20 font-semibold text-sm text-center text-purple-700 dark:text-purple-400">{toolB.name}</div>

          {ratingCategories.map(({ key, label, icon }) => {
            const aScore = key === 'overall' ? toolA.ratings.overall : toolA.ratings[key];
            const bScore = key === 'overall' ? toolB.ratings.overall : toolB.ratings[key];
            const winner = aScore > bScore ? 'a' : bScore > aScore ? 'b' : 'tie';
            const isOverall = key === 'overall';

            return (
              <>
                {/* Label */}
                <div key={`${key}-label`} className={`py-4 px-4 flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 ${isOverall ? 'bg-gray-50/50 dark:bg-gray-800/30 font-bold' : ''}`}>
                  <span className="text-base" dangerouslySetInnerHTML={{ __html: icon }} />
                  <span className="text-sm font-medium">{label}</span>
                </div>

                {/* Tool A Score */}
                <div key={`${key}-a`} className={`py-4 px-4 border-t border-gray-100 dark:border-gray-800 ${isOverall ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                  <div className="flex items-center gap-2 justify-center">
                    <span className={`text-lg font-bold ${winner === 'a' ? 'text-green-600' : ''}`}>
                      {aScore.toFixed(1)}
                    </span>
                    <div className="w-20 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full score-bar-animated ${
                          aScore >= 8 ? 'bg-green-500' : aScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(aScore / 10) * 100}%` }}
                      />
                    </div>
                    {winner === 'a' && <span className="text-green-500 text-xs">&#9650;</span>}
                  </div>
                </div>

                {/* VS divider */}
                <div key={`${key}-vs`} className={`py-4 px-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center ${isOverall ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}>
                  {winner === 'tie' ? (
                    <span className="text-xs text-gray-400 font-medium">=</span>
                  ) : (
                    <span className={`text-xs font-bold ${winner === 'a' ? 'text-blue-500' : 'text-purple-500'}`}>
                      {winner === 'a' ? '\u25C0' : '\u25B6'}
                    </span>
                  )}
                </div>

                {/* Tool B Score */}
                <div key={`${key}-b`} className={`py-4 px-4 border-t border-gray-100 dark:border-gray-800 ${isOverall ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}>
                  <div className="flex items-center gap-2 justify-center">
                    {winner === 'b' && <span className="text-green-500 text-xs">&#9650;</span>}
                    <div className="w-20 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full score-bar-animated ${
                          bScore >= 8 ? 'bg-green-500' : bScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(bScore / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`text-lg font-bold ${winner === 'b' ? 'text-green-600' : ''}`}>
                      {bScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
