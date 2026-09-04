import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/OgCard';
import { getPost, getPosts, formatDate } from '@/lib/blog';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getPosts({ includeDrafts: true }).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? 'Writing';
  const meta = post
    ? `${formatDate(post.date)} · ${post.readingMinutes} min read`
    : undefined;

  return new ImageResponse(<OgCard eyebrow="Writing" title={title} meta={meta} />, {
    ...size,
    fonts: await loadOgFonts(),
  });
}
