'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { categoryList } from '@/data/stack';
import { getThemeServerSnapshot, getThemeSnapshot, subscribeToTheme } from '@/lib/theme-store';

const KEYS = [
  '--ink',
  '--ink-2',
  '--ink-3',
  '--rule',
  '--rule-2',
  '--paper',
  '--accent',
  '--graph-edge',
] as const;

export type ThemeColors = Record<string, string> & { theme: 'light' | 'dark' };

const read = (theme: 'light' | 'dark'): ThemeColors => {
  const cs = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (const k of KEYS) out[k] = cs.getPropertyValue(k).trim();
  for (const c of categoryList) {
    out[c] = cs.getPropertyValue(`--cat-${c.toLowerCase()}`).trim();
  }
  return { ...out, theme } as ThemeColors;
};

/**
 * WebGL cannot read CSS custom properties, so the scene samples them from
 * computed style instead of duplicating the palette in JavaScript. Re-samples
 * whenever `data-theme` flips, which keeps the 3D scene and the SVG fallback
 * from drifting apart.
 *
 * The theme itself is read via `useSyncExternalStore` — it lives on the
 * document element, not in React — and the sampled palette is derived from it.
 * Returns `null` until hydration so no caller renders a guessed palette.
 */
export function useThemeColors() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
  return useMemo(() => (theme ? read(theme) : null), [theme]);
}
