import { categories, edges, MONOGRAM, nodeById, nodes } from '@/data/stack';
import { logos, LOGO_VIEWBOX } from '@/data/logos';

const W = 1200;
const H = 560;
const PAD_X = 70;
const PAD_Y = 52;

const px = (x: number) => PAD_X + x * (W - PAD_X * 2);
const py = (y: number) => PAD_Y + y * (H - PAD_Y * 2);

/**
 * The static renderer — and the one that matters for SEO.
 *
 * A WebGL canvas contains no crawlable text, so this SVG is what puts all 25
 * technology names into the HTML as real <text>. It is also what a visitor sees
 * with JavaScript off, WebGL unavailable, or `prefers-reduced-motion` set.
 * Rendered on the server; zero client JS.
 *
 * Glyphs use `var(--paper)` as their fill, which lands correctly in both
 * themes: a light mark on a dark node in Paper, a dark mark on a light node
 * in After hours.
 */
export function StackGraphSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      // A 1200x560 diagram squeezed into ~350px renders its 12px labels at
      // about 3px. Hold a legible minimum width and let the container scroll
      // instead — the text stays in the HTML either way, so SEO is unaffected.
      className={`block h-auto w-full min-w-[700px] ${className}`}
      role="img"
      aria-label="A connected map of the technologies Prashanna Maharjan works with, grouped into frontend, state, backend, desktop, data, cloud and security."
    >
      <g stroke="var(--graph-edge)" strokeWidth="1">
        {edges.map(([a, b]) => {
          const na = nodeById[a];
          const nb = nodeById[b];
          if (!na || !nb) return null;
          return (
            <line key={`${a}-${b}`} x1={px(na.x)} y1={py(na.y)} x2={px(nb.x)} y2={py(nb.y)} />
          );
        })}
      </g>

      {nodes.map((n) => {
        const cx = px(n.x);
        const cy = py(n.y);
        const r = n.r * 0.98;
        const logo = logos[n.id];
        const g = r * 1.08; // glyph box, inscribed in the node
        return (
          <g key={n.id}>
            <circle cx={cx} cy={cy} r={r} fill={`var(--cat-${n.cat.toLowerCase()})`} />

            {logo ? (
              <path
                d={logo.d}
                fill="var(--paper)"
                transform={`translate(${cx - g / 2} ${cy - g / 2}) scale(${g / 24})`}
              />
            ) : (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--paper)"
                style={{ font: `400 ${(r * 1.05).toFixed(1)}px var(--font-display)` }}
              >
                {MONOGRAM[n.id] ?? n.label[0]}
              </text>
            )}

            <text
              x={cx}
              y={cy + r + 16}
              textAnchor="middle"
              fill="var(--ink-2)"
              style={{ font: '500 12px var(--font-sans)' }}
            >
              {n.label}
            </text>
          </g>
        );
      })}

      <desc>
        {Object.entries(categories)
          .map(([name, c]) => `${name}: ${c.blurb}`)
          .join(' ')}
      </desc>
    </svg>
  );
}

// referenced so the viewBox constant stays co-located with the glyph data
export const GLYPH_VIEWBOX = LOGO_VIEWBOX;
