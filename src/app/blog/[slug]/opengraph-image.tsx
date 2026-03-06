import { ImageResponse } from 'next/og';
import { getBlogBySlug } from '@/lib/data';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #0c1220, #1e293b)', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          ToolPilot Blog
        </div>
      ),
      size
    );
  }

  const categoryLabel = post.categorySlug
    ? post.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Technology';

  const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #0c1220 0%, #111827 40%, #1a1033 100%)',
          padding: '50px 60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', display: 'flex' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>T</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e2e8f0' }}>ToolPilot</div>
            <div style={{ color: '#334155', fontSize: '20px' }}>|</div>
            <div style={{ color: '#94a3b8', fontSize: '18px' }}>Blog</div>
          </div>
          <div style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '10px', padding: '6px 16px', color: '#c084fc', fontSize: '14px', fontWeight: 600, display: 'flex' }}>
            {categoryLabel}
          </div>
        </div>

        {/* Title area */}
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div
            style={{
              fontSize: post.title.length > 60 ? '38px' : '46px',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              maxWidth: '1000px',
              marginBottom: '20px',
            }}
          >
            {post.title}
          </div>

          {/* Author + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
                {post.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: 500 }}>{post.author}</div>
            </div>
            <div style={{ color: '#475569', fontSize: '14px' }}>•</div>
            <div style={{ color: '#64748b', fontSize: '15px' }}>{publishDate}</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', position: 'relative' }}>
          <div style={{ color: '#475569', fontSize: '14px', display: 'flex', gap: '6px' }}>
            Expert Analysis • Data-Driven Insights
          </div>
          <div style={{ color: '#3b82f6', fontSize: '15px', fontWeight: 600 }}>toolpilot.com/blog</div>
        </div>
      </div>
    ),
    size
  );
}
