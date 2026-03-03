import type { Tool } from '@/types';

interface Props {
  toolA: Tool;
  toolB: Tool;
  verdictContent: string;
}

export function VerdictSection({ toolA, toolB, verdictContent }: Props) {
  const winner = toolA.ratings.overall >= toolB.ratings.overall ? toolA : toolB;
  const loser = winner.id === toolA.id ? toolB : toolA;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
      <div className="text-center mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Our Recommendation</div>
        <div className="text-2xl font-bold">
          {winner.name}{' '}
          <span className="text-green-600">{winner.ratings.overall.toFixed(1)}</span>
          {' vs '}
          {loser.name}{' '}
          <span className="text-gray-400">{loser.ratings.overall.toFixed(1)}</span>
        </div>
      </div>

      <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
        {verdictContent}
      </div>
    </div>
  );
}
