import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/OgCard';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { site } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.name} — ${site.role}`;

const TITLE = 'Secure, real-time products.';
const EYEBROW = 'Full-Stack · Electron.js · React Native';

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow={EYEBROW}
        title={TITLE}
        meta="React · Next.js · Electron · end-to-end encryption"
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
