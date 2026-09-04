import Link from 'next/link';
import { site } from '@/lib/site';
import { Monogram } from './Monogram';
import { ArrowUpRight } from './icons';

const links = [
  { label: 'GitHub', href: site.socials.github },
  { label: 'LinkedIn', href: site.socials.linkedin },
  { label: 'Instagram', href: site.socials.instagram },
  { label: 'RSS', href: '/rss.xml' },
];

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram size={30} />
          <div className="leading-snug">
            <div className="text-[13.5px] font-medium text-ink">{site.name}</div>
            <div className="text-meta text-ink-3">{site.role}</div>
          </div>
        </div>

        <nav aria-label="Elsewhere" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className="link-wipe inline-flex items-center gap-1 text-meta text-ink-2 hover:text-ink"
            >
              {l.label}
              {l.href.startsWith('http') && <ArrowUpRight width={11} height={11} className="opacity-50" />}
            </Link>
          ))}
        </nav>

        <p className="eyebrow !tracking-[0.14em]">
          Built in Kathmandu · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
