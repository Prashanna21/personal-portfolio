import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const DIR = path.join(process.cwd(), 'content', 'blog');

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  body: string;
};

const parse = (file: string): Post | null => {
  const slug = file.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);

  if (!data.title || !data.date) {
    // A post without a title or date cannot be rendered or sorted. Failing
    // loudly at build beats shipping a broken card.
    throw new Error(`content/blog/${file}: frontmatter needs both "title" and "date"`);
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ''),
    date: new Date(data.date).toISOString(),
    updated: data.updated ? new Date(data.updated).toISOString() : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    body: content,
  };
};

/** Published posts, newest first. Drafts are excluded everywhere but dev. */
export function getPosts({ includeDrafts = false } = {}): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parse)
    .filter((p): p is Post => Boolean(p))
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string): Post | null {
  return getPosts({ includeDrafts: true }).find((p) => p.slug === slug) ?? null;
}

export function getTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getPosts()) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
