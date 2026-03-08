import { ImageResponse } from 'next/og';
import { CATEGORIES } from '@/lib/constants';

// OG images inherit generateStaticParams from parent [category]/page.tsx
export const alt = 'ProPicked Category';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  const name = cat?.name || category;
  const color = cat?.color || '#3b82f6';
  const description = cat?.description || `Compare the best ${name} tools`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(145deg, #0c1220 0%, #111827 40%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient orbs using category color */}
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-40px', width: '350px', height: '350px', borderRadius: '50%', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, display: 'flex' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex' }} />

        {/* Category badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 28px',
          background: `${color}20`,
          border: `1px solid ${color}40`,
          borderRadius: '999px',
          marginBottom: '28px',
        }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: color, display: 'flex',
          }} />
          <span style={{ color, fontSize: '20px', fontWeight: 700 }}>
            {name}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '52px',
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: 1.2,
          letterSpacing: '-1px',
          marginBottom: '20px',
        }}>
          Best {name} — Compared & Ranked
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '22px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '750px',
          lineHeight: 1.5,
        }}>
          {description.length > 100 ? description.slice(0, 100) + '...' : description}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 48px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '18px', fontWeight: 'bold',
            }}>P</div>
            <span style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>ProPicked</span>
          </div>
          <span style={{ color: '#64748b', fontSize: '16px' }}>propicked.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
