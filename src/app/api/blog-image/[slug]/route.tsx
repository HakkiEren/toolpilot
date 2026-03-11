import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getBlogBySlug } from '@/lib/data';

export const runtime = 'edge';

// Category design themes
const THEMES: Record<string, {
  bg: string;
  accent1: string;
  accent2: string;
  accent3: string;
  icon: string;
  pattern: string;
}> = {
  'ai-tools': {
    bg: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 30%, #7c3aed 60%, #8b5cf6 100%)',
    accent1: 'rgba(196, 181, 253, 0.15)',
    accent2: 'rgba(139, 92, 246, 0.2)',
    accent3: 'rgba(167, 139, 250, 0.12)',
    icon: '\u{1F9E0}',
    pattern: 'neural',
  },
  'saas': {
    bg: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 30%, #2563eb 60%, #3b82f6 100%)',
    accent1: 'rgba(147, 197, 253, 0.15)',
    accent2: 'rgba(59, 130, 246, 0.2)',
    accent3: 'rgba(96, 165, 250, 0.12)',
    icon: '\u{2601}\u{FE0F}',
    pattern: 'grid',
  },
  'ecommerce': {
    bg: 'linear-gradient(135deg, #064e3b 0%, #047857 30%, #059669 60%, #10b981 100%)',
    accent1: 'rgba(110, 231, 183, 0.15)',
    accent2: 'rgba(16, 185, 129, 0.2)',
    accent3: 'rgba(52, 211, 153, 0.12)',
    icon: '\u{1F6D2}',
    pattern: 'dots',
  },
  'marketing': {
    bg: 'linear-gradient(135deg, #78350f 0%, #b45309 30%, #d97706 60%, #f59e0b 100%)',
    accent1: 'rgba(253, 230, 138, 0.15)',
    accent2: 'rgba(245, 158, 11, 0.2)',
    accent3: 'rgba(252, 211, 77, 0.12)',
    icon: '\u{1F4E2}',
    pattern: 'waves',
  },
  'hosting': {
    bg: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 30%, #dc2626 60%, #ef4444 100%)',
    accent1: 'rgba(252, 165, 165, 0.15)',
    accent2: 'rgba(239, 68, 68, 0.2)',
    accent3: 'rgba(248, 113, 113, 0.12)',
    icon: '\u{1F5A5}\u{FE0F}',
    pattern: 'circuit',
  },
  'business': {
    bg: 'linear-gradient(135deg, #312e81 0%, #4338ca 30%, #4f46e5 60%, #6366f1 100%)',
    accent1: 'rgba(165, 180, 252, 0.15)',
    accent2: 'rgba(99, 102, 241, 0.2)',
    accent3: 'rgba(129, 140, 248, 0.12)',
    icon: '\u{1F4BC}',
    pattern: 'blocks',
  },
};

const DEFAULT_THEME = {
  bg: 'linear-gradient(135deg, #1e293b 0%, #334155 30%, #475569 60%, #64748b 100%)',
  accent1: 'rgba(203, 213, 225, 0.15)',
  accent2: 'rgba(148, 163, 184, 0.2)',
  accent3: 'rgba(226, 232, 240, 0.12)',
  icon: '\u{1F4DD}',
  pattern: 'dots',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#1e293b', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 32 }}>
          ProPicked Blog
        </div>
      ),
      { width: 800, height: 420 }
    );
  }

  const theme = (post.categorySlug && THEMES[post.categorySlug]) || DEFAULT_THEME;
  const categoryLabel = post.categorySlug
    ? post.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Technology';

  // Dynamic font size based on title length
  const titleSize = post.title.length > 70 ? 28 : post.title.length > 50 ? 32 : 36;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: theme.bg,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative elements */}
        {/* Large circle top-right */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: theme.accent1,
          display: 'flex',
        }} />
        {/* Medium circle bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-20px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: theme.accent2,
          display: 'flex',
        }} />
        {/* Small circle center-right */}
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)',
          display: 'flex',
        }} />
        {/* Tiny accent circle */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '60%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: theme.accent3,
          display: 'flex',
        }} />
        {/* Extra decorative ring */}
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
        }} />

        {/* Large background icon */}
        <div style={{
          position: 'absolute',
          right: '30px',
          bottom: '20px',
          fontSize: '140px',
          opacity: 0.06,
          display: 'flex',
          lineHeight: 1,
        }}>
          {theme.icon}
        </div>

        {/* Dot grid pattern */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '120px',
          height: '80px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          opacity: 0.12,
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 40px',
          flex: 1,
          position: 'relative',
        }}>
          {/* Top: Category + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '24px',
              padding: '6px 16px',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: '16px', display: 'flex' }}>{theme.icon}</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{categoryLabel}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>P</div>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: 600 }}>ProPicked</span>
            </div>
          </div>

          {/* Middle: Title */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '85%',
          }}>
            <div style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.25,
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}>
              {post.title}
            </div>
          </div>

          {/* Bottom: Author + meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {post.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{post.author}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              <span>propicked.com</span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          display: 'flex',
        }} />
      </div>
    ),
    { width: 800, height: 420 }
  );
}
