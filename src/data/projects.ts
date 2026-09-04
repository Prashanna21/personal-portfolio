export type Fact = { label: string; value: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  lede: string;
  kicker: string[];
  period: string;
  org: string;
  role: string;
  summary: string;
  facts: Fact[];
  chips: string[];
  href: string | null;
  hrefLabel: string | null;
  /** Site allows being framed — verified against X-Frame-Options / CSP. */
  embeddable: boolean;
  /** Domain resolves but serves no site right now. */
  offline?: boolean;
  /** Screenshot in /public/work, or null to render the designed mock instead. */
  shot: string | null;
  shotCaption: string;
  shotAlt: string;
  caseStudy: {
    problem: string;
    approach: { heading: string; body: string }[];
    shipped: string[];
    stack: { group: string; items: string[] }[];
  };
};

export const projects: Project[] = [
  {
    slug: 'auth-sync',
    index: '01',
    title: 'Auth Sync',
    lede: 'Cross-platform authenticator',
    kicker: ['Electron.js', 'React', 'Cryptography'],
    period: 'Jul 2025 — Jan 2026',
    org: 'Vrit Technologies',
    role: 'Lead — research & implementation',
    summary:
      'A desktop SaaS for secure TOTP and vault sharing with full client-side end-to-end encryption — nothing leaves the device unencrypted.',
    facts: [
      {
        label: 'Built',
        value:
          'AES-256-GCM & RSA-SHA cryptography, WebSocket real-time sync, OS-level auth (WebAuthn, Windows Hello), and signed multi-OS installers for Windows, Linux & macOS.',
      },
      {
        label: 'Shipped',
        value:
          'Auto-update CI/CD via Electron Builder, S3 & GitHub Actions, with code signing on Windows and macOS.',
      },
    ],
    chips: ['Electron.js', 'React', 'AES-256-GCM', 'WebAuthn', 'WebSockets', 'GitHub Actions'],
    href: 'https://true2fa.com/',
    hrefLabel: 'true2fa.com',
    embeddable: false,
    offline: true,
    shot: null,
    shotCaption: 'Auth Sync — desktop app',
    shotAlt:
      'Representation of the Auth Sync desktop authenticator showing rotating TOTP codes and an encrypted vault',
    caseStudy: {
      problem:
        'Team password managers ask you to trust the server. For an authenticator holding TOTP seeds and a shared vault, that trade is unacceptable — a breach of the backend should reveal nothing. The brief was a cross-platform desktop app where secrets are encrypted and decrypted only on the device, while still supporting real-time sync and sharing between people.',
      approach: [
        {
          heading: 'Encryption that never leaves the client',
          body: 'Vault contents and TOTP seeds are sealed with AES-256-GCM on the device, with RSA-SHA handling key exchange for shared entries. The server stores and relays ciphertext it cannot read — sharing a vault means re-wrapping a key for the recipient, never handing plaintext to the backend.',
        },
        {
          heading: 'Real-time sync over WebSockets',
          body: 'Devices hold a persistent socket so a vault change or a new shared entry lands everywhere immediately. Because the payloads are already ciphertext, the sync layer stays a dumb, fast pipe — no server-side decryption step in the hot path.',
        },
        {
          heading: 'Authentication at the OS layer',
          body: 'Unlocking uses WebAuthn and Windows Hello rather than a re-typed master password, so the platform keychain and biometrics guard the local key material. This keeps the security boundary at the operating system, where it belongs on desktop.',
        },
        {
          heading: 'Release engineering as a first-class concern',
          body: 'Electron Builder produces installers for Windows, Linux and macOS, code-signed on Windows and macOS. GitHub Actions builds and publishes each release to S3, and the app auto-updates from there — so a crypto fix reaches users without asking them to re-download anything.',
        },
      ],
      shipped: [
        'Cross-platform desktop authenticator for Windows, Linux and macOS',
        'Client-side end-to-end encryption — AES-256-GCM and RSA-SHA',
        'Secure TOTP generation and encrypted vault sharing between users',
        'Real-time device sync over WebSockets',
        'OS-level unlock via WebAuthn and Windows Hello',
        'Signed installers with auto-update through Electron Builder, S3 and GitHub Actions',
      ],
      stack: [
        { group: 'Desktop', items: ['Electron.js', 'Electron Builder', 'WebAuthn'] },
        { group: 'Interface', items: ['React', 'TypeScript'] },
        { group: 'Security', items: ['AES-256-GCM', 'RSA-SHA', 'TOTP', 'JWT'] },
        { group: 'Platform', items: ['Node.js', 'WebSockets', 'AWS S3', 'GitHub Actions'] },
      ],
    },
  },
  {
    slug: 'orbit-chat',
    index: '02',
    title: 'Orbit Chat',
    lede: 'AI chatbot CRM & landing site',
    kicker: ['Next.js', 'React', 'Real-time'],
    period: 'Jul 2025 — Jan 2026',
    org: 'Vrit Technologies',
    role: 'Frontend engineer — site & CRM',
    summary:
      'An embeddable AI chatbot SaaS. I built both the SEO-optimized landing page and the real-time, data-heavy CRM behind it — unified inboxes, bot training and assignment workflows.',
    facts: [
      {
        label: 'Built',
        value:
          'WebSocket-based real-time messaging and inbox updates feeding high-throughput dashboards, on an SSR Next.js frontend.',
      },
      {
        label: 'Scaled',
        value:
          'A clean, component-driven React CRM with shadcn/ui, Zustand, Zod, Nuqs and TanStack Query & Table.',
      },
    ],
    chips: ['Next.js', 'WebSockets', 'Zustand', 'TanStack', 'Zod', 'shadcn/ui'],
    href: 'https://orbitchat.ai/',
    hrefLabel: 'orbitchat.ai',
    embeddable: true,
    shot: 'orbit-chat',
    shotCaption: 'orbitchat.ai — landing page',
    shotAlt: 'The Orbit Chat marketing site showing its AI customer-support chat product',
    caseStudy: {
      problem:
        'Orbit Chat needed two very different frontends at once: a marketing site that had to rank and convert, and a support console where agents live all day. One is a static-first SEO problem, the other is a real-time, data-dense application problem. Both had to ship from the same codebase and design language.',
      approach: [
        {
          heading: 'A landing page built for search',
          body: 'Server-rendered Next.js with proper metadata, Open Graph and structured data, so the marketing surface is fully crawlable and fast on first paint rather than a client-rendered shell that search engines have to work to read.',
        },
        {
          heading: 'Real-time inbox over WebSockets',
          body: 'Incoming messages and inbox state arrive on a socket instead of being polled. The console reflects a new customer message the moment it lands — which is the difference between a support tool people trust and one they refresh.',
        },
        {
          heading: 'State split by what it actually is',
          body: 'Server state lives in TanStack Query with its own caching and invalidation; ephemeral UI state lives in Zustand; and filter, tab and pagination state lives in the URL via Nuqs, so any view an agent is looking at is a link they can send to a colleague.',
        },
        {
          heading: 'Data-dense UI that stays fast',
          body: 'TanStack Table drives the high-throughput dashboards, shadcn/ui keeps the component layer consistent, and Zod validates every form and payload boundary so bad data fails loudly at the edge rather than quietly in a reducer.',
        },
      ],
      shipped: [
        'SEO-optimized, server-rendered marketing site',
        'Real-time unified inbox powered by WebSockets',
        'Bot training and user assignment workflows',
        'High-throughput dashboards on TanStack Table',
        'URL-synced filter and view state via Nuqs',
        'Schema-validated forms with Zod and React Hook Form',
      ],
      stack: [
        { group: 'Framework', items: ['Next.js', 'React', 'TypeScript'] },
        { group: 'State', items: ['TanStack Query', 'TanStack Table', 'Zustand', 'Nuqs', 'Zod'] },
        { group: 'Interface', items: ['shadcn/ui', 'Tailwind CSS'] },
        { group: 'Real-time', items: ['WebSockets'] },
      ],
    },
  },
  {
    slug: 'vrit',
    index: '03',
    title: 'Vrit Technologies',
    lede: 'Company site & production CRM',
    kicker: ['Next.js', 'TypeScript', 'CRM'],
    period: 'Jul 2025 — Jan 2026',
    org: 'Vrit Technologies',
    role: 'Co-lead — redesign & CRM',
    summary:
      'A full redesign of the company website alongside a production-grade internal CRM, both on Next.js with SSR, TypeScript and a component-driven architecture built to be extended.',
    facts: [
      {
        label: 'Built',
        value:
          'Real-time updates and notifications over WebSockets, with rich text editing, schema-validated forms and data tables.',
      },
      {
        label: 'Architected',
        value:
          'A scalable component system on Framer Motion, Zustand, Zod, React Hook Form, shadcn/ui, Editor.js and TanStack Query & Table, released through GitHub Actions.',
      },
    ],
    chips: ['Next.js', 'TypeScript', 'Editor.js', 'Framer Motion', 'TanStack', 'CI/CD'],
    href: 'https://vrittechnologies.com/',
    hrefLabel: 'vrittechnologies.com',
    embeddable: true,
    shot: 'vrit',
    shotCaption: 'vrittechnologies.com',
    shotAlt: 'The redesigned Vrit Technologies company website',
    caseStudy: {
      problem:
        'The company site was the front door and the CRM was where the work happened, and neither could be treated as a throwaway. The redesign had to hold up as a studio’s calling card, while the CRM had to be genuinely production-grade — something the team would still be extending a year later without fighting it.',
      approach: [
        {
          heading: 'One component architecture, two products',
          body: 'Both surfaces were built component-driven on Next.js with SSR and TypeScript, sharing conventions rather than copy-pasted code. New CRM screens compose existing primitives instead of introducing a fourth way to render a table.',
        },
        {
          heading: 'Motion with a purpose',
          body: 'Framer Motion carries the marketing site’s personality — transitions that guide attention rather than decorate. The CRM stays deliberately still by comparison, because software people use for eight hours a day should not perform.',
        },
        {
          heading: 'Rich content editing in-house',
          body: 'Editor.js provides structured, block-based content editing, so content lives as data rather than as a blob of HTML — which keeps it renderable, queryable and safe.',
        },
        {
          heading: 'Shipped continuously',
          body: 'GitHub Actions pipelines handle build and deploy for both surfaces, making releases routine rather than an event.',
        },
      ],
      shipped: [
        'Full company website redesign on Next.js with SSR',
        'Production-grade internal CRM with a component-driven architecture',
        'Real-time updates and notifications over WebSockets',
        'Block-based rich text editing with Editor.js',
        'Data tables and server-state caching via TanStack Query & Table',
        'CI/CD pipelines through GitHub Actions',
      ],
      stack: [
        { group: 'Framework', items: ['Next.js', 'React', 'TypeScript'] },
        { group: 'State', items: ['TanStack Query', 'TanStack Table', 'Zustand', 'Nuqs', 'Zod'] },
        { group: 'Interface', items: ['shadcn/ui', 'Framer Motion', 'Editor.js'] },
        { group: 'Platform', items: ['WebSockets', 'GitHub Actions'] },
      ],
    },
  },
  {
    slug: 'everest-thrills',
    index: '04',
    title: 'Everest Thrills',
    lede: 'SEO-first rebuild',
    kicker: ['Next.js', 'SEO', 'Performance'],
    period: 'Jul 2025 — Jan 2026',
    org: 'Client — via Vrit Technologies',
    role: 'Engineer — rebuild & SEO',
    summary:
      'A client website rebuilt on an SEO-first, server-rendered Next.js architecture, focused on organic growth, performance and content discoverability.',
    facts: [
      {
        label: 'Built',
        value:
          'SSR data fetching, generateStaticParams, JSON-LD structured data, Open Graph metadata, dynamic sitemap generation and image optimization.',
      },
      {
        label: 'Improved',
        value:
          'Largest Contentful Paint, following Next.js SEO and performance best practices throughout.',
      },
    ],
    chips: ['Next.js', 'SSR', 'JSON-LD', 'Core Web Vitals', 'Open Graph'],
    href: 'https://everestthrills.com/',
    hrefLabel: 'everestthrills.com',
    embeddable: false,
    shot: 'everest-thrills',
    shotCaption: 'everestthrills.com',
    shotAlt: 'The Everest Thrills trekking company website with a Himalayan hero image',
    caseStudy: {
      problem:
        'A trekking company lives or dies by organic search — people plan an Everest trek by searching for it, not by remembering a brand. The existing site was not built to be found. The rebuild had to make every trip, region and guide page a fast, crawlable, structurally-described document.',
      approach: [
        {
          heading: 'Render on the server, by default',
          body: 'Content is fetched and rendered server-side with static params generated for known routes, so crawlers and first-time visitors both receive real HTML instead of waiting on client-side hydration to see a trip description.',
        },
        {
          heading: 'Describe the content, not just display it',
          body: 'JSON-LD structured data and Open Graph metadata let search engines and social platforms understand what each page actually is, which is what earns the richer result treatments that drive clicks.',
        },
        {
          heading: 'A sitemap that maintains itself',
          body: 'Sitemap generation is dynamic rather than hand-maintained, so new trips and articles are discoverable the moment they exist — the failure mode of a stale hand-written sitemap simply cannot happen.',
        },
        {
          heading: 'Weight is a ranking factor',
          body: 'Image optimization and targeted LCP work brought the largest paint down on image-heavy landscape pages, where the hero photography is both the point of the page and the main thing slowing it down.',
        },
      ],
      shipped: [
        'Server-rendered Next.js rebuild with static generation for known routes',
        'JSON-LD structured data across content types',
        'Open Graph metadata for social distribution',
        'Dynamic sitemap generation',
        'Image optimization and measurable LCP improvement',
      ],
      stack: [
        { group: 'Framework', items: ['Next.js', 'React', 'TypeScript'] },
        { group: 'SEO', items: ['JSON-LD', 'Open Graph', 'Dynamic sitemap', 'SSR'] },
        { group: 'Performance', items: ['Image optimization', 'Core Web Vitals'] },
      ],
    },
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Smaller experiments — shown as a grid under the four main case studies. */
export const experiments = [
  {
    title: 'Krishi Mitra',
    kicker: 'MERN · AI · Hackathon',
    href: 'https://team-genesis-krishi-mitra.vercel.app/',
    body: 'Farmer ecosystem with AI crop-disease detection from images, price prediction, crop recommendation and a rental/consultation marketplace. Flask APIs serve trained models; i18n carries Nepali translation.',
  },
  {
    title: 'Essay in Nepali',
    kicker: 'Content · SEO',
    href: 'https://essayinnepali.blogspot.com/',
    body: 'A Nepali essay blog ranked through SEO past a million views — where the whole engineering path actually started.',
  },
  {
    title: 'Doggo-pedia',
    kicker: 'React · Appwrite',
    href: 'https://doggo-pedia.vercel.app/',
    body: 'A full-stack dog wikipedia built on Appwrite, as an experiment in how far backend-as-a-service can carry a project.',
  },
  {
    title: 'NEPSE Discord Bot',
    kicker: 'Python · Puppeteer',
    href: null,
    body: 'Scrapes the Nepal Stock Exchange with BeautifulSoup and Puppeteer, then serves live market data into Discord on request.',
  },
  {
    title: 'WebShooter',
    kicker: 'JavaScript · API',
    href: 'https://webshooter.netlify.app/',
    body: 'A lightweight JavaScript and API utility, built to see how much is possible with no framework at all.',
  },
  {
    title: 'MERN Blog Platform',
    kicker: 'MERN · Clerk',
    href: null,
    body: 'Full-stack blog with Clerk authentication, ImageKit optimization, infinite scroll via TanStack Query, and live commenting on Express and MongoDB.',
  },
] as const;
