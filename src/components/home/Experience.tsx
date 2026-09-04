import { roles, education, achievements } from '@/data/resume';
import { SectionHeader } from '@/components/SectionHeader';
import { Trophy } from '@/components/icons';

export function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-24 bg-paper-2 py-24 transition-colors duration-500 md:py-32"
    >
      <div className="container-page">
        <SectionHeader
          index="03"
          eyebrow="Experience"
          title={<>Growth, not job titles.</>}
          aside={
            <>
              A path from community leadership into shipping secure products for international
              teams.
            </>
          }
        />

        {/* Margin-note layout: the period sits in the document's left margin,
            the way a dated entry would in a printed brief. */}
        <ol className="mt-14 list-none p-0">
          {roles.map((r, i) => (
            <li
              key={`${r.org}-${r.title}`}
              className="reveal grid gap-x-10 gap-y-3 border-t border-rule py-8 md:grid-cols-[13rem_1fr] md:py-10"
              data-reveal-delay={String(i * 50)}
            >
              <div className="flex items-baseline gap-2.5 md:flex-col md:items-start md:gap-2">
                <span className={`eyebrow ${r.primary ? 'eyebrow-accent' : ''}`}>{r.period}</span>
                {r.current && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2e9e6b]" />
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">
                      Current
                    </span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display text-[clamp(1.375rem,2.2vw,1.75rem)] leading-tight text-ink">
                  {r.title} <span className="text-ink-3">·</span>{' '}
                  <span className="text-accent">{r.org}</span>
                </h3>
                {r.orgNote && <p className="mt-1.5 text-meta text-ink-3">{r.orgNote}</p>}
                <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
                  {r.points.map((pt, j) => (
                    <li key={j} className="flex max-w-[72ch] gap-3 text-[0.9375rem] leading-[1.7] text-ink-2">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-rule-2" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* ---------------------------------------------------------------- */}
        <div className="reveal mt-16 grid gap-12 border-t border-rule pt-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow">Education</p>
            <ul className="mt-6 flex list-none flex-col gap-5 p-0">
              {education.map((e) => (
                <li key={e.institution}>
                  <p className="text-[0.96875rem] font-semibold leading-snug text-ink">
                    {e.qualification}
                  </p>
                  <p className="mt-1 text-meta text-ink-2">{e.institution}</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">
                    {e.period}
                    {e.note && ` · ${e.note}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Achievements</p>
            <ul className="mt-6 flex list-none flex-col gap-3.5 p-0">
              {achievements.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <Trophy width={14} height={14} className="mt-[3px] shrink-0 text-accent" />
                  <span className="text-[0.90625rem] leading-[1.6] text-ink-2">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
