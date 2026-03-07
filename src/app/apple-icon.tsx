import { ImageResponse } from 'next/og';

// Route segment config
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple Touch Icon — gradient "P" logo
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: '36px',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '110px',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  );
}
