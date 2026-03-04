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
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1e293b', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48 }}>
          ToolPilot
        </div>
      ),
      size
    );
  }

  const ratingColor = tool.ratings.overall >= 8 ? '#22c55e' : tool.ratings.overall >= 6 ? '#eab308' : '#ef4444';

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>ToolPilot</div>
            <div style={{ color: '#64748b', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '20px' }}>{cat?.name || category}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 16px' }}>
            <div style={{ color: '#fbbf24', fontSize: '24px' }}>★</div>
            <div style={{ color: ratingColor, fontSize: '28px', fontWeight: 'bold' }}>{tool.ratings.overall.toFixed(1)}</div>
            <div style={{ color: '#64748b', fontSize: '18px' }}>/10</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '40px' }}>
          {/* Logo placeholder */}
          <div
            style={{
              display: 'flex',
              width: '140px',
              height: '140px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0,
            }}
          >
            {tool.name[0]}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: '52px', fontWeight: 'bold', color: 'white', lineHeight: 1.1, marginBottom: '12px' }}>
              {tool.name}
            </div>
            <div style={{ fontSize: '22px', color: '#94a3b8', lineHeight: 1.4, maxWidth: '700px' }}>
              {tool.tagline.length > 120 ? tool.tagline.slice(0, 117) + '...' : tool.tagline}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {tool.pricing.hasFreeplan && (
                <div style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', padding: '6px 14px', borderRadius: '8px', fontSize: '16px', fontWeight: 600 }}>
                  Free Plan Available
                </div>
              )}
              {tool.pricing.startingPrice && (
                <div style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '6px 14px', borderRadius: '8px', fontSize: '16px', fontWeight: 600 }}>
                  From ${tool.pricing.startingPrice}/mo
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '16px' }}>Honest Review • Features • Pricing • Alternatives</div>
          <div style={{ color: '#3b82f6', fontSize: '16px', fontWeight: 600 }}>toolpilot.com</div>
        </div>
      </div>
    ),
    size
  );
}
