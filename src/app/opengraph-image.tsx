import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ToolPilot — Compare the Best Digital Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            T
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            ToolPilot
          </span>
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Compare the Best Digital Tools Across
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['AI Tools', 'SaaS', 'E-commerce', 'Marketing', 'Hosting', 'Business'].map(
            (cat) => (
              <div
                key={cat}
                style={{
                  padding: '8px 20px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '999px',
                  color: '#93c5fd',
                  fontSize: '18px',
                }}
              >
                {cat}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '32px',
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          <span>400+ Tools Reviewed</span>
          <span>·</span>
          <span>100% Independent</span>
          <span>·</span>
          <span>Updated 2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
