import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per window

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
    const { name, email, category, message, website, _t } = body;

    // ─── Honeypot check ───
    // If the hidden "website" field is filled, it's a bot
    if (website) {
      // Return success to fool the bot, but don't process
      return NextResponse.json({
        success: true,
        message: 'Thank you! We will get back to you within 48 hours.',
      });
    }

    // ─── Timing check ───
    // If form was submitted too quickly (< 3 seconds), likely a bot
    if (_t && typeof _t === 'number') {
      const elapsed = Date.now() - _t;
      if (elapsed < 3000) {
        return NextResponse.json({
          success: true,
          message: 'Thank you! We will get back to you within 48 hours.',
        });
      }
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Trim and check lengths
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedCategory = category ? String(category).trim() : 'General question';
    const trimmedMessage = String(message).trim();

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters.' },
        { status: 400 }
      );
    }

    if (trimmedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be under 100 characters.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be under 5000 characters.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate category against allowed values
    const allowedCategories = [
      'Report an error',
      'Suggest a tool',
      'Business inquiry',
      'General question',
    ];
    if (!allowedCategories.includes(trimmedCategory)) {
      return NextResponse.json(
        { error: 'Invalid category selected.' },
        { status: 400 }
      );
    }

    // Log the submission (TODO: send email notification, store in DB)
    console.log('Contact form submission:', {
      name: trimmedName,
      email: trimmedEmail,
      category: trimmedCategory,
      message: trimmedMessage,
      ip,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will get back to you within 48 hours.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request. Please try again.' },
      { status: 400 }
    );
  }
}
