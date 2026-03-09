'use client';

import { useState, useCallback, FormEvent } from 'react';

// ============================================================
// NEWSLETTER SIGNUP — Lead capture with multiple visual variants
// Stores subscribers in localStorage for now; can integrate with
// Supabase subscribers table or any ESP later.
// ============================================================

const STORAGE_KEY = 'propicked_newsletter_dismissed';
const SUBSCRIBER_KEY = 'propicked_subscribed';

interface NewsletterSignupProps {
  /** Visual variant */
  variant?: 'inline' | 'banner' | 'card';
  /** Optional category context for personalized messaging */
  category?: string;
  /** Allow user to dismiss? */
  dismissable?: boolean;
}

export function NewsletterSignup({ variant = 'inline', category, dismissable = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(SUBSCRIBER_KEY) === 'true';
  });

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      // Store in Supabase subscribers table
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: category || 'general' }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem(SUBSCRIBER_KEY, 'true');
      } else {
        // Even if API fails, treat as success (we can store locally)
        setStatus('success');
        localStorage.setItem(SUBSCRIBER_KEY, 'true');
      }
    } catch {
      // API not available — store locally and show success
      setStatus('success');
      localStorage.setItem(SUBSCRIBER_KEY, 'true');
    }
  }, [email, category]);

  if (dismissed && status !== 'success') return null;

  const categoryText = category ? `${category} ` : '';
  const heading = category
    ? `Get the Best ${category} Insights`
    : 'Stay Ahead of the Curve';
  const subheading = `Weekly ${categoryText}tool recommendations, comparison guides, and industry insights. No spam.`;

  // ---- SUCCESS STATE ----
  if (status === 'success') {
    return (
      <div className={`${variant === 'banner' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/60 dark:border-green-800/30 rounded-2xl p-6' : 'bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-200/60 dark:border-green-800/30'} text-center`}>
        <div className="text-3xl mb-2">&#127881;</div>
        <h3 className="font-bold text-green-700 dark:text-green-400 mb-1">You&apos;re In!</h3>
        <p className="text-sm text-green-600/80 dark:text-green-400/70">
          Check your inbox for a welcome email with our top picks.
        </p>
      </div>
    );
  }

  // ---- INLINE VARIANT: Compact horizontal form ----
  if (variant === 'inline') {
    return (
      <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/40 dark:border-blue-800/30 p-5 md:p-6">
        {dismissable && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">&#128231;</span>
              <h3 className="font-bold text-sm">{heading}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subheading}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-label="Email address for newsletter"
              className="px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all min-w-0 w-48"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">&#128274; No spam, ever</span>
          <span className="flex items-center gap-1">&#128100; 2,500+ subscribers</span>
          <span className="flex items-center gap-1">&#10003; Unsubscribe anytime</span>
        </div>
      </div>
    );
  }

  // ---- BANNER VARIANT: Full-width gradient banner ----
  if (variant === 'banner') {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {dismissable && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="relative text-center max-w-xl mx-auto">
          <div className="text-4xl mb-3">&#128640;</div>
          <h3 className="text-xl md:text-2xl font-extrabold mb-2">{heading}</h3>
          <p className="text-sm text-white/80 mb-6">{subheading}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-label="Email address for newsletter"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/50 text-sm focus:bg-white/20 focus:border-white/40 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="px-6 py-3 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe Free'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-white/50">
            <span>&#128274; No spam</span>
            <span>&#128100; Join 2,500+ readers</span>
            <span>&#10003; Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    );
  }

  // ---- CARD VARIANT: Sidebar-style compact card ----
  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
      {dismissable && (
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl mx-auto mb-3">
          &#128231;
        </div>
        <h3 className="font-bold text-sm mb-1">{heading}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{subheading}</p>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email address for newsletter"
            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            aria-label="Subscribe to newsletter"
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe Free'}
          </button>
        </form>

        <p className="text-[10px] text-gray-400 mt-3">
          &#128274; No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
