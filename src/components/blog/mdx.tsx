import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

/** Internal links route through next/link; external ones open safely. */
function A({ href = '', ...rest }: React.ComponentProps<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} {...rest} />;
  }
  return <a href={href} target="_blank" rel="noreferrer noopener" {...rest} />;
}

const components = { a: A };

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              [
                rehypePrettyCode,
                {
                  // Both themes are emitted as CSS custom properties, so a
                  // theme switch needs no re-highlight at runtime.
                  theme: { light: 'github-light', dark: 'github-dark' },
                  defaultLang: 'ts',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
