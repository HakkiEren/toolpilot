import { ImageResponse } from 'next/og';

// Calculator types and their display info
const CALC_INFO: Record<string, { title: string; icon: string; color: string }> = {
  'roi': { title: 'SaaS ROI Calculator', icon: '📊', color: '#3b82f6' },
  'email-marketing-roi': { title: 'Email Marketing ROI', icon: '📧', color: '#8b5cf6' },
  'hosting-cost': { title: 'Hosting Cost Calculator', icon: '🖥️', color: '#06b6d4' },
  'ecommerce-profit': { title: 'E-commerce Profit Calculator', icon: '🛒', color: '#10b981' },
  'ai-cost': { title: 'AI Cost Estimator', icon: '🤖', color: '#f59e0b' },
  'team-productivity': { title: 'Team Productivity Calculator', icon: '👥', color: '#ec4899' },
};

export const alt = 'ProPicked Calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return Object.keys(CALC_INFO).map((type) => ({ type }));
}

export default async function OGImage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const calc = CALC_INFO[type] || { title: 'Calculator', icon: '🧮', color: '#3b82f6' };

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
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '450px', height: '450px', borderRadius: '50%', background: `radial-gradient(circle, ${calc.color}20 0%, transparent 70%)`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-120px', left: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${calc.color}15 0%, transparent 70%)`, display: 'flex' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex' }} />

        {/* "Free Calculator" badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 24px',
          background: `${calc.color}15`,
          border: `1px solid ${calc.color}35`,
          borderRadius: '999px',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '20px' }}>{calc.icon}</span>
          <span style={{ color: calc.color, fontSize: '18px', fontWeight: 700 }}>
            Free Calculator
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
          {calc.title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '22px',
          color: '#94a3b8',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.5,
        }}>
          Calculate, compare, and make smarter software decisions
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
