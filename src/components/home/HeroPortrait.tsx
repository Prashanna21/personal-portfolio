'use client';

import { useEffect, useRef } from 'react';

/**
 * The 1.06 → 1.00 settle is a pure CSS animation on the wrapper, so it runs
 * before hydration and a no-JS visitor still sees the portrait. This component
 * only adds the damped cursor parallax on top, written to CSS variables and
 * applied via `translate` so it composes with the animation's `transform`
 * instead of overwriting it.
 */
export function HeroPortrait({ children }: { children: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inner.current;
    const box = host.current;
    if (!el || !box) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--px', `${cx.toFixed(2)}px`);
      el.style.setProperty('--py', `${cy.toFixed(2)}px`);
      raf =
        Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * -22;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -22;
      start();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };

    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={host} className="absolute inset-0 overflow-clip">
      <div
        ref={inner}
        className="portrait-settle absolute -inset-6 will-change-transform"
        style={{ translate: 'var(--px, 0) var(--py, 0)' }}
      >
        {children}
      </div>
    </div>
  );
}
