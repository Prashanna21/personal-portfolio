'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  categories,
  categoryList,
  neighboursOf,
  nodeById,
  nodes,
  type Category,
} from '@/data/stack';
import { useThemeColors } from '@/lib/useThemeColors';
import { Cube } from '@/components/icons';

// Loaded only when the section is actually rendered — see `mount3d` below.
const StackScene = dynamic(() => import('./StackScene'), { ssr: false });

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')),
    );
  } catch {
    return false;
  }
};

/**
 * `fallback` is rendered on the server and handed down as a child rather than
 * imported here. StackGraphSVG pulls in `logos.ts` (~30KB of path data), and
 * importing it from this client component shipped all of it — plus the whole
 * static SVG tree — in the initial bundle, for markup the client never needs
 * to own. This keeps it server-only.
 */
export function StackGraph({ fallback }: { fallback: React.ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [active, setActive] = useState(false);
  const [allowOrbit, setAllowOrbit] = useState(false);
  const [compact, setCompact] = useState(false);

  const [focusCat, setFocusCat] = useState<Category | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const colors = useThemeColors();

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Coarse pointers keep drift only: orbit controls would swallow page scroll.
    setAllowOrbit(window.matchMedia('(pointer: fine)').matches);
    setCompact(window.matchMedia('(max-width: 639px)').matches);

    if (reduced || !hasWebGL()) return;

    const io = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
        // one-way latch: once mounted, keep the scene and just pause its loop
        if (e.isIntersecting) setMount3d(true);
      },
      { rootMargin: '200px 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const detail = useMemo(() => {
    const key = selectedId ?? hoverId;
    if (key) {
      const n = nodeById[key];
      if (!n) return null;
      const nb = neighboursOf(key)
        .map((id) => nodeById[id]?.label)
        .filter(Boolean);
      return {
        kind: 'node' as const,
        title: n.label,
        cat: n.cat,
        body: n.desc,
        list: nb,
        listLabel: 'Connects to',
      };
    }
    if (focusCat) {
      return {
        kind: 'cat' as const,
        title: focusCat,
        cat: focusCat,
        body: categories[focusCat].blurb,
        list: nodes.filter((n) => n.cat === focusCat).map((n) => n.label),
        listLabel: 'In this domain',
      };
    }
    return null;
  }, [selectedId, hoverId, focusCat]);

  return (
    <div className="reveal overflow-clip rounded-2xl border border-rule bg-surface transition-colors duration-500">
      {/* legend / filter */}
      <div className="flex flex-wrap gap-2 border-b border-rule p-4">
        {categoryList.map((c) => {
          const on = focusCat === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFocusCat(on ? null : c);
                setSelectedId(null);
              }}
              aria-pressed={on}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200"
              style={{
                borderColor: on ? 'var(--ink)' : 'var(--rule)',
                background: on ? 'var(--ink)' : 'transparent',
                color: on ? 'var(--paper)' : 'var(--ink-2)',
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: `var(--cat-${c.toLowerCase()})` }}
              />
              {c}
            </button>
          );
        })}
      </div>

      {/* graph */}
      <div
        ref={host}
        className="relative h-[clamp(340px,52vw,540px)] w-full"
        onPointerLeave={() => setHoverId(null)}
      >
        {mount3d && colors ? (
          <StackScene
            colors={colors}
            focusCat={focusCat}
            hoverId={hoverId}
            selectedId={selectedId}
            onHover={setHoverId}
            onSelect={setSelectedId}
            allowOrbit={allowOrbit}
            active={active}
            compact={compact}
          />
        ) : (
          <div className="flex h-full items-center overflow-x-auto overflow-y-hidden p-4">
            {fallback}
          </div>
        )}

        {mount3d && (
          <p className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">
            <Cube width={11} height={11} />
            {allowOrbit ? 'Drag to orbit · click a node' : 'Tap a node to name it'}
          </p>
        )}
      </div>

      {/* detail */}
      <div className="min-h-[5.5rem] border-t border-rule p-5 transition-colors duration-300">
        {detail ? (
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: `var(--cat-${detail.cat.toLowerCase()})` }}
              />
              <span className="font-display text-[1.25rem] leading-none text-ink">
                {detail.title}
              </span>
              {detail.kind === 'node' && <span className="eyebrow">{detail.cat}</span>}
            </p>
            <p className="max-w-[70ch] text-meta leading-relaxed text-ink-2">{detail.body}</p>
            {detail.list.length > 0 && (
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="eyebrow">{detail.listLabel}</span>
                <span className="text-meta text-ink-3">{detail.list.join(' · ')}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-meta text-ink-3">
            Pick a domain above, or {allowOrbit ? 'hover' : 'tap'} any node to trace what it
            connects to.
          </p>
        )}
      </div>
    </div>
  );
}
