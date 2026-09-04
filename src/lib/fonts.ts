import { Instrument_Serif, Geist, JetBrains_Mono } from 'next/font/google';

/**
 * Three voices, no more:
 *   display — Instrument Serif, only ever large and tight
 *   sans    — Geist, everything you actually read
 *   mono    — JetBrains Mono, numerals / eyebrows / metadata
 *
 * All self-hosted by next/font (zero third-party font requests, no FOUT).
 */

export const display = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  // keeps the fallback metric-matched so swapping in causes no reflow
  adjustFontFallback: true,
});

export const sans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

/**
 * Not preloaded. Mono is only used for 11px eyebrows, dates and chips, and its
 * variable file was ~35KB competing with the hero portrait (the LCP element)
 * on the critical path. Deferring it costs a barely-perceptible swap on small
 * labels and takes real weight off first paint.
 */
export const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
