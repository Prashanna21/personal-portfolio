import type { Metadata } from 'next';
import Link from 'next/link';
import { site, abs } from '@/lib/site';
import { personSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Resume } from '@/components/cv/Resume';
import { CvWindow } from '@/components/cv/CvWindow';
import { ArrowRight } from '@/components/icons';

const title = 'CV';
const description = `The full résumé of ${site.name} — ${site.role} in Kathmandu. Experience, projects, education, technical skills and achievements, readable in the browser and downloadable as PDF.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/cv' },
  openGraph: {
    type: 'profile',
    url: abs('/cv'),
    title: `${site.name} — CV`,
    description,
  },
  twitter: { card: 'summary_large_image', title: `${site.name} — CV`, description },
};

export default function CvPage() {
  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'CV', path: '/cv' },
          ]),
        ]}
      />

      <div className="container-page pb-24 pt-28 md:pt-32">
        <div className="reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-b border-rule pb-7">
          <div className="max-w-[46ch]">
            <p className="flex items-center gap-2.5">
              <Link href="/" className="eyebrow link-lift">
                Home
              </Link>
              <span className="h-px w-4 bg-rule-2" />
              <span className="eyebrow eyebrow-accent">Curriculum vitae</span>
            </p>
            <h1 className="mt-5 font-display text-d2">Read it. Don&rsquo;t download it.</h1>
          </div>
          <p className="max-w-[36ch] text-meta leading-relaxed text-ink-2">
            The whole story in one document — rendered as real text so it works on any screen and
            can actually be read by a search engine. The original PDF is a click away.
          </p>
        </div>

        <div className="reveal mt-10">
          <CvWindow>
            <Resume />
          </CvWindow>
        </div>

        <p className="reveal mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="/#work" className="link-wipe inline-flex items-center gap-2 font-medium text-ink">
            See the work behind it
            <ArrowRight width={13} height={13} />
          </Link>
          <a href={`mailto:${site.email}`} className="link-wipe text-ink-2">
            {site.email}
          </a>
        </p>
      </div>
    </>
  );
}
