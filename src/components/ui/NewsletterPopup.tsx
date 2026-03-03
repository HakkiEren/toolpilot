'use client';

import { useState, useEffect } from 'react';

export function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem('newsletter_dismissed');
    if (dismissed) return;

    // Show after 30 seconds on page
    const timer = setTimeout(() => {
      setShow(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store email (in production, send to API)
    localStorage.setItem('newsletter_email', email);
    localStorage.setItem('newsletter_dismissed', 'subscribed');
    setSubmitted(true);
    setTimeout(() => setShow(false), 3000);
  };

  const dismiss = () => {
    localStorage.setItem('newsletter_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">You&apos;re in!</h3>
            <p className="text-gray-500">
              Welcome to the ToolPilot community. We&apos;ll send you the best AI tool insights weekly.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold mb-2">
                Stay Ahead of AI
              </h3>
              <p className="text-gray-500">
                Get weekly insights on the best AI tools, exclusive comparisons, and early access to new reviews.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 outline-none dark:bg-gray-800 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
              >
                Subscribe — It&apos;s Free ✨
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-3">
              No spam. Unsubscribe anytime. Join 5,000+ AI enthusiasts.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
