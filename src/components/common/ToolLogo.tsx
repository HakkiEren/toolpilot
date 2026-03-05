'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ToolLogoProps {
  logoUrl: string;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
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

export function ToolLogo({ logoUrl, name, size = 48, className = '', priority = false }: ToolLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
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
      onError={() => setHasError(true)}
    />
  );
}
