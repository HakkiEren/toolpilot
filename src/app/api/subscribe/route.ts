import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// ============================================================
// NEWSLETTER SUBSCRIBE API — Rate-limited, honeypot-protected
// Stores subscribers in Supabase `subscribers` table
// ============================================================

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, source, website } = body;

    // ─── Honeypot check ───
    if (website) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed!',
      });
    }

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Block disposable email providers
    const disposableDomains = [
      'mailinator.com', 'guerrillamail.com', 'tempmail.com',
      'throwaway.email', 'yopmail.com', 'sharklasers.com',
      'guerrillamailblock.com', 'grr.la', 'dispostable.com',
    ];
    const emailDomain = trimmedEmail.split('@')[1];
    if (disposableDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a permanent email address.' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const supabase = createServerClient();

    // Upsert — if email exists, update source and resubscribe
    const { error } = await supabase
      .from('subscribers')
      .upsert(
        {
          email: trimmedEmail,
          source: source || 'footer',
          subscribed_at: new Date().toISOString(),
          is_active: true,
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Supabase subscribe error:', error);
      // If table doesn't exist, still return success to not break UX
      // Table can be created via Supabase Dashboard
      if (error.code === '42P01') {
        console.warn('subscribers table does not exist yet. Create it in Supabase Dashboard.');
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed!',
        });
      }
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed!',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request. Please try again.' },
      { status: 400 }
    );
  }
}
