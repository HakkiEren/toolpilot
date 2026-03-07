'use client';

// ============================================================
// INLINE NEWSLETTER CTA — Compact newsletter form for blog posts
// Appears between article content and related links
// ============================================================

import { useState, useRef } from 'react';

export function InlineNewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source: 'blog-inline',
          website: honeypotRef.current?.value || '',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Welcome aboard!');
        setEmail('');
        localStorage.setItem('newsletter_dismissed', 'subscribed');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Try again.');
    }
  };

  // Don't show if already subscribed
  if (typeof window !== 'undefined' && localStorage.getItem('newsletter_dismissed') === 'subscribed') {
    return null;
  }

  if (status === 'success') {
    return (
      <div className="mt-8 mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold">{message}</span>
          <span className="text-white/80 text-sm ml-1">We&apos;ll send you weekly insights.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-1">Get Weekly Tool Insights</h3>
            <p className="text-sm text-white/80">Join our newsletter for exclusive comparisons, reviews, and early access to new content.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto flex-shrink-0">
            {/* Honeypot */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 pointer-events-none h-0 w-0"
              aria-hidden="true"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="flex-1 md:w-48 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex-shrink-0 px-5 py-2.5 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-md disabled:opacity-70"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
        {status === 'error' && (
          <p className="text-xs text-red-200 mt-2 text-center md:text-right">{message}</p>
        )}
      </div>
    </div>
  );
}
