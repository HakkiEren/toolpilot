import type { FeatureComparison } from '@/types';

interface Props {
  features: FeatureComparison[];
  toolAName: string;
  toolBName: string;
}

export function FeatureMatrix({ features, toolAName, toolBName }: Props) {
  // Group features by category
  const grouped = features.reduce<Record<string, FeatureComparison[]>>((acc, f) => {
    const cat = f.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="py-3 px-4 text-left font-medium text-gray-500 w-1/3">Feature</th>
            <th className="py-3 px-4 text-center font-semibold w-1/3">{toolAName}</th>
            <th className="py-3 px-4 text-center font-semibold w-1/3">{toolBName}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([category, categoryFeatures]) => (
            <FeatureGroup
              key={category}
              category={category}
              features={categoryFeatures}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeatureGroup({
  category,
  features,
}: {
  category: string;
  features: FeatureComparison[];
}) {
  return (
    <>
      <tr className="bg-gray-25 dark:bg-gray-850">
        <td colSpan={3} className="py-2 px-4 font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50">
          {category}
        </td>
      </tr>
      {features.map((f, idx) => (
        <tr
          key={idx}
          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
        >
          <td className="py-3 px-4 font-medium">{f.feature}</td>
          <td className="py-3 px-4 text-center">
            <FeatureValue value={f.toolAValue} isWinner={f.winner === 'a'} />
          </td>
          <td className="py-3 px-4 text-center">
            <FeatureValue value={f.toolBValue} isWinner={f.winner === 'b'} />
          </td>
        </tr>
      ))}
    </>
  );
}

function FeatureValue({ value, isWinner }: { value: string | boolean | number; isWinner: boolean }) {
  if (typeof value === 'boolean') {
    return (
      <span className={`text-lg ${value ? 'text-green-500' : 'text-red-400'} ${isWinner ? 'font-bold' : ''}`}>
        {value ? '✅' : '❌'}
      </span>
    );
  }

  return (
    <span className={isWinner ? 'font-semibold text-green-600' : ''}>
      {String(value)}
    </span>
  );
}
