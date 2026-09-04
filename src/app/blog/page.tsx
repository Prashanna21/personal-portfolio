import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, getTags, formatDate } from '@/lib/blog';
import { site, abs } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { PostList, type PostCard } from '@/components/blog/PostList';

const description =
  'Notes on cryptography, Electron desktop architecture, real-time systems, SEO and shipping software — from Prashanna Maharjan, a full-stack engineer in Kathmandu.';

export const metadata: Metadata = {
  title: 'Writing',
  description,
  alternates: { canonical: '/blog', types: { 'application/rss+xml': abs('/rss.xml') } },
  openGraph: {
    type: 'website',
    url: abs('/blog'),
    title: `Writing · ${site.name}`,
    description,
  },
  twitter: { card: 'summary_large_image', title: `Writing · ${site.name}`, description },
};

export default function BlogIndex() {
  const posts = getPosts();
  const tags = getTags();

  const cards: PostCard[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    dateLabel: formatDate(p.date),
    tags: p.tags,
    readingMinutes: p.readingMinutes,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/blog' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': abs('/blog#blog'),
            name: `Writing · ${site.name}`,
            description,
            url: abs('/blog'),
            author: { '@id': abs('/#person') },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: abs(`/blog/${p.slug}`),
              datePublished: p.date,
            })),
          },
        ]}
      />

      <div className="container-page pb-24 pt-28 md:pt-32">
        <div className="reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-rule pb-7">
          <div className="max-w-[44ch]">
            <p className="flex items-center gap-2.5">
              <Link href="/" className="eyebrow link-lift">
                Home
              </Link>
              <span className="h-px w-4 bg-rule-2" />
              <span className="eyebrow eyebrow-accent">Writing</span>
            </p>
            <h1 className="mt-5 font-display text-d2">Notes from the build.</h1>
          </div>
          <p className="max-w-[36ch] text-meta leading-relaxed text-ink-2">
            Longer pieces on the things I&rsquo;ve had to work out properly — encryption, desktop
            architecture, real-time systems, and getting found in search.{' '}
            <Link href="/rss.xml" className="link-lift text-ink">
              RSS
            </Link>
            .
          </p>
        </div>

        {cards.length ? (
          <PostList posts={cards} tags={tags} />
        ) : (
          <p className="py-24 text-center text-meta text-ink-3">
            No posts published yet — the first one is in progress.
          </p>
        )}
      </div>
    </>
  );
}
