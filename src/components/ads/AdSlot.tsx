'use client';

import { useEffect, useRef } from 'react';

// ============================================================
// Google AdSense Ad Slot Component
// Replace ADSENSE_PUB_ID when AdSense is approved
// ============================================================

const ADSENSE_PUB_ID = 'ca-pub-XXXXXXXXXX'; // TODO: Replace with real pub ID

interface AdSlotProps {
  /** Ad slot ID from AdSense */
  slot: string;
  /** Ad format: auto, rectangle, horizontal, vertical */
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  /** Layout key for in-feed/in-article ads */
  layoutKey?: string;
  /** Custom className for wrapper */
  className?: string;
  /** Whether this is an in-article ad */
  inArticle?: boolean;
}

export function AdSlot({ slot, format = 'auto', layoutKey, className = '', inArticle = false }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      // @ts-expect-error - AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className={`ad-container my-8 ${className}`}>
      <div className="text-center">
        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Advertisement</span>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={inArticle ? 'fluid' : format}
        data-full-width-responsive="true"
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(inArticle ? { 'data-ad-layout': 'in-article' } : {})}
        ref={adRef}
      />
    </div>
  );
}

/** Horizontal banner ad — best for between sections */
export function AdBanner({ className = '' }: { className?: string }) {
  return <AdSlot slot="BANNER_SLOT" format="horizontal" className={className} />;
}

/** In-article ad — best for inside content */
export function AdInArticle({ className = '' }: { className?: string }) {
  return <AdSlot slot="INARTICLE_SLOT" inArticle className={className} />;
}

/** Multiplex/grid ad — best for related content areas */
export function AdMultiplex({ className = '' }: { className?: string }) {
  return <AdSlot slot="MULTIPLEX_SLOT" format="auto" className={className} />;
}
