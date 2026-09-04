# Implementation log

Append-only. Newest entry at the bottom. One entry per meaningful chunk of work:
what changed, what broke, what is now true.

---

## 2026-09-02 — Phase 0: requirements

Reference design supplied at `ref/Personal Portfolio (Remix) (Remix)/` — a
single-file artifact portfolio (Bricolage Grotesque / Instrument Serif / Geist,
2D canvas tech graph, PDF iframe CV, mailto contact form). Read in full, plus
its assets: three portrait crops and the real CV PDF.

Requirements gathered across three rounds of questions → recorded as D-001
through D-008 in [DECISIONS.md](./DECISIONS.md).

**CV text extraction.** The PDF uses subset fonts with custom encodings, so raw
stream inflation returned glyph codes, not text. Solved with `pdfjs-dist`
(`legacy/build/pdf.mjs`), which applies the ToUnicode CMap. All 3 pages
recovered and transcribed into `src/data/resume.ts` and `src/data/projects.ts`.
**Content is from the real CV — not invented.**

---

## 2026-09-02 — Phase 1: scaffold & design system

`create-next-app` refused the directory name (`Personal_Portfolio` — npm
rejects capitals), so it was scaffolded to a temp dir and moved in. Landed on
Next **16.3.4** / React **19.2.8**, newer than the planned 15; same App Router
APIs, React Compiler enabled by default.

Built:

- `src/app/globals.css` — the whole design system. Two palettes, fluid type
  scale, component classes, motion, grain, reduced-motion handling.
- `src/lib/fonts.ts` — Instrument Serif / Geist / JetBrains Mono via `next/font`
  (self-hosted, zero third-party font requests).
- `src/lib/site.ts`, `src/lib/schema.ts` — single source of truth + JSON-LD.
- `src/data/{projects,resume,stack}.ts` — all content, typed.
- `Nav`, `Footer`, `ThemeToggle`, `Monogram`, `RevealProvider`, `JsonLd`,
  `icons`, `home/Hero`, `home/HeroPortrait`.
- Root layout: metadata, viewport, pre-paint theme boot script, skip link.

**Two no-JS bugs caught and fixed before they shipped:**

1. `.reveal` elements started hidden unconditionally — without JS every section
   would have been permanently invisible. Now the hidden state is gated behind
   `[data-reveal-ready]`, set by the boot script (D-009).
2. The hero portrait faded in via WAAPI from `opacity-0`, so the LCP image was
   hidden behind JavaScript. Replaced with a pure-CSS `portrait-settle`
   animation that runs pre-hydration.

---

## 2026-09-02 — Phase 2: project screenshots

Wrote `scripts/capture-shots.mjs` — Playwright driving locally installed Chrome
(`channel: 'chrome'`, no browser download), 1440×900 at 2×, output resized to
1600px wide as AVIF + WebP with a 16px WebP blur placeholder.

**Findings:**

- **`true2fa.com` is down.** It resolves and returns HTTP 200, but serves a bare
  LiteSpeed "Index of /" directory listing — no product. This is the lead
  project. Marked `offline: true`; its card renders a designed mock rather than
  a screenshot of a broken page. **Open question for Prashanna** — see STATUS.
- **First Everest Thrills capture was wrecked by my own script.** The settle
  routine force-set `opacity: 1` on every element with an opacity transition, to
  defeat scroll-reveal libraries. That un-hid the site's mobile menu overlay and
  produced a broken-looking page. Rewritten to be conservative: remove only
  small *floating* furniture (chat bubbles, cookie bars, WhatsApp widget), then
  wait for the page instead of fighting its CSS. Re-captured clean.
- Iframe embeddability verified against live headers, not assumed — table in
  STATUS.md. `everestthrills.com` sends `X-Frame-Options: DENY`.

Result: 3 of 4 real screenshots (orbit-chat, vrit, everest-thrills), all under
75KB AVIF.

**Environment gotchas recorded:** Git Bash rewrites a bare `/` argument into a
Windows path (broke `preview.mjs` until routes were passed differently), and
`sharp` rejects MSYS `/c/...` paths — it needs `C:/...`.

---

## 2026-09-02 — Hero verified

First browser check at 1440×900, light theme. Instrument Serif at `--text-d1`
carries the page. Three fixes applied from the screenshot:

- Lede inherited `line-height: 1.7` from body and read as loose at display size
  → pinned to `1.5`, measure widened 30ch → 34ch.
- `not-italic italic` on the accent word were two competing `font-style`
  utilities → reduced to `italic`.
- Added `src/app/icon.svg` (the 404 in console was the missing favicon).

---

## 2026-09-02 — Docs established

Added `docs/` per request: README (index + maintenance rules), STATUS (rewritten
each session), DECISIONS (append-only ADRs), ARCHITECTURE, DESIGN_SYSTEM,
CONTENT, SEO, and this log. `AGENTS.md` points new sessions at `docs/STATUS.md`
first.

---

## 2026-09-02 — Phase 4: the 3D constellation

`src/components/stack/` — three pieces: `StackGraph` (client shell: legend,
detail panel, intersection-gated lazy load), `StackScene` (the R3F scene,
dynamically imported), `StackGraphSVG` (server-rendered static fallback).

Tuning took several browser passes. What the screenshots caught:

1. **Spheres were roughly 2× too large** and overlapped badly. `NODE_SCALE`
   settled at 0.021 world units per unit of `r`, which puts the largest node at
   about 45px across — the same optical weight as the 2D reference.
2. **Labels sat on top of their nodes.** The offset was a guess derived from
   `r`; it now derives from the node's *actual projected* radius each frame
   (`visibleH = 2 · dist · tan(fov/2)`), so it clears the sphere at any camera
   distance.
3. **Nodes were clipped at the top of the frame.** A bounding-box camera fit is
   wrong when nodes carry a `z` offset — a node pushed toward the camera
   projects larger and further off-centre. Replaced with `fitDistance()`, which
   solves the perspective requirement per node and takes the worst case.
4. **Edge lines cut visible slashes across spheres.** Two causes: centre-to-
   centre lines buried their last stretch inside the node and z-fought with its
   silhouette (fixed by trimming endpoints back to the sphere surface), and
   depth-correct lines legitimately crossed in front of farther nodes. The
   second is technically honest but reads as a scratch on a still frame, so
   edges now render opaque with `depthWrite: false` and a negative
   `renderOrder` — always behind the nodes. Dimming is a colour lerp toward the
   page rather than an opacity change, since they are no longer transparent.
5. **Dark-theme edges were nearly invisible** — `--rule-2` has too little
   contrast on the dark ground. Added a dedicated `--graph-edge` token.
6. **Label collisions** in the desktop/cloud/data cluster. Nudged `builder`,
   `webauthn`, `actions`, `aws`, `docker`, `mongo` and `postgres` apart.

Deliberate constraints:

- **Coarse pointers get no OrbitControls.** One-finger rotate would swallow page
  scroll. Mobile gets the idle drift plus tappable nodes.
- **Labels are DOM, not WebGL.** drei's `<Text>` fetches a font from a CDN by
  default; DOM labels also keep the site's real typefaces and stay crisp at any
  DPI. The frame loop writes only a transform and two CSS custom properties
  (`--g`, `--lo`) per node; React owns the dim multiplier `--m`, and CSS
  multiplies them — so hover never re-renders inside the loop.
- `frameloop` flips to `'never'` when the section scrolls out of view.

---

## 2026-09-02 — Technology logos on the graph nodes

Requested mid-build. Each node now carries its brand mark, with the glyph
filled `var(--paper)` — which inverts correctly for free: a light mark on a dark
node in Paper, a dark mark on a light node in After hours.

`scripts/gen-logos.mjs` extracts only the marks we render from `simple-icons`
into a committed `src/data/logos.ts`. simple-icons ships 3457 icons; importing
it at runtime would either bloat the bundle or depend on tree-shaking that is
easy to break. It stays a devDependency.

**Three mappings were removed as misleading** rather than shipped:

| Node | Auto-matched | Why rejected |
|---|---|---|
| WebSockets | Socket.io | a protocol, not that library |
| OAuth | Auth0 | a vendor, not the standard |
| AWS S3 | — | Amazon's marks are not in simple-icons |

18 nodes get real brand marks. The remaining 7 (Zustand, Nuqs, WebSockets,
WebAuthn, AWS S3, Cryptography, OAuth) get a letter monogram in the display
serif — consistent with the site's monogram language, and honest about the fact
that protocols and concepts do not have logos.

---

## 2026-09-02 — Phase 5: the CV

`/cv` renders the résumé as real HTML from `src/data/resume.ts` — masthead,
summary, experience, selected projects, education, technical skills,
achievements, soft skills — wrapped in browser-window chrome with an HTML/PDF
switch (`CvWindow`). The PDF iframe mounts only when asked for; mounting it
eagerly would cost a 122KB download and a plugin instantiation on a page most
visitors read as HTML.

The home page gets a *teaser* rather than a copy of the résumé — rendering it
twice would duplicate a page of content across two URLs for no gain.

Added a `@media print` block so `/cv` prints as a clean document: chrome and
grain hidden, forced light palette, `break-inside: avoid` on each role.

The CV summary was transcribed from the real PDF with two corrections noted in
the source: a typo ("Worket" to "Worked") and the employer brought up to date,
since the PDF predates the move to Advice Ninja.

---

## 2026-09-02 — Phase 6: case studies, blog, contact

**Case studies** (`/work/[slug]`): masthead, meta rail (role / organisation /
period / status), the project frame, problem, four numbered approach sections,
a sticky sidebar with what-shipped and the stack, and a next-project link.
Auth Sync's sidebar carries an explicit note that its image is a representation
rather than a screenshot.

**Blog**: `src/lib/blog.ts` reads `content/blog/*.mdx` through `gray-matter`,
computes reading time, and throws at build if a post is missing `title` or
`date` — failing loudly beats shipping a broken card. Posts render through
`next-mdx-remote/rsc` with `remark-gfm`, `rehype-slug`,
`rehype-autolink-headings` and `rehype-pretty-code`. Shiki emits **both** themes
as CSS custom properties, so switching theme needs no re-highlight and no client
JS. Prose styles are hand-rolled in `globals.css` rather than
`@tailwindcss/typography`, so the rhythm matches the rest of the system.

Three posts seeded from real work, drafted in Prashanna's voice and flagged in
STATUS as his to rewrite. Drafts (`draft: true`) are excluded from the index,
the sitemap and RSS, and carry `robots: noindex`.

**Contact**: an inverted palette block — `.section-invert` redefines the tokens
on the wrapper so every child component works unchanged. The values are written
out rather than swapped with `var()` references, because `--paper: var(--ink)`
alongside `--ink: var(--paper)` is a custom-property cycle and CSS discards
both. Web3Forms with a mailto fallback, honeypot, and client validation.

---

## 2026-09-02 — Phase 7: the SEO layer

`sitemap.ts`, `robots.ts`, `manifest.ts`, an `rss.xml` route handler, and
`opengraph-image.tsx` at four levels. OG images use the file convention so they
are **pre-rendered at build** on statically generated routes — no runtime image
service.

Two OG font problems, both caught by looking at the output:

1. Only the display serif was loaded, so satori applied it to everything — the
   mono eyebrow and colophon included. Now both faces load and `fontFamily` is
   set per element, since satori has no fallback chain.
2. The subset was keyed to each card's own title. That was a latent bug: a glyph
   absent from one title would be missing from every other string on that card
   too. Subsetting is now a fixed ASCII+punctuation superset.

Font fetching degrades to satori's default face if the network is unavailable at
build — a plainer card, never a failed build.

---

## 2026-09-02 — Phase 8: measurement and QA

**Desktop 99 / 100 / 100 / 100. Mobile 85–89 / 100 / 100 / 100.**

Getting there took real measurement, not guesswork:

| Finding | Fix | Effect |
|---|---|---|
| `logos.ts` plus the whole static SVG shipped in the initial client bundle, because the client `StackGraph` imported `StackGraphSVG` | pass the server-rendered SVG down as a `fallback` prop (D-016) | Perf 68 to 84, TBT halved |
| `quality={62}` was silently ignored; URLs still read `q=75` | Next 16 needs `images.qualities` in config (D-015) | image 80KB to 30KB |
| An un-throttled MutationObserver ran a full `querySelectorAll` per mutation during hydration | coalesce into one rAF-batched scan | removed the forced-reflow warning |
| `--ink-3` failed WCAG AA in **both** themes (3.1:1 light, 3.6:1 dark) | darkened to #6f6e64 / lightened to #85837a | A11y to 100 |
| Alpha-composited greys in `.section-invert` also failed AA, and a blend's real contrast is not obvious from the value | replaced with solid colours | A11y to 100 |
| The nav home link's `aria-label` overrode its visible text | removed it; visible name plus an sr-only "Home" | A11y to 100 |
| Mobile: 25 labels at 11.5px collided in the graph | labels on-demand below 640px (D-013) | — |
| Mobile: the static SVG's 12px labels rendered at ~3px | min-width plus horizontal scroll (D-014) | — |
| Mobile: the hero crop cut his face off at the bottom edge | taller container, lower focal point | — |
| Mobile: the hero eyebrow wrapped mid-list, leaving a dangling separator | drop the third item below `sm` | — |
| Tapping a node listed "PostgreSQL" twice | two edges were declared in both directions; removed, and `neighboursOf` now dedupes | — |

**A trap worth recording:** running `pnpm build` while `next dev` was still
running produced a server that served unstyled HTML and stale markup, and I
briefly chased phantom contrast failures (#9e9eff on white — the unstyled
default link colour) before realising both processes own `.next`. Kill node
processes matching `next` before building.

`scripts/qa.mjs` covers what screenshots cannot: 11 assertions across
reduced-motion, JavaScript-disabled and dark theme. All passing.

---

## 2026-09-02 — The 3D monogram, built twice

Closing the gap in the plan: the graph had been delivered, the 3D logo mark had
not.

**First attempt — React Three Fiber.** An extruded rounded tile from
`ExtrudeGeometry` with a bevel, plus a plane carrying "PM" drawn to a
`CanvasTexture` in the site's real display serif. Extruding actual letterforms
would have meant shipping a typeface as geometry; a textured front face stays
crisp and the depth people read comes from the bevelled edge anyway.

Two bugs found by looking at it rather than trusting it:

1. It rendered as a flat square. `useThree().pointer` never updates when the
   canvas is `pointer-events: none`, so the lean was always zero — and the idle
   amplitude (±8°) was far too small to make a 0.26-deep extrusion visible at
   72px. Fixed with a window `pointermove` listener and ±25°.
2. Then it looked right — and cost 233KB.

**Measured, and reverted.** Desktop script transfer 162KB → 395KB, TBT 80ms →
350ms, Lighthouse performance 99 → 84. See the table in D-017.

**Second attempt — CSS.** Twelve laminated rounded squares stepped back in Z
inside a `preserve-3d` wrapper, rotated on the compositor via two custom
properties written by one rAF loop. Same visual result, arguably cleaner edges,
**zero** additional bytes and no WebGL context in the hero.

Final: **desktop 100 / 100 / 100 / 100** (LCP 0.8s, TBT 30ms, CLS 0), mobile
82–94 across three runs.

This is the second time in this build that moving work off the client was worth
more than optimising it (the first was D-016, the fallback SVG). Both were found
by measuring, not by reasoning about it.

---

## 2026-09-02 — Clearing the lint, and a theme refactor worth having

`pnpm lint` reported 9 errors and 9 warnings. Most were React Compiler rules
that arrived with eslint-config-next 16, and two of the fixes made the code
genuinely better rather than merely quiet.

**`src/lib/theme-store.ts` (new).** The theme lives on `<html data-theme>`,
written pre-paint by the boot script — which makes it *external* state as far
as React is concerned. Both `ThemeToggle` and `useThemeColors` were copying it
into `useState` inside an effect. They now read it through
`useSyncExternalStore` with a shared module-scope subscriber.

This is not just rule-compliance. Every subscriber now stays in sync when the
attribute changes regardless of which component changed it, the server snapshot
is explicitly `null` so nothing renders a guessed theme during hydration, and
`useThemeColors` derives its sampled palette with `useMemo` off the theme
string. Verified end-to-end: toggling light → dark flips the palette, persists
to storage, updates the button's `aria-label`, and re-samples the live WebGL
scene without unmounting it or logging an error.

**`Nav.tsx`.** Two changes:
- Dropped `setActive(null)` from the scroll-spy effect — `isActive()` already
  gates on `isHome`, so the reset was redundant.
- Replaced the `useEffect(() => setOpen(false), [pathname])` sheet-close with a
  render-time reset (`if (openedAt !== pathname) { … }`), the pattern React
  documents for resetting state when a value changes. Nav links already close
  the sheet on click; this only has to cover browser back/forward.

**`eslint.config.mjs`.** Two scoped changes rather than blanket suppression:
- `ref/**` is ignored. It is the supplied third-party design artifact, not our
  source, and linting it produced eight warnings about someone else's code.
- `react-hooks/immutability` and `preserve-manual-memoization` are disabled for
  **exactly the two files that drive a frame loop**. The rule flags
  `cam.position.z = …`, `group.rotation.y = …` and `el.style.x = …` as "this
  value cannot be modified". For React state that is correct; for three.js
  objects and DOM nodes mutated per frame it is not — that is the entire React
  Three Fiber model, and routing it through state would re-render 60 times a
  second. Scoping keeps the rule protecting everything else.

Also removed an unused `site` import from the case-study route.

**Final:** `pnpm lint` clean, `pnpm typecheck` clean, `pnpm qa` 11/11,
**desktop 100 / 100 / 100 / 100** (LCP 0.8s, TBT 10ms, CLS 0), mobile 82–94.
