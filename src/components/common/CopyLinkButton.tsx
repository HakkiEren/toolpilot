'use client';

// ============================================================
// COPY LINK BUTTON — Copies current page URL to clipboard
// Shows brief "Copied!" confirmation feedback
// ============================================================

import { useState, useCallback } from 'react';

interface CopyLinkButtonProps {
  url: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyLinkButton({ url, className = '', size = 'sm' }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <button
      onClick={handleCopy}
      className={`${sizeClasses} rounded-lg flex items-center justify-center transition-all ${
        copied
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
      } ${className}`}
      aria-label={copied ? 'Link copied!' : 'Copy link'}
      title={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )}
    </button>
  );
}
