import { ImageResponse } from 'next/og';

export const alt = 'ProPicked — Compare the Best Digital Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
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
        {/* Decorative gradient orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', display: 'flex' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', position: 'relative' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '36px',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
            }}
          >
            P
          </div>
          <span style={{ fontSize: '56px', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>
            ProPicked
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '26px', color: '#94a3b8', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4 }}>
          Find & Compare the Best Digital Tools for Your Business
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          padding: '20px 60px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          {[
            { value: '433+', label: 'Tools Reviewed' },
            { value: '327+', label: 'Comparisons' },
            { value: '100%', label: 'Independent' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6', fontSize: '18px', fontWeight: 700 }}>{stat.value}</span>
              <span style={{ color: '#64748b', fontSize: '14px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
