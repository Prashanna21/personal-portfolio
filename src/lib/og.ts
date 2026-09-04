/**
 * Font loading for `next/og` image generation.
 *
 * satori needs real font bytes (TTF/OTF/WOFF — not WOFF2), and `next/font`
 * keeps its files inside the build output rather than at a stable path. So the
 * faces are fetched from Google Fonts at build time.
 *
 * No `User-Agent` header is sent on purpose: without a modern UA, Google's CSS
 * API returns a TTF `src` rather than WOFF2, which is what satori can parse.
 *
 * Subsetting is keyed to a fixed ASCII+punctuation superset rather than to each
 * card's own text. Per-card subsetting looked smaller but was a latent bug: a
 * glyph absent from one card's title would then be missing from every other
 * string on that card too, since satori has no other face to fall back to.
 *
 * If the network is unavailable at build time this returns no fonts and the
 * image still renders in satori's default face — a plainer card, never a
 * failed build.
 */

const SUBSET =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`' +
  'abcdefghijklmnopqrstuvwxyz{|}~' +
  '—–·’‘“”…é';

type Face = {
  name: string;
  data: ArrayBuffer;
  style: 'normal';
  weight: 400 | 500;
};

async function fetchFace(family: string, name: string, weight: 400 | 500): Promise<Face | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(SUBSET)}`,
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;

    const data = await fetch(url).then((r) => r.arrayBuffer());
    return { name, data, style: 'normal', weight };
  } catch {
    return null;
  }
}

/** Display serif for headlines, mono for metadata — the site's own pairing. */
export async function loadOgFonts(): Promise<Face[]> {
  const faces = await Promise.all([
    fetchFace('Instrument+Serif', 'Instrument Serif', 400),
    fetchFace('JetBrains+Mono:wght@500', 'JetBrains Mono', 500),
  ]);
  return faces.filter((f): f is Face => f !== null);
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export const PAPER = '#fafaf8';
export const INK = '#12120f';
export const INK_2 = '#57564e';
export const INK_3 = '#8e8d83';
export const RULE = '#e4e2da';
export const ACCENT = '#1f3a5f';

export const SERIF = 'Instrument Serif';
export const MONO = 'JetBrains Mono';
