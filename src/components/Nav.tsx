'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site } from '@/lib/site';
import { Monogram } from './Monogram';
import { ThemeToggle } from './ThemeToggle';
import { Close, Menu } from './icons';

const SECTION_IDS = ['about', 'work', 'experience', 'stack', 'cv', 'contact'];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Nav gains its ground only once you have left the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy, home only. Observers are cheaper than a scroll handler here.
  useEffect(() => {
    // No need to clear `active` off-home: isActive() already gates on isHome.
    if (!isHome) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.4] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /**
   * Close the sheet when the route changes. Done as a render-time reset — the
   * pattern React documents for "reset state when a value changes" — rather
   * than in an effect, which would set state synchronously after paint and
   * trigger a cascading render.
   *
   * Every nav link also closes the sheet on click; this covers browser
   * back/forward, where no click happens.
   */
  const [openedAt, setOpenedAt] = useState(pathname);
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    if (open) setOpen(false);
  }

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return isHome && active === href.slice(2);
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          backgroundColor: scrolled ? 'color-mix(in srgb, var(--paper) 78%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
        }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          {/* No aria-label: it overrode the visible text and tripped axe's
              label-content-name-mismatch rule. The visible name plus an
              sr-only "Home" gives a correct accessible name at every width —
              the name span is hidden below `sm`. */}
          <Link href="/" className="group flex items-center gap-2.5 text-ink no-underline">
            <Monogram size={30} className="transition-transform duration-500 group-hover:-rotate-6" />
            <span className="hidden text-[13.5px] font-medium tracking-[-0.01em] sm:block">
              {site.name}
            </span>
            <span className="sr-only">Home</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="rounded-lg px-3 py-2 text-[13.5px] no-underline transition-colors duration-200"
                style={{ color: isActive(item.href) ? 'var(--ink)' : 'var(--ink-2)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/#contact"
              className="btn btn-primary hidden !px-4 !py-2.5 !text-[13px] lg:inline-flex"
            >
              Get in touch
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-[9px] border border-rule bg-surface text-ink md:hidden"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className="fixed inset-0 z-[70] md:hidden"
        style={{
          pointerEvents: open ? 'auto' : 'none',
          visibility: open ? 'visible' : 'hidden',
          transition: 'visibility 300ms',
        }}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-paper transition-opacity duration-300"
          style={{ opacity: open ? 1 : 0 }}
        />
        <div className="container-page relative flex h-full flex-col">
          <div className="flex h-16 items-center justify-between">
            <Monogram size={30} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-[9px] border border-rule bg-surface text-ink"
            >
              <Close />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-5 font-display text-[clamp(2rem,9vw,2.75rem)] leading-none text-ink no-underline transition-all duration-500"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateY(12px)',
                  transitionDelay: `${open ? 80 + i * 45 : 0}ms`,
                }}
              >
                <span className="section-mark mr-3 align-middle">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-8 justify-center"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}
