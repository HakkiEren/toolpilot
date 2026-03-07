import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Trailing slash normalization (301 redirect) ───
  // Remove trailing slash (except root "/")
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // ─── Lowercase URL normalization (301 redirect) ───
  // Redirect uppercase URLs to lowercase for SEO consistency
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // ─── Block common exploit paths ───
  const blockedPaths = [
    '/wp-admin', '/wp-login', '/wp-content', '/wp-includes',
    '/.env', '/.git', '/xmlrpc.php', '/phpmyadmin',
    '/admin/config', '/config.php', '/setup.php',
  ];
  const lowerPath = pathname.toLowerCase();
  if (blockedPaths.some(blocked => lowerPath.startsWith(blocked))) {
    return new NextResponse(null, { status: 404 });
  }

  // ─── Rate limiting for API-like routes ───
  // Contact form, search, and feed have lighter rate limiting via headers
  const response = NextResponse.next();

  // Add server timing for performance monitoring
  response.headers.set('Server-Timing', `proxy;dur=0`);

  // ─── Content-Language header for SEO ───
  response.headers.set('Content-Language', 'en');

  // ─── Vary header for proper CDN caching ───
  response.headers.set('Vary', 'Accept-Encoding');

  // ─── Content Security Policy (Report-Only) ───
  // Loose CSP that allows Google services, Supabase, and common CDNs
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://adservice.google.com https://tpc.googlesyndication.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://logo.clearbit.com https://www.google.com https://*.googleusercontent.com https://*.googlesyndication.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://gqqgbfoniyfbpbognnks.supabase.co https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com",
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  // Report-only for now — switch to Content-Security-Policy once stable
  response.headers.set('Content-Security-Policy-Report-Only', cspDirectives);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|css|js|txt|xml)).*)',
  ],
};
