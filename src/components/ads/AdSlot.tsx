'use client';

import { useEffect, useRef } from 'react';

// ============================================================
// Google AdSense Ad Slot System — Premium Placement Strategy
// Maximum RPM with optimal UX balance
// ============================================================

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXX';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid';
  layoutKey?: string;
  className?: string;
  inArticle?: boolean;
  responsive?: boolean;
}

export function AdSlot({ slot, format = 'auto', layoutKey, className = '', inArticle = false, responsive = true }: AdSlotProps) {
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

  // CLS prevention: reserve space for ad before it loads
  const minHeight = format === 'horizontal' ? 90 : format === 'vertical' ? 250 : inArticle ? 100 : 100;

  return (
    <div className={`ad-slot ${className}`} role="complementary" aria-label="Advertisement">
      <div className="text-center mb-1">
        <span className="text-[10px] text-gray-400/60 uppercase tracking-[0.2em]">Sponsored</span>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={inArticle ? 'fluid' : format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(inArticle ? { 'data-ad-layout': 'in-article' } : {})}
        ref={adRef}
      />
    </div>
  );
}

// ============================================================
// PREMIUM AD PLACEMENTS — Optimized for comparison/review sites
// Each placement targets specific user intent moments
// ============================================================

/** P1: After intro, before first comparison — highest CTR position */
export function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`my-10 ${className}`}>
      <AdSlot slot="BANNER_SLOT" format="horizontal" />
    </div>
  );
}

/** P2: In-article ad — flows with content, high viewability */
export function AdInArticle({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <AdSlot slot="INARTICLE_SLOT" inArticle />
    </div>
  );
}

/** P3: Multiplex grid — before verdict section, multiple click opportunities */
export function AdMultiplex({ className = '' }: { className?: string }) {
  return (
    <div className={`my-10 ${className}`}>
      <AdSlot slot="MULTIPLEX_SLOT" format="auto" layoutKey="-6t+ed+2i-1n-4w" />
    </div>
  );
}

/** P4: Sidebar sticky — desktop only, highest viewable impressions */
export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-24">
        <AdSlot slot="SIDEBAR_SLOT" format="vertical" responsive={false} />
      </div>
    </div>
  );
}

/** P5: Native ad card — blends with tool cards, high engagement */
export function AdNative({ className = '' }: { className?: string }) {
  return (
    <div className={`my-6 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 ${className}`}>
      <AdSlot slot="NATIVE_SLOT" format="fluid" layoutKey="-fb+5w+4e-db+86" />
    </div>
  );
}

/** P6: Footer leaderboard — catch-all for users who read the full page */
export function AdFooter({ className = '' }: { className?: string }) {
  return (
    <div className={`my-8 ${className}`}>
      <AdSlot slot="FOOTER_SLOT" format="horizontal" />
    </div>
  );
}
