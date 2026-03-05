import Image from 'next/image';

interface ToolLogoProps {
  logoUrl: string;
  name: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function ToolLogo({ logoUrl, name, size = 48, className = '', priority = false }: ToolLogoProps) {
  if (!logoUrl) {
    return (
      <div
        className={`rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(size * 0.4, 12) }}
      >
        {name.charAt(0)}
      </div>
    );
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
      unoptimized={!logoUrl.includes('clearbit.com') && !logoUrl.includes('google.com/s2')}
    />
  );
}
