# Design system

**Direction: "engineering dossier."** The site is a printed technical brief —
numbered chapters, hairline rules, mono metadata, generous negative space — and
it breaks that restraint exactly once, at the 3D constellation. Everything else
is quiet on purpose so that moment lands.

All of it lives in `src/app/globals.css`. There is no second stylesheet.

## Colour

Never hardcode a hex value in a component. Use the token; it flips with theme.

| Token | Paper (light) | After hours (dark) | Use |
|---|---|---|---|
| `--paper` | `#fafaf8` | `#0c0c0a` | page ground |
| `--paper-2` | `#f1f0ea` | `#121210` | recessed band (Experience) |
| `--surface` | `#ffffff` | `#171714` | raised card |
| `--ink` | `#12120f` | `#f5f3ec` | primary text |
| `--ink-2` | `#57564e` | `#9e9c91` | body / secondary |
| `--ink-3` | `#8e8d83` | `#6c6a61` | metadata / tertiary |
| `--rule` | `#e4e2da` | `#26251f` | hairline |
| `--rule-2` | `#cfcdc2` | `#38362e` | emphasised hairline |
| `--accent` | `#1f3a5f` | `#8fb4e0` | numerals, mono labels, links |

Dark is **not** an inversion — the paper→ink relationship is rebuilt and stays
warm. Tailwind utilities exist for all of these (`bg-paper`, `text-ink-2`,
`border-rule`, …) via `@theme inline`.

**Accent discipline:** one accent, used sparingly. Section numbers, mono
eyebrows, links, the italic word in the hero. Never a large accent fill.

## Type

| Role | Face | Where |
|---|---|---|
| Display | Instrument Serif 400 (+ italic) | `h1`–`h3`, pull quotes, big numerals |
| Body | Geist | everything you read |
| Data | JetBrains Mono | section numbers, eyebrows, dates, chips, coordinates |

Scale — all fluid, all in `@theme`:

```
--text-d1    clamp(3.25rem, 8.6vw, 7rem)     hero name only
--text-d2    clamp(2.25rem, 5.2vw, 4rem)     section headings
--text-d3    clamp(1.75rem, 3.2vw, 2.75rem)  project titles
--text-d4    clamp(1.375rem, 2vw, 1.75rem)   sub-headings
--text-lede  clamp(1.0625rem, 1.1vw, 1.3125rem)
--text-body  0.96875rem (15.5px)
--text-meta  0.8125rem  (13px)
--text-label 0.6875rem  (11px)  mono, uppercase, 0.16em tracking
```

Rules: headings are `letter-spacing: -0.03em`, `line-height: 0.98`,
`text-wrap: balance`. Body is `line-height: 1.7` — **but ledes get `1.5`**, since
1.7 at display size reads as loose. Paragraphs use `text-wrap: pretty`.

## Component classes

`.container-page` · `.eyebrow` (+ `.eyebrow-accent`) · `.chip` · `.link-wipe`
(underline wipes in on hover) · `.link-lift` · `.btn` + `.btn-primary` /
`.btn-ghost` · `.section-mark` · `.prose-lede` · `.hairline` · `.tabular`

## Motion

Restrained and precise — motion you feel rather than notice.

- **One easing curve:** `--ease-brand: cubic-bezier(.2,.8,.2,1)`. Durations
  180 / 280 / 420 / 640ms. Nothing invents its own.
- **Transform and opacity only.** No animating layout properties.
- **Hero entrance is pure CSS** (`.rise`, `.mask-line`, staggered by
  `animation-delay`) so it runs before hydration.
- **Scroll reveals** come from one shared `IntersectionObserver` in
  `RevealProvider`, which unobserves each element after it fires. Add `.reveal`
  and optionally `data-reveal-delay="90"`.
- **The hidden state is gated behind `[data-reveal-ready]`** so no-JS visitors
  see content rather than blank sections. Do not remove this gate.
- `prefers-reduced-motion` is honoured **completely** — all animation and
  transition durations collapse, reveals render visible, hover lifts are off.

## Texture

A single fixed SVG grain overlay on `body::after` at 3.2% (light) / 5.5% (dark).
Fixed position + static background = painted once, free on scroll. No
`mix-blend-mode` — it is expensive on mobile and the effect does not need it.

## Non-negotiables

1. No hardcoded colours in components.
2. No second easing curve.
3. Nothing that hides content behind JavaScript.
4. Mobile layout first — build 375px, then widen.
5. Every interactive element has a visible `:focus-visible` ring.
