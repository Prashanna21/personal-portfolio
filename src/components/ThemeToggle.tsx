'use client';

import { useSyncExternalStore } from 'react';
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeToTheme,
} from '@/lib/theme-store';
import { Moon, Sun } from './icons';

export function ThemeToggle({ className = '' }: { className?: string }) {
  // `null` until hydration, so the icon fades in once the real theme is known
  // rather than flashing the wrong one.
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`grid h-9 w-9 place-items-center rounded-[9px] border border-rule bg-surface text-ink transition-[background-color,border-color,color] duration-400 hover:border-rule-2 ${className}`}
    >
      <span className="transition-opacity duration-300" style={{ opacity: theme ? 1 : 0 }}>
        {theme === 'dark' ? <Sun /> : <Moon />}
      </span>
    </button>
  );
}
