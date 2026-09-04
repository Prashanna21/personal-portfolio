import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { projects } from '@/data/projects';
import { getPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const newestPost = posts[0]?.updated ?? posts[0]?.date;

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${site.url}/cv`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${site.url}/blog`,
      lastModified: newestPost ? new Date(newestPost) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    // Drafts are excluded by getPosts() — an unpublished URL must never be
    // advertised in the sitemap.
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
