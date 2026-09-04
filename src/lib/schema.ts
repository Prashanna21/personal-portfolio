import { site, abs } from './site';
import { roles, education } from '@/data/resume';
import type { Project } from '@/data/projects';

const PERSON_ID = abs('/#person');

export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.name,
  givenName: 'Prashanna',
  familyName: 'Maharjan',
  url: site.url,
  email: `mailto:${site.email}`,
  image: abs('/img/portrait.jpg'),
  jobTitle: site.role,
  description: site.description,
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  worksFor: { '@type': 'Organization', name: site.employer },
  alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
  hasOccupation: roles.map((r) => ({
    '@type': 'Role',
    roleName: r.title,
    startDate: r.period.split('—')[0].trim(),
  })),
  knowsAbout: [
    'React',
    'Next.js',
    'Electron.js',
    'React Native',
    'TypeScript',
    'Node.js',
    'End-to-end encryption',
    'Cryptography',
    'WebSockets',
    'PostgreSQL',
    'Search engine optimization',
  ],
  sameAs: [site.socials.github, site.socials.linkedin, site.socials.instagram],
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: site.url,
  name: `${site.name} — Portfolio`,
  description: site.description,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
});

export const projectSchema = (p: Project) => ({
  '@context': 'https://schema.org',
  '@type': p.slug === 'auth-sync' ? 'SoftwareApplication' : 'WebSite',
  name: `${p.title} — ${p.lede}`,
  description: p.summary,
  url: p.href ?? abs(`/work/${p.slug}`),
  ...(p.slug === 'auth-sync'
    ? { applicationCategory: 'SecurityApplication', operatingSystem: 'Windows, macOS, Linux' }
    : {}),
  author: { '@id': PERSON_ID },
});

export const articleSchema = (post: {
  title: string;
  description: string;
  date: string;
  updated?: string;
  slug: string;
  tags: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.updated ?? post.date,
  url: abs(`/blog/${post.slug}`),
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/blog/${post.slug}`) },
  keywords: post.tags.join(', '),
  image: abs(`/blog/${post.slug}/opengraph-image`),
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en',
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});
