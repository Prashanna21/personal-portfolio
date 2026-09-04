/**
 * One graph, two renderers.
 *
 *  - `x` / `y` are normalised 0..1 and drive the static SVG fallback, which is
 *    real markup with real <text> — so every technology name is indexable and
 *    readable without WebGL.
 *  - `z` lifts each node out of that plane for the R3F scene. Values are
 *    hand-set rather than derived from category, so the constellation reads as
 *    organic depth instead of seven flat sheets.
 */

export type Category = 'Frontend' | 'State' | 'Backend' | 'Desktop' | 'Data' | 'Cloud' | 'Security';

export const categories: Record<Category, { light: string; dark: string; blurb: string }> = {
  Frontend: {
    light: '#1f3a5f',
    dark: '#7fa8da',
    blurb: 'The layer users actually touch — components, routing, rendering strategy.',
  },
  State: {
    light: '#3a6ea5',
    dark: '#93bce8',
    blurb: 'Server state, client state and URL state, each kept in its own place.',
  },
  Backend: {
    light: '#2e7d6b',
    dark: '#6fc0ac',
    blurb: 'APIs, runtimes and the real-time transport underneath them.',
  },
  Desktop: {
    light: '#9a6b2f',
    dark: '#d2a464',
    blurb: 'Cross-platform desktop — packaging, signing, auto-update, OS-level auth.',
  },
  Data: { light: '#7a4f9e', dark: '#b992da', blurb: 'Relational and document stores behind the products.' },
  Cloud: { light: '#b0683a', dark: '#e09a6c', blurb: 'Storage, containers and the pipelines that ship releases.' },
  Security: {
    light: '#b03a4a',
    dark: '#e28089',
    blurb: 'Cryptography, authentication and the parts that must not be guessed at.',
  },
};

export type StackNode = {
  id: string;
  label: string;
  cat: Category;
  x: number;
  y: number;
  z: number;
  r: number;
  desc: string;
};

export const nodes: StackNode[] = [
  // Frontend
  { id: 'react', label: 'React', cat: 'Frontend', x: 0.18, y: 0.30, z: 2.6, r: 22, desc: 'Core UI library — hooks-first, composition-driven.' },
  { id: 'next', label: 'Next.js', cat: 'Frontend', x: 0.30, y: 0.16, z: 3.2, r: 22, desc: 'SSR, routing and SEO — the framework behind most production work.' },
  { id: 'ts', label: 'TypeScript', cat: 'Frontend', x: 0.10, y: 0.50, z: 1.4, r: 18, desc: 'Type safety across every project, front to back.' },
  { id: 'tailwind', label: 'Tailwind', cat: 'Frontend', x: 0.27, y: 0.46, z: 0.9, r: 15, desc: 'Utility-first styling, paired with shadcn/ui.' },
  { id: 'rn', label: 'React Native', cat: 'Frontend', x: 0.16, y: 0.13, z: 2.0, r: 15, desc: 'Cross-platform mobile from the same mental model.' },
  { id: 'framer', label: 'Framer Motion', cat: 'Frontend', x: 0.38, y: 0.34, z: 1.8, r: 14, desc: 'Purposeful animation and micro-interactions.' },

  // State
  { id: 'zustand', label: 'Zustand', cat: 'State', x: 0.46, y: 0.20, z: 0.4, r: 16, desc: 'Lightweight global state — the first thing I reach for.' },
  { id: 'tanstack', label: 'TanStack Query', cat: 'State', x: 0.50, y: 0.40, z: 1.1, r: 17, desc: 'Server state, caching, tables and data-heavy UIs.' },
  { id: 'zod', label: 'Zod', cat: 'State', x: 0.42, y: 0.54, z: -0.3, r: 14, desc: 'Schema validation paired with React Hook Form.' },
  { id: 'nuqs', label: 'Nuqs', cat: 'State', x: 0.56, y: 0.28, z: -0.9, r: 12, desc: 'Type-safe URL state for shareable views.' },
  { id: 'rhf', label: 'React Hook Form', cat: 'State', x: 0.40, y: 0.68, z: 0.2, r: 13, desc: 'Performant, schema-driven forms.' },

  // Backend
  { id: 'node', label: 'Node.js', cat: 'Backend', x: 0.66, y: 0.50, z: -0.6, r: 19, desc: 'The runtime behind my APIs and tooling.' },
  { id: 'express', label: 'Express', cat: 'Backend', x: 0.74, y: 0.62, z: -1.6, r: 15, desc: 'REST APIs for MERN-stack products.' },
  { id: 'ws', label: 'WebSockets', cat: 'Backend', x: 0.62, y: 0.66, z: 0.8, r: 16, desc: 'Real-time messaging, sync and live dashboards.' },

  // Desktop
  { id: 'electron', label: 'Electron.js', cat: 'Desktop', x: 0.70, y: 0.22, z: 2.4, r: 20, desc: 'Cross-platform desktop apps — my specialty.' },
  { id: 'builder', label: 'Electron Builder', cat: 'Desktop', x: 0.755, y: 0.335, z: 1.5, r: 13, desc: 'Signed multi-OS installers and auto-update.' },
  { id: 'webauthn', label: 'WebAuthn', cat: 'Desktop', x: 0.805, y: 0.115, z: 2.9, r: 14, desc: 'OS-level auth — Windows Hello and biometrics.' },

  // Data
  { id: 'mongo', label: 'MongoDB', cat: 'Data', x: 0.875, y: 0.515, z: -2.2, r: 16, desc: 'Document store for MERN products.' },
  { id: 'postgres', label: 'PostgreSQL', cat: 'Data', x: 0.925, y: 0.635, z: -2.8, r: 16, desc: 'Relational backbone for SaaS at Advice Ninja.' },

  // Cloud
  { id: 'aws', label: 'AWS S3', cat: 'Cloud', x: 0.925, y: 0.375, z: -1.2, r: 15, desc: 'Asset storage and release artifacts.' },
  { id: 'actions', label: 'GitHub Actions', cat: 'Cloud', x: 0.935, y: 0.175, z: -0.4, r: 15, desc: 'CI/CD pipelines and release automation.' },
  { id: 'docker', label: 'Docker', cat: 'Cloud', x: 0.79, y: 0.45, z: -1.9, r: 13, desc: 'Containerized, reproducible deploys.' },

  // Security
  { id: 'crypto', label: 'Cryptography', cat: 'Security', x: 0.50, y: 0.80, z: 2.2, r: 20, desc: 'AES-256-GCM and RSA-SHA — end-to-end encryption.' },
  { id: 'jwt', label: 'JWT / 2FA', cat: 'Security', x: 0.38, y: 0.84, z: 1.2, r: 15, desc: 'Secure auth, sessions and two-factor.' },
  { id: 'oauth', label: 'OAuth', cat: 'Security', x: 0.62, y: 0.84, z: 0.6, r: 14, desc: 'Delegated auth and identity flows.' },
];

export const edges: [string, string][] = [
  ['react', 'next'], ['react', 'ts'], ['react', 'tailwind'], ['react', 'rn'], ['react', 'framer'],
  ['next', 'ts'], ['next', 'nuqs'], ['next', 'aws'], ['next', 'actions'],
  ['react', 'zustand'], ['react', 'tanstack'], ['zustand', 'tanstack'], ['tanstack', 'zod'],
  ['zod', 'rhf'], ['rhf', 'react'], ['nuqs', 'tanstack'],
  ['node', 'express'], ['node', 'ws'], ['express', 'mongo'], ['node', 'postgres'],
  ['ws', 'tanstack'], ['ws', 'electron'], ['next', 'node'],
  ['electron', 'builder'], ['electron', 'webauthn'], ['electron', 'react'],
  ['builder', 'actions'], ['builder', 'aws'], ['electron', 'crypto'],
  ['aws', 'actions'], ['actions', 'docker'], ['docker', 'node'],
  ['crypto', 'jwt'], ['crypto', 'oauth'], ['jwt', 'next'], ['oauth', 'next'],
  ['webauthn', 'crypto'], ['jwt', 'node'],
];

export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, StackNode>;

/** Deduped: an edge declared in both directions would otherwise list the
 *  neighbour twice in the detail panel. */
export const neighboursOf = (id: string) => {
  const out = new Set<string>();
  for (const [a, b] of edges) {
    if (a === id) out.add(b);
    else if (b === id) out.add(a);
  }
  return [...out];
};

/** World-space position for the R3F scene. */
export const toWorld = (n: StackNode): [number, number, number] => [
  (n.x - 0.5) * 17,
  -(n.y - 0.5) * 9.2,
  n.z,
];

export const categoryList = Object.keys(categories) as Category[];

/**
 * Nodes with no brand mark in simple-icons get a letter monogram instead —
 * WebSockets, OAuth and cryptography are protocols and concepts, not products,
 * so borrowing a vendor's logo (Socket.io, Auth0) would misrepresent them.
 */
export const MONOGRAM: Record<string, string> = {
  zustand: 'Z',
  nuqs: 'N',
  ws: 'WS',
  webauthn: 'W',
  aws: 'S3',
  crypto: 'C',
  oauth: 'O',
};
