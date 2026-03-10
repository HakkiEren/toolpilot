import { ImageResponse } from 'next/og';
import { getGlossaryTermBySlug } from '@/lib/glossary-data';

export const runtime = 'edge';
export const alt = 'ProPicked Glossary Term';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CATEGORY_COLORS: Record<string, string> = {
  'AI & Machine Learning': '#8b5cf6',
  'SaaS & Cloud': '#3b82f6',
  'E-commerce': '#10b981',
  'Marketing': '#f59e0b',
  'Hosting & Infrastructure': '#06b6d4',
  'Business & Productivity': '#ec4899',
};

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  const termName = term?.term || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const category = term?.category || 'Technology';
  const definition = term?.definition || '';
  const accentColor = CATEGORY_COLORS[category] || '#3b82f6';

  // Truncate definition for display
  const shortDef = definition.length > 120 ? definition.slice(0, 117) + '...' : definition;

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
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', display: 'flex' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px', display: 'flex' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>P</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>ProPicked</div>
            <div style={{ color: '#334155', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '18px' }}>Glossary</div>
          </div>
          <div style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, borderRadius: '10px', padding: '6px 16px', color: accentColor, fontSize: '14px', fontWeight: 700, display: 'flex' }}>
            {category}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontSize: termName.length > 30 ? '38px' : '48px',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
          marginBottom: '24px',
          position: 'relative',
        }}>
          What is {termName}?
        </div>

        {/* Definition */}
        <div style={{
          fontSize: '20px',
          color: '#94a3b8',
          lineHeight: 1.5,
          maxWidth: '900px',
          flex: 1,
          position: 'relative',
        }}>
          {shortDef}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', position: 'relative', marginTop: '16px' }}>
          <div style={{ color: '#475569', fontSize: '14px', display: 'flex', gap: '6px' }}>
            📖 Definition & Complete Guide
          </div>
          <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>propicked.com/glossary</div>
        </div>
      </div>
    ),
    size
  );
}
