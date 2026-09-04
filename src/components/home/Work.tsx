import Link from 'next/link';
import { projects, experiments } from '@/data/projects';
import { ProjectFrame } from '@/components/ProjectFrame';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowRight, ArrowUpRight } from '@/components/icons';

export function Work() {
  return (
    <section id="work" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeader
        index="02"
        eyebrow="Selected work"
        title={<>Things I&rsquo;ve shipped.</>}
        aside={
          <>
            Four production products — desktop, SaaS, and high-traffic marketing sites. Each one
            shipped to real users. Follow any of them into a full write-up.
          </>
        }
      />

      <div className="mt-16 flex flex-col gap-20 md:gap-28">
        {projects.map((p, i) => {
          const mediaRight = i % 2 === 1;
          return (
            <article
              key={p.slug}
              className="reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              {/* DOM order is heading-first for reading order and a11y; the
                  visual alternation is CSS-only. */}
              <div className={mediaRight ? 'lg:order-1' : 'lg:order-2'}>
                {/* `01/04` rather than a bare `01`, so the project counter
                    cannot be mistaken for the section spine's chapter mark. */}
                <p className="flex items-center gap-3">
                  <span className="section-mark">
                    {p.index}
                    <span className="text-ink-3">/{String(projects.length).padStart(2, '0')}</span>
                  </span>
                  <span className="h-px w-4 bg-rule-2" />
                  <span className="eyebrow">{p.kicker.join(' · ')}</span>
                </p>

                <h3 className="mt-4 font-display text-d3 leading-[1.04]">
                  <Link
                    href={`/work/${p.slug}`}
                    className="text-ink no-underline transition-colors hover:text-accent"
                  >
                    {p.title} <span className="text-ink-3">—</span> {p.lede}
                  </Link>
                </h3>

                <p className="mt-4 max-w-[46ch] leading-[1.7] text-ink-2">{p.summary}</p>

                <dl className="mt-6 flex flex-col gap-3.5">
                  {p.facts.map((f) => (
                    <div key={f.label} className="flex gap-4">
                      {/* 6.5rem fits the longest label ("Architected") at 11px
                          mono with 0.16em tracking without colliding. */}
                      <dt className="eyebrow eyebrow-accent w-[6.5rem] shrink-0 pt-[3px] leading-tight">
                        {f.label}
                      </dt>
                      <dd className="m-0 max-w-[52ch] text-[0.90625rem] leading-[1.65] text-ink-2">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
                  {p.chips.map((c) => (
                    <li key={c} className="chip">
                      {c}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link
                    href={`/work/${p.slug}`}
                    className="link-wipe inline-flex items-center gap-2 text-[0.875rem] font-medium text-ink"
                  >
                    Read the case study
                    <ArrowRight width={13} height={13} />
                  </Link>

                  {p.href && !p.offline && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-wipe inline-flex items-center gap-1.5 text-[0.875rem] text-ink-2"
                    >
                      {p.hrefLabel}
                      <ArrowUpRight width={12} height={12} className="opacity-60" />
                    </a>
                  )}
                </div>
              </div>

              <div className={mediaRight ? 'lg:order-2' : 'lg:order-1'}>
                <ProjectFrame project={p} priority={i === 0} />
              </div>
            </article>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      <div className="reveal mt-24">
        <p className="flex items-center gap-2.5 border-b border-rule pb-4">
          <span className="eyebrow">Also building &amp; experimenting</span>
        </p>
        <ul className="mt-6 grid list-none grid-cols-1 gap-px overflow-clip rounded-xl border border-rule bg-rule p-0 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((e) => {
            const Wrapper = e.href ? 'a' : 'div';
            return (
              <li key={e.title} className="bg-paper">
                <Wrapper
                  {...(e.href ? { href: e.href, target: '_blank', rel: 'noreferrer' } : {})}
                  className={`group flex h-full flex-col bg-surface p-6 no-underline transition-colors duration-300 ${
                    e.href ? 'hover:bg-accent-wash' : ''
                  }`}
                >
                  <span className="eyebrow eyebrow-accent">{e.kicker}</span>
                  <span className="mt-3.5 flex items-start justify-between gap-3 font-display text-[1.3125rem] leading-tight text-ink">
                    {e.title}
                    {e.href && (
                      <ArrowUpRight
                        width={13}
                        height={13}
                        className="mt-1.5 shrink-0 text-ink-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    )}
                  </span>
                  <span className="mt-2.5 text-meta leading-[1.6] text-ink-2">{e.body}</span>
                </Wrapper>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
