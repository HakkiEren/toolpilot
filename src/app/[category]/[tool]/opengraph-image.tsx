import { ImageResponse } from 'next/og';
import { getToolBySlug } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

export const runtime = 'edge';
export const alt = 'Tool Review';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category, tool: toolSlug } = await params;
  const tool = await getToolBySlug(category, toolSlug);
  const cat = CATEGORIES[category];

  if (!tool) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0c1220, #1e293b)', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          ProPicked
        </div>
      ),
      size
    );
  }

  const score = tool.ratings.overall;
  const ratingColor = score >= 8 ? '#22c55e' : score >= 6 ? '#eab308' : '#ef4444';
  const ratingBg = score >= 8 ? 'rgba(34,197,94,0.15)' : score >= 6 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)';

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
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', display: 'flex' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>P</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>ProPicked</div>
            <div style={{ color: '#334155', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '18px' }}>{cat?.name || category}</div>
          </div>

          {/* Rating badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: ratingBg, borderRadius: '16px', padding: '10px 20px', border: `1px solid ${ratingColor}30` }}>
            <div style={{ color: '#fbbf24', fontSize: '22px' }}>★</div>
            <div style={{ color: ratingColor, fontSize: '32px', fontWeight: 800 }}>{score.toFixed(1)}</div>
            <div style={{ color: '#64748b', fontSize: '16px' }}>/10</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '40px', position: 'relative' }}>
          {/* Logo with glow */}
          <div style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: '-8px', borderRadius: '36px', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))', filter: 'blur(16px)', display: 'flex' }} />
            <div
              style={{
                display: 'flex',
                width: '130px',
                height: '130px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #1e293b, #334155)',
                border: '2px solid rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
              }}
            >
              {tool.name[0]}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              {tool.name}
            </div>
            <div style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.5, maxWidth: '650px' }}>
              {tool.tagline.length > 120 ? tool.tagline.slice(0, 117) + '...' : tool.tagline}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {tool.pricing.hasFreeplan && (
                <div style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '8px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(34,197,94,0.2)', display: 'flex' }}>
                  ✓ Free Plan
                </div>
              )}
              {tool.pricing.startingPrice && (
                <div style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '8px 16px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)', display: 'flex' }}>
                  From ${tool.pricing.startingPrice}/mo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '24px', color: '#475569', fontSize: '14px' }}>
            {['Review', 'Features', 'Pricing', 'Alternatives'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#3b82f6' }}>•</span> {item}
              </span>
            ))}
          </div>
          <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>propicked.com</div>
        </div>
      </div>
    ),
    size
  );
}
