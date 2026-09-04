import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts, formatDate } from '@/lib/blog';
import { site, abs } from '@/lib/site';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Mdx } from '@/components/blog/mdx';
import { ArrowRight, ArrowUpRight } from '@/components/icons';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts({ includeDrafts: true }).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    // A draft must never be indexed, even if someone shares the URL.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: 'article',
      url: abs(`/blog/${post.slug}`),
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.url],
      tags: post.tags,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const published = getPosts();
  const i = published.findIndex((p) => p.slug === post.slug);
  const next = i >= 0 ? published[i + 1] : undefined;

  return (
    <>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="container-page pb-24 pt-28 md:pt-32">
        <header className="reveal mx-auto max-w-[68ch]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link href="/blog" className="eyebrow link-lift">
              Writing
            </Link>
            <span className="h-px w-4 bg-rule-2" />
            <time dateTime={post.date} className="eyebrow eyebrow-accent tabular">
              {formatDate(post.date)}
            </time>
            <span className="eyebrow">{post.readingMinutes} min read</span>
            {post.draft && <span className="chip">Draft</span>}
          </p>

          <h1 className="mt-6 font-display text-d2 leading-[0.98]">{post.title}</h1>

          {post.description && (
            <p className="mt-5 text-lede leading-[1.5] text-ink-2">{post.description}</p>
          )}

          <p className="mt-7 flex flex-wrap items-center gap-2 border-t border-rule pt-6">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </p>
        </header>

        <div className="reveal mx-auto mt-12 max-w-[68ch]">
          <Mdx source={post.body} />
        </div>

        {/* sign-off */}
        <footer className="reveal mx-auto mt-16 max-w-[68ch] border-t border-rule pt-8">
          <p className="text-meta leading-relaxed text-ink-2">
            Written by <strong className="font-semibold text-ink">{site.name}</strong> — {site.role}{' '}
            in {site.location}. If any of this is useful to something you&rsquo;re building,{' '}
            <a href={`mailto:${site.email}`} className="link-lift text-ink">
              say hello
            </a>
            .
          </p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="link-wipe inline-flex items-center gap-1.5 text-meta text-ink-2"
            >
              GitHub
              <ArrowUpRight width={11} height={11} className="opacity-50" />
            </a>
            <Link href="/rss.xml" className="link-wipe text-meta text-ink-2">
              RSS
            </Link>
          </p>

          {next && (
            <div className="mt-10 border-t border-rule pt-8">
              <p className="eyebrow">Next up</p>
              <Link
                href={`/blog/${next.slug}`}
                className="group mt-4 flex flex-wrap items-end justify-between gap-5 no-underline"
              >
                <span className="max-w-[46ch] font-display text-d4 leading-tight text-ink transition-colors group-hover:text-accent">
                  {next.title}
                </span>
                <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-2">
                  Read
                  <ArrowRight
                    width={13}
                    height={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </div>
          )}
        </footer>
      </article>
    </>
  );
}
