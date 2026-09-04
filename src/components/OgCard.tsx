import { ACCENT, INK, INK_2, INK_3, MONO, PAPER, RULE, SERIF } from '@/lib/og';
import { site } from '@/lib/site';

/**
 * Shared layout for every generated Open Graph image, so the whole site's
 * social cards read as one set: mono eyebrow, display-serif headline, hairline
 * colophon — the same grammar as the pages themselves.
 *
 * Rendered by satori, which supports only a subset of CSS: flexbox only,
 * explicit `display: flex` on text wrappers, no shorthand backgrounds.
 * `fontFamily` is set per element because satori has no font fallback chain.
 */
export function OgCard({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: PAPER,
        padding: '62px 72px',
        border: `1px solid ${RULE}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 11,
            background: INK,
            color: PAPER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SERIF,
            fontSize: 23,
            marginRight: 20,
          }}
        >
          {site.initials}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: 16,
            letterSpacing: 2.6,
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: SERIF,
            // step down once the headline would wrap past two lines
            fontSize: title.length > 64 ? 66 : title.length > 40 ? 78 : 92,
            lineHeight: 1.04,
            letterSpacing: -2.5,
            color: INK,
          }}
        >
          {title}
        </div>
        {meta && (
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontFamily: MONO,
              fontSize: 19,
              letterSpacing: 0.4,
              color: INK_2,
            }}
          >
            {meta}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${RULE}`,
          paddingTop: 26,
        }}
      >
        <div style={{ display: 'flex', fontFamily: SERIF, fontSize: 25, color: INK }}>
          {site.name} — {site.role}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: MONO,
            fontSize: 16,
            letterSpacing: 1.4,
            color: INK_3,
          }}
        >
          maharjanprashanna.com.np
        </div>
      </div>
    </div>
  );
}
