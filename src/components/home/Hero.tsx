import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowRight, Pin } from '@/components/icons';
import { HeroPortrait } from './HeroPortrait';
import { Monogram3D } from '@/components/monogram/Monogram3D';
import portrait from '@/data/portrait.json';

/**
 * Asymmetric split: the text column stays locked to the 1200px measure while
 * the portrait bleeds to the viewport edge. `--edge` computes the container's
 * inner left edge from the section's own width, so no 100vw / scrollbar drift.
 */
export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-clip"
      style={
        {
          '--edge': 'max(var(--spacing-gutter), calc((100% - 1200px) / 2 + var(--spacing-gutter)))',
        } as React.CSSProperties
      }
    >
      <div className="grid items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,43%)]">
        {/* ---------------------------------------------------------------- */}
        <div
          className="flex flex-col justify-center pb-14 pt-28 pe-gutter lg:min-h-dvh lg:py-32"
          style={{ paddingInlineStart: 'var(--edge)' }}
        >
          {/* Letterhead seal — the document's mark, before its title. */}
          <div className="rise mb-8 hidden lg:block" style={{ animationDelay: '40ms' }}>
            <Monogram3D size={84} />
          </div>

          <p className="rise flex items-center gap-3" style={{ animationDelay: '80ms' }}>
            <span className="h-px w-7 bg-ink" />
            {/* the full string wraps mid-list at 375px, leaving a dangling
                separator — drop the third item on the narrowest screens */}
            <span className="eyebrow eyebrow-accent">
              <span className="sm:hidden">Full-Stack · Electron.js</span>
              <span className="hidden sm:inline">Full-Stack · Electron.js · React Native</span>
            </span>
          </p>

          <h1 className="mask-line mt-7 font-display text-d1 leading-[0.86] tracking-[-0.035em]">
            <span style={{ animationDelay: '160ms' }}>Prashanna</span>
            <span style={{ animationDelay: '260ms' }}>Maharjan</span>
          </h1>

          <p
            className="rise mt-8 max-w-[34ch] text-lede leading-[1.5] text-ink-2"
            style={{ animationDelay: '380ms' }}
          >
            Building secure,{' '}
            <em className="font-display text-[1.18em] italic text-accent">real-time</em> products
            with React, Next.js, Electron &amp; React Native — from end-to-end encryption to
            production SaaS.
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3.5"
            style={{ animationDelay: '460ms' }}
          >
            <Link href="/#work" className="btn btn-primary">
              View selected work
              <ArrowRight width={14} height={14} />
            </Link>
            <Link href="/#contact" className="btn btn-ghost">
              Let&rsquo;s talk
            </Link>
          </div>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ animationDelay: '540ms' }}
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-rule bg-surface px-3.5 py-2">
              <span className="relative grid h-[7px] w-[7px] place-items-center">
                <span className="absolute inset-0 rounded-full bg-[#2e9e6b]" />
                <span className="absolute -inset-[3px] animate-ping rounded-full bg-[#2e9e6b]/25 [animation-duration:2.4s]" />
              </span>
              <span className="text-meta text-ink-2">
                Currently at <strong className="font-semibold text-ink">{site.employer}</strong>
              </span>
            </span>

            <span className="flex gap-5 text-meta">
              {(
                [
                  ['GitHub', site.socials.github],
                  ['LinkedIn', site.socials.linkedin],
                  ['Instagram', site.socials.instagram],
                ] as const
              ).map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-lift text-ink-2 hover:text-ink"
                >
                  {label}
                </a>
              ))}
            </span>
          </div>

          {/* Editorial footer strip — the document's colophon */}
          <div
            className="rise mt-12 hidden items-center gap-5 border-t border-rule pt-5 lg:flex"
            style={{ animationDelay: '640ms' }}
          >
            <span className="eyebrow">27.7172° N · 85.3240° E</span>
            <span className="h-3 w-px bg-rule-2" />
            <span className="eyebrow">Kathmandu, Nepal</span>
            <span className="h-3 w-px bg-rule-2" />
            <span className="eyebrow eyebrow-accent">Open to opportunities</span>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Taller on mobile with a lower focal point: at 62vw the crop cut his
            face off at the bottom edge. */}
        <div className="relative min-h-[82vw] bg-paper-2 sm:min-h-[56vw] lg:min-h-dvh">
          <HeroPortrait>
            <Image
              src="/img/portrait.jpg"
              alt={`${site.name}, ${site.role}, in Kathmandu`}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 43vw"
              quality={62}
              placeholder="blur"
              blurDataURL={portrait.blurDataURL}
              className="object-cover object-[52%_42%] lg:object-[50%_36%]"
            />
          </HeroPortrait>

          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_var(--rule)]" />

          <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-rule bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] px-3 py-1.5 text-[11.5px] backdrop-blur-md">
            <Pin width={12} height={12} className="text-accent" />
            {site.location}
          </span>
        </div>
      </div>
    </section>
  );
}
