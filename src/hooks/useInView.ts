'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useInView — triggers when an element enters the viewport.
 * Used for scroll-triggered reveal animations.
 *
 * @param options.threshold - Visibility threshold (0–1). Default 0.15 (15% visible).
 * @param options.rootMargin - IntersectionObserver rootMargin. Default '0px 0px -40px 0px'.
 * @param options.triggerOnce - If true, stops observing after first intersection.
 * @returns [ref, isInView] — attach ref to the target element.
 */
export function useInView(options?: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', triggerOnce = true } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference — show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}
