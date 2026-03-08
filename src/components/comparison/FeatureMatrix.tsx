import type { FeatureComparison } from '@/types';

interface Props {
  features: FeatureComparison[];
  toolAName: string;
  toolBName: string;
}

// Normalize feature matrix rows from different DB formats
// Some rows use toolAValue/toolBValue, others use tool_a/tool_b
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFeature(raw: any): FeatureComparison {
  const aVal = raw.toolAValue !== undefined ? raw.toolAValue : raw.tool_a;
  const bVal = raw.toolBValue !== undefined ? raw.toolBValue : raw.tool_b;
  return {
    feature: String(raw.feature || raw.name || 'Unknown'),
    category: String(raw.category || 'General'),
    toolAValue: aVal !== undefined && aVal !== null ? aVal : 'N/A',
    toolBValue: bVal !== undefined && bVal !== null ? bVal : 'N/A',
    winner: (raw.winner as 'a' | 'b' | 'tie') || 'tie',
  };
}

export function FeatureMatrix({ features, toolAName, toolBName }: Props) {
  // Normalize all features to handle both DB formats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalized = (features || []).map((f) => normalizeFeature(f as any));

  // Group features by category
  const grouped = normalized.reduce<Record<string, FeatureComparison[]>>((acc, f) => {
    const cat = f.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});

  if (normalized.length === 0) return null;

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
          <td className={`py-3 px-4 text-center ${f.winner === 'a' ? 'bg-green-50/50 dark:bg-green-900/5' : ''}`}>
            <FeatureValue value={f.toolAValue} isWinner={f.winner === 'a'} />
          </td>
          <td className={`py-3 px-4 text-center ${f.winner === 'b' ? 'bg-green-50/50 dark:bg-green-900/5' : ''}`}>
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

  const str = String(value);

  // Handle null/undefined that slipped through
  if (str === 'undefined' || str === 'null' || str === '') {
    return <span className="text-gray-400 italic">N/A</span>;
  }

  // Handle Yes/No/True/False strings
  if (str.toLowerCase() === 'yes' || str.toLowerCase() === 'true') {
    return <span className={`text-green-600 ${isWinner ? 'font-semibold' : ''}`}>✓ Yes</span>;
  }
  if (str.toLowerCase() === 'no' || str.toLowerCase() === 'false' || str.toLowerCase() === 'not available') {
    return <span className="text-red-400">✗ No</span>;
  }

  return (
    <span className={isWinner ? 'font-semibold text-green-600' : ''}>
      {str}
    </span>
  );
}
