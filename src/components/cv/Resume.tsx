import { site } from '@/lib/site';
import {
  achievements,
  address,
  education,
  roles,
  skillGroups,
  softSkills,
  summary,
} from '@/data/resume';
import { projects } from '@/data/projects';

/**
 * The résumé as real HTML — indexable, ATS-readable, theme-aware and printable.
 * This is the canonical version; the PDF is what people download. See D-006.
 */

function Head({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="eyebrow mb-5 mt-11 border-b border-rule pb-2.5 !font-semibold first:mt-0">
      {children}
    </h2>
  );
}

export function Resume() {
  return (
    <article className="cv-doc px-6 py-9 sm:px-10 sm:py-12">
      {/* masthead */}
      <header className="border-b border-rule pb-7">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-none">
          {site.name}
        </h1>
        <p className="eyebrow eyebrow-accent mt-3.5 !text-[0.75rem]">Full-Stack &amp; Electron.js Engineer</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-ink-2">
          <span>{address}</span>
          <span className="text-rule-2">/</span>
          <a href={`mailto:${site.email}`} className="link-lift">
            {site.email}
          </a>
          <span className="text-rule-2">/</span>
          <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link-lift">
            {site.phone}
          </a>
          <span className="text-rule-2">/</span>
          <a href={site.socials.github} target="_blank" rel="noreferrer" className="link-lift">
            github.com/prashanna21
          </a>
          <span className="text-rule-2">/</span>
          <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="link-lift">
            LinkedIn
          </a>
        </p>
      </header>

      <Head>Summary</Head>
      <p className="max-w-[78ch] leading-[1.75] text-ink-2">{summary}</p>

      <Head>Experience</Head>
      <div className="flex flex-col gap-8">
        {roles.map((r) => (
          <section key={`${r.org}-${r.title}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-[1.375rem] leading-tight text-ink">
                {r.title} <span className="text-ink-3">·</span>{' '}
                <span className="text-accent">{r.org}</span>
              </h3>
              <span className="eyebrow tabular">{r.period}</span>
            </div>
            {r.orgNote && <p className="mt-1 text-meta text-ink-3">{r.orgNote}</p>}
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {r.points.map((pt, i) => (
                <li key={i} className="flex max-w-[80ch] gap-3 text-[0.9375rem] leading-[1.7] text-ink-2">
                  <span aria-hidden className="mt-[0.72em] h-px w-2.5 shrink-0 bg-rule-2" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Head>Selected projects</Head>
      <div className="flex flex-col gap-6">
        {projects.map((p) => (
          <section key={p.slug}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-[1.25rem] leading-tight text-ink">
                {p.title} <span className="text-ink-3">—</span> {p.lede}
              </h3>
              {p.href && !p.offline && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-lift font-mono text-[10.5px] text-ink-3"
                >
                  {p.hrefLabel}
                </a>
              )}
            </div>
            <p className="mt-2 max-w-[80ch] text-[0.9375rem] leading-[1.7] text-ink-2">
              {p.summary}
            </p>
            <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
              {p.chips.join(' · ')}
            </p>
          </section>
        ))}
      </div>

      <Head>Education</Head>
      <ul className="flex list-none flex-col gap-4 p-0">
        {education.map((e) => (
          <li key={e.institution} className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span>
              <span className="block font-medium text-ink">{e.qualification}</span>
              <span className="block text-meta text-ink-2">{e.institution}</span>
            </span>
            <span className="eyebrow tabular">
              {e.period}
              {e.note && ` · ${e.note}`}
            </span>
          </li>
        ))}
      </ul>

      <Head>Technical skills</Head>
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {skillGroups.map((g) => (
          <div key={g.group}>
            <dt className="eyebrow eyebrow-accent">{g.group}</dt>
            <dd className="m-0 mt-2 text-[0.9375rem] leading-[1.65] text-ink-2">
              {g.items.join(' · ')}
            </dd>
          </div>
        ))}
      </dl>

      <Head>Achievements</Head>
      <ul className="flex list-none flex-col gap-2 p-0">
        {achievements.map((a) => (
          <li key={a} className="flex gap-3 text-[0.9375rem] leading-[1.65] text-ink-2">
            <span aria-hidden className="mt-[0.7em] h-px w-2.5 shrink-0 bg-accent" />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      <Head>Soft skills</Head>
      <p className="text-[0.9375rem] leading-[1.65] text-ink-2">{softSkills.join(' · ')}</p>
    </article>
  );
}
