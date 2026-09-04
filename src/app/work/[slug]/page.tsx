import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, projectBySlug } from '@/data/projects';
import { abs } from '@/lib/site';
import { projectSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { ProjectFrame } from '@/components/ProjectFrame';
import { ArrowRight, ArrowUpRight, Check } from '@/components/icons';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};

  const title = `${p.title} — ${p.lede}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: 'article',
      url: abs(`/work/${p.slug}`),
      title,
      description: p.summary,
    },
    twitter: { card: 'summary_large_image', title, description: p.summary },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <JsonLd
        data={[
          projectSchema(p),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/#work' },
            { name: p.title, path: `/work/${p.slug}` },
          ]),
        ]}
      />

      <article className="container-page pb-24 pt-28 md:pt-32">
        {/* masthead */}
        <header className="reveal max-w-[52ch]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link href="/#work" className="eyebrow link-lift">
              Work
            </Link>
            <span className="h-px w-4 bg-rule-2" />
            <span className="section-mark">
              {p.index}
              <span className="text-ink-3">/{String(projects.length).padStart(2, '0')}</span>
            </span>
            <span className="eyebrow">{p.kicker.join(' · ')}</span>
          </p>

          <h1 className="mt-6 font-display text-d2 leading-[0.96]">
            {p.title} <span className="text-ink-3">—</span> {p.lede}
          </h1>

          <p className="mt-6 text-lede leading-[1.5] text-ink-2">{p.summary}</p>
        </header>

        {/* meta rail */}
        <dl className="reveal mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-rule py-7 sm:grid-cols-4">
          {[
            { k: 'Role', v: p.role },
            { k: 'Organisation', v: p.org },
            { k: 'Period', v: p.period },
            {
              k: 'Status',
              v: p.offline ? 'Not currently live' : p.href ? 'Live' : 'Shipped',
            },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="eyebrow">{k}</dt>
              <dd className="m-0 mt-2 text-meta leading-snug text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="reveal mt-12">
          <ProjectFrame project={p} priority />
        </div>

        {/* body */}
        <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="max-w-[68ch]">
            <section className="reveal">
              <h2 className="eyebrow eyebrow-accent">The problem</h2>
              <p className="mt-4 text-[1.0625rem] leading-[1.75] text-ink-2">
                {p.caseStudy.problem}
              </p>
            </section>

            <section className="reveal mt-14">
              <h2 className="eyebrow eyebrow-accent">The approach</h2>
              <div className="mt-6 flex flex-col gap-10">
                {p.caseStudy.approach.map((a, idx) => (
                  <div key={a.heading} className="border-l border-rule ps-6">
                    <h3 className="flex items-baseline gap-3 font-display text-d4 leading-tight">
                      <span className="section-mark shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {a.heading}
                    </h3>
                    <p className="mt-3 leading-[1.75] text-ink-2">{a.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* sidebar */}
          <aside className="reveal flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
            <section>
              <h2 className="eyebrow border-b border-rule pb-3">What shipped</h2>
              <ul className="mt-4 flex list-none flex-col gap-3 p-0">
                {p.caseStudy.shipped.map((s) => (
                  <li key={s} className="flex gap-3 text-meta leading-[1.6] text-ink-2">
                    <Check width={13} height={13} className="mt-[3px] shrink-0 text-accent" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="eyebrow border-b border-rule pb-3">Stack</h2>
              <div className="mt-4 flex flex-col gap-4">
                {p.caseStudy.stack.map((g) => (
                  <div key={g.group}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                      {g.group}
                    </p>
                    <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
                      {g.items.map((it) => (
                        <li key={it} className="chip">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {p.href && !p.offline && (
              <a href={p.href} target="_blank" rel="noreferrer" className="btn btn-ghost justify-center">
                Visit {p.hrefLabel}
                <ArrowUpRight width={13} height={13} />
              </a>
            )}
            {p.offline && (
              <p className="rounded-xl border border-rule bg-surface p-4 text-meta leading-relaxed text-ink-3">
                This product is a desktop application and its site is not currently serving — so the
                image above is a representation of the interface rather than a screenshot.
              </p>
            )}
          </aside>
        </div>

        {/* next */}
        <nav className="reveal mt-24 border-t border-rule pt-8" aria-label="More work">
          <p className="eyebrow">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            className="group mt-4 flex flex-wrap items-end justify-between gap-6 no-underline"
          >
            <span className="font-display text-d3 leading-tight text-ink transition-colors group-hover:text-accent">
              {next.title} <span className="text-ink-3">—</span> {next.lede}
            </span>
            <span className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-ink-2">
              Read on
              <ArrowRight
                width={14}
                height={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </nav>
      </article>
    </>
  );
}
