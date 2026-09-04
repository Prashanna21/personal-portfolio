import { getPosts } from '@/lib/blog';
import { site, abs } from '@/lib/site';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const dynamic = 'force-static';

export function GET() {
  const posts = getPosts();
  const updated = posts[0] ? new Date(posts[0].updated ?? posts[0].date) : new Date();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/blog/${p.slug}`)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Writing</title>
    <link>${abs('/blog')}</link>
    <description>${esc(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
