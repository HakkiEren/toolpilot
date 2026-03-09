'use client';

import { useState } from 'react';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

interface BadgeEmbedCodeProps {
  toolName: string;
  toolSlug: string;
  categorySlug: string;
  rating: number;
  badgeType: 'rated' | 'category-winner';
  categoryName?: string;
}

const year = new Date().getFullYear();

function getTierLabel(score: number): string {
  if (score >= 9.0) return 'Exceptional';
  if (score >= 8.0) return 'Excellent';
  return 'Very Good';
}

function getTierColor(score: number): string {
  if (score >= 9.0) return '#8B5CF6';
  if (score >= 8.0) return '#2563EB';
  return '#059669';
}

function generateBadgeSvg(
  toolName: string,
  rating: number,
  badgeType: 'rated' | 'category-winner',
  categoryName?: string
): string {
  const tierLabel = getTierLabel(rating);
  const tierColor = getTierColor(rating);
  const subtitle = badgeType === 'category-winner'
    ? `${categoryName} Winner ${year}`
    : `${tierLabel} ${year}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="70" viewBox="0 0 200 70"><rect width="200" height="70" rx="8" fill="#fff" stroke="${tierColor}" stroke-width="2"/><text x="40" y="24" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#111">${SITE_NAME}</text><text x="40" y="40" font-family="system-ui,sans-serif" font-size="10" fill="${tierColor}" font-weight="600">${subtitle}</text><text x="40" y="56" font-family="system-ui,sans-serif" font-size="10" fill="#666">${rating.toFixed(1)}/10</text><g transform="translate(10,15)"><path d="M12 2l2.47 5.01L20 7.74l-4 3.9.94 5.51L12 14.4l-5.94 2.75L7 11.64 3 7.74l5.53-.73z" fill="${tierColor}" opacity="0.9"/></g></svg>`;
}

export function BadgeEmbedCode({ toolName, toolSlug, categorySlug, rating, badgeType, categoryName }: BadgeEmbedCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const reviewUrl = `${SITE_URL}/${categorySlug}/${toolSlug}`;
  const tierLabel = getTierLabel(rating);
  const tierColor = getTierColor(rating);
  const svgCode = generateBadgeSvg(toolName, rating, badgeType, categoryName);

  const embedCode = `<a href="${reviewUrl}?ref=badge" target="_blank" rel="noopener" title="${toolName} - ${SITE_NAME} ${tierLabel} ${year}">${svgCode}</a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = embedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full text-center text-xs font-medium py-2 px-3 rounded-lg border-2 border-dashed hover:border-solid transition-all"
        style={{ borderColor: tierColor, color: tierColor }}
        aria-label={`Get embed badge code for ${toolName}`}
      >
        Get Badge Code
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Badge Preview */}
      <div className="flex justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer" title={`${toolName} - ${SITE_NAME} ${tierLabel} ${year}`}>
          <div dangerouslySetInnerHTML={{ __html: svgCode }} />
        </a>
      </div>

      {/* Embed Code */}
      <div className="relative">
        <pre className="text-[10px] leading-tight bg-gray-900 text-gray-300 p-3 rounded-lg overflow-x-auto max-h-20 scrollbar-thin">
          {embedCode}
        </pre>
        <button
          onClick={handleCopy}
          aria-label="Copy embed code to clipboard"
          className={`absolute top-1.5 right-1.5 text-[10px] px-2 py-1 rounded font-medium transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <button
        onClick={() => setIsOpen(false)}
        aria-label="Close embed code panel"
        className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
