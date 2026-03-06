import { ImageResponse } from 'next/og';
import { getToolsBySubcategory } from '@/lib/data';
import { SUBCATEGORIES } from '@/lib/constants';

export const runtime = 'edge';
export const alt = 'Best Tools Ranking';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find subcategory info and its parent category
  let subName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  let categorySlug = '';
  for (const [catSlug, subs] of Object.entries(SUBCATEGORIES)) {
    const found = subs.find((s) => s.slug === slug);
    if (found) {
      subName = found.name;
      categorySlug = catSlug;
      break;
    }
  }

  // Get top 3 tools
  const tools = categorySlug ? await getToolsBySubcategory(categorySlug, slug, 3) : [];
  const year = new Date().getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0c1220 0%, #111827 40%, #14210a 100%)',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', display: 'flex' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>T</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>ToolPilot</div>
            <div style={{ color: '#334155', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '18px' }}>Best Of</div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '6px 16px', color: '#34d399', fontSize: '14px', fontWeight: 700, display: 'flex' }}>
            {year} RANKING
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: '44px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: '32px', position: 'relative' }}>
          Best {subName} ({year})
        </div>

        {/* Top 3 Tools */}
        <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center', position: 'relative' }}>
          {tools.length > 0 ? tools.map((tool, idx) => {
            const medalColors = ['#fbbf24', '#94a3b8', '#d97706'];
            const medalLabels = ['🥇', '🥈', '🥉'];
            const score = tool.ratings.overall;
            const scoreColor = score >= 8 ? '#22c55e' : score >= 6 ? '#eab308' : '#ef4444';

            return (
              <div
                key={tool.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  background: idx === 0 ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${idx === 0 ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '20px',
                  padding: '24px 16px',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '28px', display: 'flex' }}>{medalLabels[idx]}</div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${medalColors[idx]}30, ${medalColors[idx]}10)`,
                  border: `1px solid ${medalColors[idx]}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                  {tool.name[0]}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'white', textAlign: 'center' }}>
                  {tool.name.length > 16 ? tool.name.slice(0, 14) + '...' : tool.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
                  <span style={{ color: scoreColor, fontSize: '18px', fontWeight: 800 }}>{score.toFixed(1)}</span>
                </div>
              </div>
            );
          }) : (
            <div style={{ color: '#475569', fontSize: '20px', display: 'flex' }}>Rankings coming soon</div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', position: 'relative', marginTop: '16px' }}>
          <div style={{ color: '#475569', fontSize: '14px', display: 'flex', gap: '6px' }}>
            Expert-Curated Rankings • Updated {year}
          </div>
          <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>toolpilot.com/best</div>
        </div>
      </div>
    ),
    size
  );
}
