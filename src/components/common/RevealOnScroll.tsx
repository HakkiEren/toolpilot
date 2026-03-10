'use client';

import { useInView } from '@/hooks/useInView';

/**
 * RevealOnScroll — wraps children with a scroll-triggered fade-up animation.
 * Uses IntersectionObserver internally; respects prefers-reduced-motion.
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: isInView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
