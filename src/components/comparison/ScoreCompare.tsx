import type { Tool } from '@/types';

interface Props {
  toolA: Tool;
  toolB: Tool;
}

const ratingCategories = [
  { key: 'overall', label: 'Overall' },
  { key: 'easeOfUse', label: 'Ease of Use' },
  { key: 'features', label: 'Features' },
  { key: 'valueForMoney', label: 'Value for Money' },
  { key: 'support', label: 'Customer Support' },
] as const;

export function ScoreCompare({ toolA, toolB }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-3 px-4 text-left font-medium text-gray-500">Category</th>
            <th className="py-3 px-4 text-center font-semibold">{toolA.name}</th>
            <th className="py-3 px-4 text-center font-semibold">{toolB.name}</th>
            <th className="py-3 px-4 text-center font-medium text-gray-500">Winner</th>
          </tr>
        </thead>
        <tbody>
          {ratingCategories.map(({ key, label }) => {
            const aScore = key === 'overall' ? toolA.ratings.overall : toolA.ratings[key];
            const bScore = key === 'overall' ? toolB.ratings.overall : toolB.ratings[key];
            const winner = aScore > bScore ? 'a' : bScore > aScore ? 'b' : 'tie';

            return (
              <tr key={key} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">{label}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 font-semibold ${winner === 'a' ? 'text-green-600' : ''}`}>
                    {aScore.toFixed(1)}
                    <ScoreBar score={aScore} />
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 font-semibold ${winner === 'b' ? 'text-green-600' : ''}`}>
                    {bScore.toFixed(1)}
                    <ScoreBar score={bScore} />
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {winner === 'tie' ? (
                    <span className="text-gray-400">Tie</span>
                  ) : (
                    <span className="font-semibold text-green-600">
                      {winner === 'a' ? toolA.name : toolB.name}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const width = (score / 10) * 100;
  const color =
    score >= 8 ? 'bg-green-500' :
    score >= 6 ? 'bg-yellow-500' :
    score >= 4 ? 'bg-orange-500' :
    'bg-red-500';

  return (
    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${width}%` }} />
    </div>
  );
}
