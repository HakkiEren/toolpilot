import Link from 'next/link';
import type { Tool } from '@/types';
import { ToolLogo } from '@/components/common/ToolLogo';

interface Props {
  toolA: Tool;
  toolB: Tool;
  verdictContent: string;
}

export function VerdictSection({ toolA, toolB, verdictContent }: Props) {
  const winner = toolA.ratings.overall >= toolB.ratings.overall ? toolA : toolB;
  const loser = winner.id === toolA.id ? toolB : toolA;
  const scoreDiff = Math.abs(toolA.ratings.overall - toolB.ratings.overall);
  const isTie = scoreDiff < 0.3;

  // Per-category winner analysis
  const categories = [
    { key: 'easeOfUse', label: 'Ease of Use', icon: '\uD83C\uDFAF' },
    { key: 'features', label: 'Features', icon: '\u2699\uFE0F' },
    { key: 'valueForMoney', label: 'Value for Money', icon: '\uD83D\uDCB0' },
    { key: 'support', label: 'Support', icon: '\uD83D\uDCAC' },
  ] as const;

  const winnerAdvantages = categories.filter(
    (cat) => winner.ratings[cat.key] > loser.ratings[cat.key]
  );
  const loserAdvantages = categories.filter(
    (cat) => loser.ratings[cat.key] > winner.ratings[cat.key]
  );

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50/50 to-teal-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl border border-green-200/60 dark:border-gray-700 overflow-hidden">
      {/* Winner Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white text-center">
        <div className="text-sm font-medium opacity-90 mb-1">
          {isTie ? 'Verdict: Too Close to Call' : 'Our Recommendation'}
        </div>
        <div className="text-xl md:text-2xl font-extrabold flex items-center justify-center gap-3">
          {!isTie && <span className="text-2xl">{'\uD83C\uDFC6'}</span>}
          {isTie ? `${toolA.name} and ${toolB.name} are equally matched` : `${winner.name} Wins`}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Winner Card */}
          <div className={`relative rounded-2xl p-5 text-center ${
            isTie
              ? 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
              : 'bg-white dark:bg-gray-900 border-2 border-green-400 dark:border-green-600 shadow-lg shadow-green-100 dark:shadow-green-900/20'
          }`}>
            {!isTie && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                Winner
              </div>
            )}
            <ToolLogo logoUrl={winner.logoUrl} name={winner.name} size={48} className="mx-auto mb-3" />
            <div className="font-bold text-lg">{winner.name}</div>
            <div className="text-3xl font-black text-green-600 dark:text-green-400 mt-1">
              {winner.ratings.overall.toFixed(1)}<span className="text-sm text-gray-400 font-normal">/10</span>
            </div>
            {winnerAdvantages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {winnerAdvantages.map((adv) => (
                  <span key={adv.key} className="text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                    {adv.icon} Best {adv.label}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2 justify-center">
              {winner.websiteUrl && (
                <a
                  href={winner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-xs font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md shadow-green-600/20"
                >
                  Try {winner.name} &#8599;
                </a>
              )}
            </div>
          </div>

          {/* Loser Card */}
          <div className="rounded-2xl p-5 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <ToolLogo logoUrl={loser.logoUrl} name={loser.name} size={48} className="mx-auto mb-3" />
            <div className="font-bold text-lg">{loser.name}</div>
            <div className="text-3xl font-black text-gray-500 dark:text-gray-400 mt-1">
              {loser.ratings.overall.toFixed(1)}<span className="text-sm text-gray-400 font-normal">/10</span>
            </div>
            {loserAdvantages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {loserAdvantages.map((adv) => (
                  <span key={adv.key} className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                    {adv.icon} Best {adv.label}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2 justify-center">
              {loser.websiteUrl && (
                <a
                  href={loser.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Try {loser.name} &#8599;
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Category Breakdown — Mini comparison */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {categories.map((cat) => {
            const aScore = toolA.ratings[cat.key];
            const bScore = toolB.ratings[cat.key];
            const catWinner = aScore > bScore ? 'A' : bScore > aScore ? 'B' : 'tie';
            return (
              <div key={cat.key} className="bg-white dark:bg-gray-900 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-800">
                <div className="text-xs text-gray-400 mb-1">{cat.icon} {cat.label}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-sm font-bold ${catWinner === 'A' ? 'text-green-600' : ''}`}>
                    {aScore.toFixed(1)}
                  </span>
                  <span className="text-gray-300 text-xs">vs</span>
                  <span className={`text-sm font-bold ${catWinner === 'B' ? 'text-green-600' : ''}`}>
                    {bScore.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verdict Text */}
        <div className="bg-white/60 dark:bg-gray-900/60 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <span>{'\uD83D\uDCDD'}</span> Bottom Line
          </div>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed" data-speakable="true">
            {verdictContent}
          </p>
        </div>

        {/* Quick Action Links */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href={`/${toolA.categorySlug}/${toolA.slug}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {toolA.name} Full Review &#8594;
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href={`/${toolB.categorySlug}/${toolB.slug}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {toolB.name} Full Review &#8594;
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href={`/${toolA.categorySlug}/${toolA.slug}/alternatives`}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            More Alternatives &#8594;
          </Link>
        </div>
      </div>
    </div>
  );
}
