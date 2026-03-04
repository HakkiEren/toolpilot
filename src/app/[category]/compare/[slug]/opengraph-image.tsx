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
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1e293b', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>
          ToolPilot
        </div>
      ),
      size
    );
  }

  const { toolA, toolB } = comparison;
  const winnerColor = toolA.ratings.overall >= toolB.ratings.overall ? '#3b82f6' : '#8b5cf6';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>ToolPilot</div>
            <div style={{ color: '#64748b', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '20px' }}>{cat?.name || category} Comparison</div>
          </div>
          <div style={{ color: '#64748b', fontSize: '16px' }}>2026</div>
        </div>

        {/* VS Section */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
          {/* Tool A */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              {toolA.name[0]}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              {toolA.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <div style={{ color: '#fbbf24', fontSize: '20px' }}>★</div>
              <div style={{ color: toolA.ratings.overall >= 8 ? '#22c55e' : '#eab308', fontSize: '24px', fontWeight: 'bold' }}>
                {toolA.ratings.overall.toFixed(1)}
              </div>
            </div>
          </div>

          {/* VS Badge */}
          <div
            style={{
              display: 'flex',
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0,
            }}
          >
            VS
          </div>

          {/* Tool B */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              {toolB.name[0]}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              {toolB.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <div style={{ color: '#fbbf24', fontSize: '20px' }}>★</div>
              <div style={{ color: toolB.ratings.overall >= 8 ? '#22c55e' : '#eab308', fontSize: '24px', fontWeight: 'bold' }}>
                {toolB.ratings.overall.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '16px' }}>Honest Comparison • Features • Pricing • Verdict</div>
          <div style={{ color: '#3b82f6', fontSize: '16px', fontWeight: 600 }}>toolpilot.com</div>
        </div>
      </div>
    ),
    size
  );
}
