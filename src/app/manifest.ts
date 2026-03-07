import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

// ============================================================
// WEB APP MANIFEST — PWA-ready progressive web app support
// ============================================================

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Compare Digital Tools`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/opengraph-image',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  };
}
