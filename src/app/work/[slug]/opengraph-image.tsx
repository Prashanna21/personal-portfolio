import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/OgCard';
import { projects, projectBySlug } from '@/data/projects';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { site } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  const title = p ? `${p.title} — ${p.lede}` : site.name;
  const eyebrow = p ? `Case study · ${p.index}` : 'Work';

  return new ImageResponse(
    <OgCard eyebrow={eyebrow} title={title} meta={p?.kicker.join(' · ')} />,
    { ...size, fonts: await loadOgFonts() },
  );
}
