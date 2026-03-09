'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ToolLogoProps {
  logoUrl: string;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
  /** Optional website URL for Google Favicon fallback */
  websiteUrl?: string;
}

function LetterFallback({ name, size, className }: { name: string; size: number; className: string }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(size * 0.4, 12) }}
    >
      {name.charAt(0)}
    </div>
  );
}

/** Extract domain from URL for Google Favicon API */
function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function ToolLogo({ logoUrl, name, size = 48, className = '', priority = false, websiteUrl }: ToolLogoProps) {
  // 3-tier fallback: Primary logo → Google Favicon → Letter
  const [errorLevel, setErrorLevel] = useState(0); // 0=primary, 1=favicon, 2=letter

  const domain = websiteUrl ? extractDomain(websiteUrl) : null;
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

  // Level 2: Letter fallback (final)
  if (errorLevel >= 2 || (!logoUrl && !faviconUrl)) {
    return <LetterFallback name={name} size={size} className={className} />;
  }

  // Level 1: Google Favicon fallback
  if (errorLevel === 1 && faviconUrl) {
    return (
      <Image
        src={faviconUrl}
        alt={`${name} logo`}
        width={size}
        height={size}
        className={`rounded-xl object-contain bg-gray-50 dark:bg-gray-800 flex-shrink-0 ${className}`}
        loading="lazy"
        unoptimized
        onError={() => setErrorLevel(2)}
      />
    );
  }

  // Level 1 but no favicon available → skip to letter
  if (errorLevel === 1) {
    return <LetterFallback name={name} size={size} className={className} />;
  }

  // Level 0: Primary logo (Clearbit or stored URL)
  if (!logoUrl) {
    // No primary logo, try favicon directly
    if (faviconUrl) {
      return (
        <Image
          src={faviconUrl}
          alt={`${name} logo`}
          width={size}
          height={size}
          className={`rounded-xl object-contain bg-gray-50 dark:bg-gray-800 flex-shrink-0 ${className}`}
          loading="lazy"
          unoptimized
          onError={() => setErrorLevel(2)}
        />
      );
    }
    return <LetterFallback name={name} size={size} className={className} />;
  }

  return (
    <Image
      src={logoUrl}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`rounded-xl object-contain bg-gray-50 dark:bg-gray-800 flex-shrink-0 ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      unoptimized
      onError={() => setErrorLevel(1)}
    />
  );
}
