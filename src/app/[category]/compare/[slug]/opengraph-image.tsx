import { ImageResponse } from 'next/og';
import { getComparison } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

export const runtime = 'edge';
export const alt = 'Tool Comparison';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const comparison = await getComparison(category, slug);
  const cat = CATEGORIES[category];

  if (!comparison) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0c1220, #1e293b)', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          ToolPilot
        </div>
      ),
      size
    );
  }

  const { toolA, toolB } = comparison;
  const scoreA = toolA.ratings.overall;
  const scoreB = toolB.ratings.overall;
  const winner = scoreA > scoreB ? toolA.name : scoreB > scoreA ? toolB.name : null;
  const ratingColorA = scoreA >= 8 ? '#22c55e' : scoreA >= 6 ? '#eab308' : '#ef4444';
  const ratingColorB = scoreB >= 8 ? '#22c55e' : scoreB >= 6 ? '#eab308' : '#ef4444';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0c1220 0%, #111827 40%, #1e1b4b 100%)',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-80px', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', display: 'flex' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>T</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>ToolPilot</div>
            <div style={{ color: '#334155', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '18px' }}>{cat?.name || category}</div>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '10px', padding: '6px 16px', color: '#fb923c', fontSize: '14px', fontWeight: 700, display: 'flex', letterSpacing: '1px' }}>
            HEAD-TO-HEAD
          </div>
        </div>

        {/* VS Section */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '24px', position: 'relative' }}>
          {/* Tool A */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '12px' }}>
            {/* Logo */}
            <div style={{ position: 'relative', display: 'flex' }}>
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '28px', background: 'rgba(59,130,246,0.2)', filter: 'blur(12px)', display: 'flex' }} />
              <div
                style={{
                  display: 'flex',
                  width: '110px',
                  height: '110px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                  border: '2px solid rgba(59,130,246,0.3)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  position: 'relative',
                }}
              >
                {toolA.name[0]}
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', textAlign: 'center' }}>
              {toolA.name}
            </div>
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '6px 16px' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px' }}>★</div>
              <div style={{ color: ratingColorA, fontSize: '26px', fontWeight: 800 }}>{scoreA.toFixed(1)}</div>
              <div style={{ color: '#475569', fontSize: '14px' }}>/10</div>
            </div>
          </div>

          {/* VS Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                width: '72px',
                height: '72px',
                borderRadius: '36px',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
              }}
            >
              VS
            </div>
          </div>

          {/* Tool B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '12px' }}>
            {/* Logo */}
            <div style={{ position: 'relative', display: 'flex' }}>
              <div style={{ position: 'absolute', inset: '-6px', borderRadius: '28px', background: 'rgba(139,92,246,0.2)', filter: 'blur(12px)', display: 'flex' }} />
              <div
                style={{
                  display: 'flex',
                  width: '110px',
                  height: '110px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  border: '2px solid rgba(139,92,246,0.3)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  position: 'relative',
                }}
              >
                {toolB.name[0]}
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', textAlign: 'center' }}>
              {toolB.name}
            </div>
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '6px 16px' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px' }}>★</div>
              <div style={{ color: ratingColorB, fontSize: '26px', fontWeight: 800 }}>{scoreB.toFixed(1)}</div>
              <div style={{ color: '#475569', fontSize: '14px' }}>/10</div>
            </div>
          </div>
        </div>

        {/* Winner bar + bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '24px', color: '#475569', fontSize: '14px' }}>
            {['Features', 'Pricing', 'Ease of Use', 'Verdict'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#f97316' }}>•</span> {item}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {winner && (
              <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '4px 12px', color: '#4ade80', fontSize: '13px', fontWeight: 600, display: 'flex' }}>
                Winner: {winner}
              </div>
            )}
            <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>toolpilot.com</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
