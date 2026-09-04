import Link from 'next/link';
import { site } from '@/lib/site';
import { summary, skillGroups, roles } from '@/data/resume';
import { SectionHeader } from '@/components/SectionHeader';
import { ArrowRight, Doc, Download } from '@/components/icons';

/**
 * A teaser, not a copy. The full résumé lives at /cv — rendering it twice would
 * duplicate a page's worth of content across two URLs for no gain.
 */
export function CvSection() {
  const current = roles[0];

  return (
    <section id="cv" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeader
        index="05"
        eyebrow="The résumé"
        title={<>Read it. Don&rsquo;t download it.</>}
        aside={
          <>
            Rendered as real text rather than an embedded PDF — so it works on a phone, and a search
            engine can actually read it. The original file is still one click away.
          </>
        }
      />

      <div className="reveal mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        {/* document card */}
        <div className="overflow-clip rounded-2xl border border-rule bg-surface transition-colors duration-500">
          <div className="flex items-center gap-3 border-b border-rule bg-[color-mix(in_srgb,var(--ink)_3%,var(--surface))] px-4 py-3">
            <span className="flex gap-[6px]" aria-hidden>
              <span className="h-[10px] w-[10px] rounded-full bg-[#e25b4d]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#e9b949]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#3fb27f]" />
            </span>
            <span className="flex flex-1 items-center justify-center gap-2 text-meta text-ink-2">
              <Doc width={13} height={13} className="opacity-60" />
              Prashanna-Maharjan-CV
            </span>
            <span className="eyebrow hidden sm:block">HTML</span>
          </div>

          <div className="relative px-6 py-8 sm:px-9">
            <p className="font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none">
              {site.name}
            </p>
            <p className="eyebrow eyebrow-accent mt-3">Full-Stack &amp; Electron.js Engineer</p>
            <p className="mt-6 max-w-[68ch] leading-[1.75] text-ink-2">{summary}</p>

            <dl className="mt-7 grid gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-2">
              {skillGroups.slice(0, 4).map((g) => (
                <div key={g.group}>
                  <dt className="eyebrow">{g.group}</dt>
                  <dd className="m-0 mt-1.5 text-meta leading-[1.6] text-ink-2">
                    {g.items.join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>

            {/* the document continues — fade rather than a hard cut */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent" />
          </div>
        </div>

        {/* side rail */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-rule bg-surface p-6 transition-colors duration-500">
            <p className="eyebrow">Currently</p>
            <p className="mt-3 font-display text-[1.375rem] leading-tight text-ink">
              {current.title} <span className="text-ink-3">·</span>{' '}
              <span className="text-accent">{current.org}</span>
            </p>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
              {current.period}
            </p>
            <p className="mt-4 text-meta leading-[1.65] text-ink-2">{current.orgNote}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/cv" className="btn btn-primary justify-center">
              Read the full CV
              <ArrowRight width={14} height={14} />
            </Link>
            <a href={site.cv} download className="btn btn-ghost justify-center">
              <Download width={14} height={14} />
              Download PDF
            </a>
          </div>

          <p className="text-meta leading-[1.6] text-ink-3">
            Experience, projects, education, technical skills and achievements — the complete
            document, formatted for reading rather than for a printer.
          </p>
        </div>
      </div>
    </section>
  );
}
