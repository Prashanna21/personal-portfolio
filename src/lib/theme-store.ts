'use client';

/**
 * The theme lives on `<html data-theme>`, written pre-paint by the boot script
 * in the root layout. That makes it *external* state as far as React is
 * concerned, so components read it through `useSyncExternalStore` rather than
 * copying it into `useState` inside an effect.
 *
 * Besides satisfying the compiler's set-state-in-effect rule, this is simply
 * more correct: every subscriber stays in sync when the attribute changes, no
 * matter which component changed it, and the server snapshot is explicitly
 * `null` so nothing renders a guessed theme during hydration.
 */

export type Theme = 'light' | 'dark';

/** Module scope so the reference is stable across renders. */
export function subscribeToTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
}

export function getThemeSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** No theme is known on the server — callers render a neutral state. */
export function getThemeServerSnapshot(): null {
  return null;
}

export function setTheme(next: Theme) {
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem('pm-theme', next);
  } catch {
    // private mode / storage disabled — the attribute still applies for this page
  }
}
