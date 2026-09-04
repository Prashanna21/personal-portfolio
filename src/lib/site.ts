export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://maharjanprashanna.com.np',
  name: 'Prashanna Maharjan',
  initials: 'PM',
  role: 'Full-Stack & Electron.js Engineer',
  tagline: 'Secure, real-time products — React, Next.js, Electron & React Native.',
  description:
    'Full-stack engineer in Kathmandu building secure, real-time products with React, Next.js, Electron and React Native — from client-side end-to-end encryption to production SaaS.',
  locale: 'en_US',
  location: 'Kathmandu, Nepal',
  email: 'prashannamhrzn21@gmail.com',
  phone: '+977 9749320633',
  employer: 'Advice Ninja',
  cv: '/Prashanna-Maharjan-CV.pdf',
  socials: {
    github: 'https://github.com/prashanna21',
    linkedin: 'https://np.linkedin.com/in/prashanna-maharjan-3b974b247',
    instagram: 'https://instagram.com/maharjan_prashanna',
  },
  /** Web3Forms access key — set in .env.local. Form degrades to mailto without it. */
  contactKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
} as const;

export const nav = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Work' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#stack', label: 'Stack' },
  { href: '/blog', label: 'Writing' },
  { href: '/cv', label: 'CV' },
] as const;

export const abs = (path = '') => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
