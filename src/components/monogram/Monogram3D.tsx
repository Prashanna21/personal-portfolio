'use client';

import { useEffect, useRef } from 'react';

const LAYERS = 12;
const STEP = 1.15; // px of depth per layer

/**
 * The letterhead seal — a genuinely 3D, cursor-reactive monogram built from
 * laminated CSS layers rather than WebGL.
 *
 * The first version of this used React Three Fiber. It looked right, but it
 * pulled all of three.js in for an 84px mark: desktop script transfer went
 * 162KB → 395KB and TBT 80ms → 350ms, dropping Lighthouse performance from 99
 * to 84. Not a defensible trade for one logo, especially when the stack
 * constellation already carries the site's WebGL moment.
 *
 * Extruding by lamination — a stack of identical rounded squares each pushed
 * further back in Z — gives a correct rounded silhouette that a few rotated
 * face quads could not, costs twelve empty spans, and rotates on the
 * compositor. Shading is a single `color-mix` toward the page, which reads as a
 * lit edge on the dark tile in Paper and a shaded edge on the light tile in
 * After hours, with no per-theme special-casing.
 */
export function Monogram3D({ size = 84 }: { size?: number }) {
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fine = window.matchMedia('(pointer: fine)').matches;

    let raf = 0;
    let t = 0; // seconds, for the idle drift
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      // idle drift keeps the extrusion readable even before the cursor moves
      const idleY = Math.sin(t * 0.42) * 13;
      const idleX = Math.sin(t * 0.33) * 5;
      const aimY = tx * 20 + idleY;
      const aimX = -ty * 12 + idleX;

      const k = 1 - Math.pow(0.002, dt);
      cx += (aimX - cx) * k;
      cy += (aimY - cy) * k;

      el.style.setProperty('--rx', `${cx.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${cy.toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const radius = Math.round(size * 0.235);

  return (
    <span
      className="inline-block shrink-0 align-middle"
      style={{ width: size, height: size, perspective: `${size * 5}px` }}
      aria-hidden
    >
      <span
        ref={inner}
        className="relative block h-full w-full [transform-style:preserve-3d]"
        style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
      >
        {/* extrusion: back-to-front so the front face paints last */}
        {Array.from({ length: LAYERS }, (_, i) => LAYERS - i).map((depth) => (
          <span
            key={depth}
            className="absolute inset-0 block"
            style={{
              borderRadius: radius,
              transform: `translateZ(${-depth * STEP}px)`,
              background: `color-mix(in srgb, var(--ink) ${100 - depth * 1.6}%, var(--paper))`,
            }}
          />
        ))}

        {/* front face */}
        <span
          className="absolute inset-0 grid place-items-center bg-ink font-display leading-none text-paper"
          style={{ borderRadius: radius, fontSize: size * 0.46 }}
        >
          <span style={{ letterSpacing: '-0.02em', transform: 'translateY(0.03em)' }}>PM</span>
        </span>
      </span>
    </span>
  );
}
