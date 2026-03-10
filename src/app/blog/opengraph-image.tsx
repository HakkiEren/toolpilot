import { ImageResponse } from 'next/og';

export const alt = 'ProPicked Blog — Expert Guides & Tool Reviews';
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
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', display: 'flex' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex' }} />

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 24px',
          background: 'rgba(168,85,247,0.12)',
          border: '1px solid rgba(168,85,247,0.25)',
          borderRadius: '999px',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '20px' }}>📝</span>
          <span style={{ color: '#c084fc', fontSize: '18px', fontWeight: 700 }}>
            Expert Content
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontSize: '56px',
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          marginBottom: '20px',
        }}>
          ProPicked Blog
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '22px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.5,
        }}>
          Expert guides, in-depth tool reviews, and actionable insights for your business
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
          <span style={{ color: '#64748b', fontSize: '16px' }}>propicked.com/blog</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
