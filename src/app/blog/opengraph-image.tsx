import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/OgCard';
import { getPosts } from '@/lib/blog';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { site } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `Writing — ${site.name}`;

const TITLE = 'Notes from the build.';

export default async function Image() {
  const n = getPosts().length;
  return new ImageResponse(
    <OgCard
      eyebrow="Writing"
      title={TITLE}
      meta={`${n} ${n === 1 ? 'piece' : 'pieces'} on encryption, desktop & search`}
    />,
    { ...size, fonts: await loadOgFonts() },
  );
}
