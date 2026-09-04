import { site } from '@/lib/site';
import { ContactForm } from './ContactForm';
import { ArrowRight, ArrowUpRight, Expand } from '@/components/icons';

const direct = [
  { label: 'GitHub', value: 'prashanna21', href: site.socials.github },
  { label: 'LinkedIn', value: 'Prashanna Maharjan', href: site.socials.linkedin },
  { label: 'Instagram', value: '@maharjan_prashanna', href: site.socials.instagram },
];

export function Contact() {
  return (
    <section id="contact" className="section-invert scroll-mt-24 transition-colors duration-500">
      <div className="container-page py-24 md:py-32">
        <div className="reveal max-w-[52ch]">
          <p className="eyebrow eyebrow-accent">
            Open to opportunities · Currently at {site.employer}
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.94]">
            Let&rsquo;s build something{' '}
            <em className="italic text-accent">meaningful</em>.
          </h2>
          <p className="mt-7 max-w-[44ch] text-lede leading-[1.5] text-ink-2">
            Have a product that needs to be secure, real-time, and genuinely well-built? I&rsquo;d
            love to hear about it.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="mt-9 inline-flex items-center gap-3 border-b-2 border-accent pb-1.5 font-display text-[clamp(1.375rem,3vw,2.125rem)] leading-none text-ink no-underline transition-opacity duration-200 hover:opacity-70"
          >
            {site.email}
            <ArrowRight width={24} height={24} />
          </a>
        </div>

        <div className="reveal mt-16 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <ContactForm />

          <div>
            <p className="eyebrow">Or reach me directly</p>
            <ul className="mt-2 flex list-none flex-col p-0">
              {direct.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-rule py-4 no-underline transition-[padding] duration-200 hover:ps-2.5"
                  >
                    <span>
                      <span className="eyebrow block">{d.label}</span>
                      <span className="mt-1 block text-[0.90625rem] font-medium text-ink">
                        {d.value}
                      </span>
                    </span>
                    <ArrowUpRight width={14} height={14} className="shrink-0 text-ink-3" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/cv"
                  className="group flex items-center justify-between gap-4 border-b border-rule py-4 no-underline transition-[padding] duration-200 hover:ps-2.5"
                >
                  <span>
                    <span className="eyebrow block">Résumé</span>
                    <span className="mt-1 block text-[0.90625rem] font-medium text-ink">
                      Read the full CV
                    </span>
                  </span>
                  <Expand width={14} height={14} className="shrink-0 text-ink-3" />
                </a>
              </li>
            </ul>

            <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-rule px-3.5 py-2">
              <span className="relative grid h-[7px] w-[7px] place-items-center">
                <span className="absolute inset-0 rounded-full bg-[#3fb27f]" />
                <span className="absolute -inset-[3px] animate-ping rounded-full bg-[#3fb27f]/25 [animation-duration:2.4s]" />
              </span>
              <span className="text-meta text-ink-2">Usually replies within ~24h</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
