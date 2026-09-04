/**
 * The CV summary, transcribed from the real PDF with two corrections: a typo
 * ("Worket" -> "Worked") and the employer brought up to date, since the PDF
 * predates the move to Advice Ninja.
 */
export const summary =
  'Self-taught full-stack engineer with hands-on experience across React, Next.js, ' +
  'Electron.js, React Native, TypeScript and cryptography, plus React Hook Form, Zod, ' +
  'Zustand, TanStack Query and Nuqs. Worked at Vrit Technologies contributing to multiple ' +
  'SEO-optimized, SSR-based products; now building secure, scalable SaaS at Advice Ninja. ' +
  'As IT Head of TEDx Baneshwor and a Microsoft Learn Student Ambassador I have led teams ' +
  'and organized workshops, with strong problem-solving and collaboration skills.';

export const address = 'Jarankhu, Balaju';

export type Role = {
  title: string;
  org: string;
  orgNote?: string;
  period: string;
  current?: boolean;
  /** Weighted roles get the accent dot on the timeline. */
  primary?: boolean;
  points: string[];
};

export const roles: Role[] = [
  {
    title: 'Full-Stack Engineer',
    org: 'Advice Ninja',
    orgNote: 'Australian-based product company',
    period: 'Feb 2026 — Present',
    current: true,
    primary: true,
    points: [
      'Leading development of SaaS products including an Authenticator App and a CMS serving 3+ affiliated companies, implementing secure authentication (JWT, 2FA) and scalable full-stack features.',
      'Working across Next.js, PostgreSQL, TanStack Query & Table, Nuqs, AWS S3 and Zod validation to build performant APIs, manage data and ship production-ready deployments — with a focus on clean architecture and efficient state management.',
    ],
  },
  {
    title: 'Frontend & Electron.js Engineer',
    org: 'Vrit Technologies',
    orgNote: 'Auth Sync · Orbit Chat · Everest Thrills · company site & CRM',
    period: 'Jul 2025 — Jan 2026',
    primary: true,
    points: [
      'Contributed across the product line: the Vrit Tech website and CRM, the Orbit Chat landing site and SaaS CRM, Auth Sync, and the Everest Thrills client site.',
      'Went deep on cryptography and end-to-end encryption, OAuth and JWT authentication, Electron desktop architecture, and SEO-first SSR.',
      'Owned CI/CD pipelines through GitHub Actions and API integration via Next.js fetch and Axios, applying Next.js performance and SEO best practices throughout.',
    ],
  },
  {
    // Split so the rendered "{title} · {org}" does not read
    // "Microsoft Learn Student Ambassador · Microsoft"
    title: 'Student Ambassador',
    org: 'Microsoft Learn',
    period: 'Jan 2025 — Present',
    current: true,
    points: [
      'Organized a Git and GitHub workshop for 80+ participants, teaching version control and collaborative development.',
      'Helped grow the Microsoft Learn community by engaging students and fostering a hands-on learning environment.',
    ],
  },
  {
    title: 'IT Head',
    org: 'TEDx Baneshwor',
    period: 'Aug 2024 — Feb 2025',
    points: [
      'Led a team of developers to build the official tedxbaneshwor.com website and drove the event’s technical setup.',
      'Built the site on Next.js, ShadCN, React and TypeScript with Git and GitHub for collaboration, keeping performance and SEO in scope from the start.',
    ],
  },
  {
    title: 'IT Head',
    org: 'Career Carnival',
    period: 'Jun 2024 — Sep 2024',
    points: [
      'Led a team to organize Career Carnival for 1000+ participants, managing marketing, content and social media.',
      'Ran a web development workshop as part of the programme.',
    ],
  },
];

export const education = [
  {
    qualification: 'BSc (Hons) Computer Science',
    institution: 'Taylor’s University — IIMS College',
    period: 'Sep 2024 — Present',
    note: null as string | null,
  },
  {
    qualification: '+2 Computer Science',
    institution: 'Kathmandu Model College',
    period: 'Aug 2022 — Aug 2024',
    note: 'GPA 3.62',
  },
  {
    qualification: 'SEE',
    institution: 'Siddhartha Vanasthali Institute',
    period: 'Apr 2010 — Apr 2022',
    note: 'GPA 3.44',
  },
];

export const achievements = [
  'Winner — Saral Sikshya Intercollege Hackathon',
  '3rd place — UTC Intercollege Idea Pitching Competition',
  '“Most Creative Video” — Kathmandu Model College competition',
  '1M+ views — essayinnepali.blogspot.com',
];

export const skillGroups = [
  {
    group: 'Languages & core',
    items: ['JavaScript', 'TypeScript', 'React.js', 'Node.js'],
  },
  {
    group: 'Frameworks',
    items: ['Next.js', 'Electron.js', 'React Native', 'Express.js'],
  },
  {
    group: 'Data & state',
    items: ['PostgreSQL', 'MongoDB', 'TanStack Query', 'Zustand', 'Redux', 'Zod'],
  },
  {
    group: 'Security',
    items: ['Cryptography & E2E encryption', 'AES-256-GCM', 'JWT & 2FA', 'OAuth', 'WebAuthn'],
  },
  {
    group: 'Platform',
    items: ['CI/CD', 'Docker', 'GitHub Actions', 'AWS S3', 'Git & GitHub'],
  },
];

export const softSkills = [
  'Leadership and teamwork',
  'Communication and coordination',
  'Adaptability',
  'Time management',
  'Event management and organization',
];

export const stats = [
  { value: '1M+', label: 'readers reached through SEO-led content' },
  { value: '4', label: 'production products shipped end-to-end' },
  { value: '1080+', label: 'students reached across workshops & events' },
];
