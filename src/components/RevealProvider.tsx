'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A single IntersectionObserver for every `.reveal` on the page, rather than
 * one per component. Elements unobserve themselves once shown, so this costs
 * nothing after the first scroll through a section.
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      root.removeAttribute('data-reveal-ready');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.setAttribute('data-revealed', '');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('.reveal:not([data-revealed])')
        .forEach((el) => io.observe(el));
    };

    scan();

    // Content that arrives after hydration (route change, lazy section) still
    // needs observing. Coalesce into one rAF-batched scan: an un-throttled
    // MutationObserver ran a full querySelectorAll per mutation during
    // hydration, which showed up as forced reflow and ~590ms of style/layout.
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (queued) cancelAnimationFrame(queued);
    };
  }, [pathname]);

  return null;
}
