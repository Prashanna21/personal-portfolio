'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight } from '@/components/icons';

export type PostCard = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  tags: string[];
  readingMinutes: number;
};

/**
 * Client-side tag filtering. Every post is present in the server-rendered
 * HTML — filtering only hides rows — so nothing here is hidden from crawlers.
 */
export function PostList({
  posts,
  tags,
}: {
  posts: PostCard[];
  tags: { tag: string; count: number }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(
    () => (active ? posts.filter((p) => p.tags.includes(active)) : posts),
    [posts, active],
  );

  return (
    <>
      {tags.length > 0 && (
        <div className="reveal mt-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200"
            style={{
              borderColor: active === null ? 'var(--ink)' : 'var(--rule)',
              background: active === null ? 'var(--ink)' : 'transparent',
              color: active === null ? 'var(--paper)' : 'var(--ink-2)',
            }}
          >
            All · {posts.length}
          </button>
          {tags.map(({ tag, count }) => {
            const on = active === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActive(on ? null : tag)}
                aria-pressed={on}
                className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-200"
                style={{
                  borderColor: on ? 'var(--ink)' : 'var(--rule)',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? 'var(--paper)' : 'var(--ink-2)',
                }}
              >
                {tag} · {count}
              </button>
            );
          })}
        </div>
      )}

      <ol className="mt-4 list-none p-0">
        {shown.map((p, i) => (
          <li key={p.slug} className="reveal" data-reveal-delay={String(i * 40)}>
            <Link
              href={`/blog/${p.slug}`}
              className="group grid gap-x-10 gap-y-3 border-b border-rule py-8 no-underline md:grid-cols-[9.5rem_1fr] md:py-10"
            >
              <div className="flex items-baseline gap-2.5 md:flex-col md:gap-2">
                <time dateTime={p.date} className="eyebrow tabular">
                  {p.dateLabel}
                </time>
                <span className="eyebrow">{p.readingMinutes} min read</span>
              </div>

              <div>
                <h2 className="font-display text-d3 leading-[1.06] text-ink transition-colors duration-300 group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-[62ch] leading-[1.7] text-ink-2">{p.description}</p>
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="eyebrow">{p.tags.join(' · ')}</span>
                  <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-2">
                    Read
                    <ArrowRight
                      width={12}
                      height={12}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {shown.length === 0 && (
        <p className="py-16 text-center text-meta text-ink-3">
          Nothing tagged &ldquo;{active}&rdquo; yet.
        </p>
      )}
    </>
  );
}
