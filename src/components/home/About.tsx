import { stats } from '@/data/resume';

export function About() {
  return (
    <section id="about" className="container-page scroll-mt-24 py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Sticky chapter opener */}
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-2.5">
            <span className="section-mark">01</span>
            <span className="h-px w-5 bg-rule-2" />
            <span className="eyebrow">About</span>
          </p>
          <h2 className="mt-5 font-display text-d3 leading-[1.02]">
            From a million-view blog to encrypted desktop apps.
          </h2>
          <p className="mt-5 max-w-[34ch] text-ink-2">
            A self-taught engineer from Kathmandu who learned to ship by shipping — and never
            stopped.
          </p>
        </div>

        <div>
          {/* Pull quote — the one place the serif gets to speak in the first person */}
          <blockquote
            className="reveal m-0 border-l border-accent-line pl-6 font-display text-d4 leading-[1.4] text-ink"
            data-reveal-delay="60"
          >
            &ldquo;I care less about the framework of the month and more about whether the thing is{' '}
            <em className="italic text-accent">secure, fast, and actually ships</em> to real
            users.&rdquo;
          </blockquote>

          <div className="reveal mt-9 flex flex-col gap-5 text-[1rem] leading-[1.75] text-ink-2" data-reveal-delay="120">
            <p>
              My path didn&rsquo;t start with a CS degree — it started with writing. A Nepali essay
              blog I built and ranked with SEO crossed{' '}
              <strong className="font-semibold text-ink">1 million+ readers</strong>, and that first
              taste of building something people actually used pulled me into engineering for good.
            </p>
            <p>
              From there I taught myself the MERN stack, then went deep where it mattered:{' '}
              <strong className="font-semibold text-ink">
                cryptography, end-to-end encryption, and real-time systems
              </strong>
              . At Vrit Technologies I built an Electron desktop authenticator with client-side E2E
              encryption and OS-level auth; today at Advice Ninja I&rsquo;m building secure,
              scalable SaaS for an Australian product team.
            </p>
            <p>
              Alongside the code, I&rsquo;ve led people — as IT Head of{' '}
              <strong className="font-semibold text-ink">TEDx Baneshwor</strong> and Career
              Carnival, and as a{' '}
              <strong className="font-semibold text-ink">Microsoft Learn Student Ambassador</strong>{' '}
              running workshops for hundreds of students. I like building teams as much as I like
              building software.
            </p>
          </div>

          {/* Stats — hairline-separated columns, not cards */}
          <dl className="reveal mt-12 grid grid-cols-1 border-t border-rule sm:grid-cols-3" data-reveal-delay="180">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-b border-rule py-6 sm:border-b-0 sm:border-r sm:pr-6 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-6"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="m-0">
                  <span className="block font-display text-[2.75rem] leading-none tracking-[-0.02em] text-ink tabular">
                    {s.value}
                  </span>
                  <span className="mt-2.5 block text-meta leading-snug text-ink-2">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
