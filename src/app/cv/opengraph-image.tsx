import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/OgCard';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { site } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${site.name} — curriculum vitae`;

const TITLE = 'Read it. Don’t download it.';

export default async function Image() {
  return new ImageResponse(
    <OgCard eyebrow="Curriculum vitae" title={TITLE} meta="Experience · projects · education · skills" />,
    { ...size, fonts: await loadOgFonts() },
  );
}
