import type { Metadata, Viewport } from 'next';
import { fontVars } from '@/lib/fonts';
import { site, abs } from '@/lib/site';
import { personSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { RevealProvider } from '@/components/RevealProvider';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'Prashanna Maharjan',
    'full-stack engineer',
    'Electron.js developer',
    'Next.js developer',
    'React developer Nepal',
    'end-to-end encryption',
    'software engineer Kathmandu',
  ],
  alternates: { canonical: '/', types: { 'application/rss+xml': abs('/rss.xml') } },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0a' },
  ],
  colorScheme: 'light dark',
};

/**
 * Runs before first paint: resolves the theme from storage or system preference
 * and stamps it on <html>, so there is never a flash of the wrong palette.
 * Also arms the reveal system only when JS is available — without this, a no-JS
 * visitor would get permanently invisible sections.
 */
const BOOT = `(function(){try{var s=localStorage.getItem('pm-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='light'||s==='dark'?s:(d?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}document.documentElement.setAttribute('data-reveal-ready','');})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <link rel="alternate" type="application/rss+xml" title={`${site.name} — Writing`} href="/rss.xml" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <JsonLd data={[personSchema(), websiteSchema()]} />
        <RevealProvider />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
