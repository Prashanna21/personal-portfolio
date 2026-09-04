# Decisions

Append-only. Each entry records what was chosen, what lost, and why. To reverse
one, add a new entry that supersedes it — never edit history in place.

---

## D-001 — Next.js App Router over Astro / SPA / static HTML
**2026-09-02 · user decision**

Chose Next.js (scaffolded at 16.3.4). Astro would have a marginally higher raw
Lighthouse ceiling; a Vite SPA was rejected outright for weak SEO; single static
HTML cannot support a real blog.

Next wins on: Metadata API, `generateStaticParams`, file-convention `sitemap.ts`
/ `robots.ts` / `opengraph-image.tsx`, `next/image`, `next/font` self-hosting,
and it matches the stack Prashanna actually works in.

---

## D-002 — Editorial serif-led typography
**2026-09-02 · user decision**

**Instrument Serif** display · **Geist** body · **JetBrains Mono** metadata.

Beat: keeping the reference trio (Bricolage Grotesque + Instrument Serif +
Geist), a Swiss/technical direction (Schibsted Grotesk), and a high-contrast
Fraunces pairing.

Rationale: the serif connects to the blog-writer origin story, mono labels read
as "engineer" without shouting, and the pairing avoids the grotesque-display
look that reads as templated. Design direction is **"engineering dossier"** — a
numbered technical document with hairline rules and mono metadata, broken
exactly once by the 3D constellation.

---

## D-003 — Scrolling home + real routes for work and writing
**2026-09-02 · user decision**

Home keeps the reference's uninterrupted single-page scroll. On top of that,
each project gets `/work/[slug]`, writing gets `/blog` + `/blog/[slug]`, and the
résumé gets `/cv`.

Rejected: home + blog only (four products would only ever get a paragraph each),
and a fully multi-page site (loses the scroll narrative that makes the reference
work).

This is the single biggest SEO lever available — it turns one indexable page
into roughly 4 + N + 1.

---

## D-004 — Screenshot-first project cards with opt-in live preview
**2026-09-02 · user decision**

Cards show an optimized static screenshot inside browser chrome. A "Live
preview" control swaps in a real iframe **only for sites verified to allow
framing**; the rest get "Open site ↗".

Rejected always-live iframes: `everestthrills.com` sends `X-Frame-Options:
DENY` and would render as a permanent grey box, third-party cookies are blocked
in Safari/Firefox, and four embedded sites is a real Lighthouse cost.

Embeddability is stored per project as `embeddable` in `src/data/projects.ts`
and was verified against live response headers, not assumed.

---

## D-005 — 3D constellation + 3D monogram, both lazy, both with fallbacks
**2026-09-02 · user decision**

React Three Fiber (~150KB gz) is loaded **only on intersection**, never on
initial load. Two guarantees:

- The stack graph's fallback is a **real static SVG with live `<text>` labels**,
  so every technology name stays indexable and readable with no WebGL, no JS, or
  `prefers-reduced-motion`. The fallback is the SEO-bearing version.
- The hero monogram renders flat first and upgrades after LCP settles, so WebGL
  never competes for the largest paint.

Rejected: faux-3D CSS only (guaranteed 100 Lighthouse but least impressive), and
eager loading (would have blown the JS budget).

---

## D-006 — HTML résumé as the canonical CV, PDF as a toggle
**2026-09-02 · user decision**

`/cv` renders the résumé as real, styled, indexable HTML with `Person`
structured data. "View original PDF" loads the actual file on demand; Download
always serves the real PDF.

Rejected keeping the reference's PDF `<iframe>`: mobile browsers render PDF
embeds badly or refuse them, Google indexes none of that text, and it costs load
performance. The résumé is the highest-intent page on a portfolio — it should
not be an image of a document.

Consequence: `src/data/resume.ts` and `public/Prashanna-Maharjan-CV.pdf` can
drift. Content was extracted from the real PDF via `pdfjs-dist`, not retyped.

---

## D-007 — Web3Forms for contact, degrading to mailto
**2026-09-02 · user decision**

No backend, no server cost, one public access key. Honeypot + client-side
validation. When `NEXT_PUBLIC_WEB3FORMS_KEY` is empty the form falls back to
`mailto:` rather than silently failing.

Rejected: a Next route handler + Resend (needs an account, a verified sending
domain, and forfeits pure-static deployability), and mailto-only (mobile and
webmail users frequently have no mail client configured — messages get lost).

---

## D-008 — Canonical domain `https://maharjanprashanna.com.np`
**2026-09-02 · user decision**

Wired through `NEXT_PUBLIC_SITE_URL` with the real domain as the default in
`src/lib/site.ts`, so canonicals, OG tags, sitemap and JSON-LD all derive from
one place and a domain change is a one-line edit.

---

## D-009 — Reveal animations arm only when JS confirms it can un-hide them
**2026-09-02 · technical**

The hidden state of `.reveal` is gated behind `[data-reveal-ready]`, an
attribute set by the pre-paint boot script. Without JS the attribute is never
set, so content renders fully visible instead of being permanently invisible —
the standard failure mode of scroll-reveal implementations.

Same principle applied to the hero portrait: its 1.06 → 1.00 settle is a **CSS**
animation, not WAAPI, so it runs pre-hydration and cannot hide the LCP image
behind JavaScript that may never arrive.

---

## D-010 — Theme resolved pre-paint by an inline boot script
**2026-09-02 · technical**

An inline script in `<head>` reads `localStorage` then `prefers-color-scheme`
and stamps `data-theme` on `<html>` before first paint, so there is no flash of
the wrong palette. CSS additionally carries a `prefers-color-scheme` fallback
under `:root:not([data-theme='light'])` for the no-JS case.

Components style from CSS variables rather than `dark:` utilities, so a theme
flip is a token swap and the two palettes cannot drift apart.

---

## D-011 — Brand logos generated into the repo, not imported at runtime
**2026-09-02 · technical, following a mid-build request for logos**

`scripts/gen-logos.mjs` extracts only the ~18 marks the graph renders from
`simple-icons` into a committed `src/data/logos.ts`. simple-icons ships 3457
icons; importing it at runtime would either bloat the bundle or depend on
tree-shaking that is easy to break silently. It stays a devDependency.

Glyphs are filled `var(--paper)`, which inverts correctly for free: a light mark
on a dark node in Paper, a dark mark on a light node in After hours.

**Three auto-matched mappings were rejected as misleading** rather than shipped:
WebSockets → Socket.io (a protocol, not that library), OAuth → Auth0 (a vendor,
not the standard), AWS S3 → no mark exists in simple-icons. Those seven nodes
get a letter monogram in the display serif instead — honest about the fact that
protocols and concepts do not have logos.

---

## D-012 — Graph edges always render behind nodes
**2026-09-02 · technical**

Edges draw opaque with `depthWrite: false` and a negative `renderOrder`, so
nodes always cover them. Depth-correct lines are more honest — a node behind a
link really should be crossed by it — but on a still frame it reads as a scratch
through the sphere. Depth is already carried by node size, shading, label fade
and the idle drift.

Because the lines are no longer transparent, "dimming" an unfocused edge is a
colour lerp toward the page rather than an opacity change.

---

## D-013 — Node labels are on-demand on narrow screens
**2026-09-02 · technical**

Below 640px the 3D graph shows brand glyphs only; labels appear for a node and
its neighbours once tapped, or for a filtered domain. 25 labels at 11.5px
collide badly once the graph is scaled to ~390px.

The glyphs carry recognition and the detail panel names whatever is selected, so
nothing is lost — verified by tapping a node and reading the panel back.

---

## D-014 — The static graph holds a legible minimum width and scrolls
**2026-09-02 · technical**

`StackGraphSVG` is `min-w-[700px]` inside a horizontally scrollable container. A
1200×560 diagram squeezed into ~350px renders its 12px labels at about 3px —
illegible, and this is the *only* graph a no-WebGL or reduced-motion visitor
sees. Its text is in the HTML either way, so SEO is unaffected by the choice.

---

## D-015 — LCP budget spent on the hero portrait
**2026-09-02 · technical**

The portrait is the LCP element and stays that way. It is served AVIF-first at
`quality={62}` (30KB at 828px, down from 80KB), `priority`, with an explicit
`sizes` and a blur placeholder.

Mobile LCP settles at ~3.5s under Lighthouse's slow-4G throttle. A full-bleed
photographic hero cannot be much faster on a 1.6 Mbps simulated connection, and
removing it would cost the design its strongest moment. Desktop LCP is 0.8s.

Two implementation notes worth keeping:

- **Next 16 only honours qualities listed in `images.qualities`.** An unlisted
  `quality` prop is silently ignored and the request falls back to 75 — the
  first attempt at this changed nothing and the URL still read `q=75`.
- **JetBrains Mono is not preloaded** (`preload: false`). It renders only 11px
  eyebrows and chips, and its variable file was competing with the LCP image on
  the critical path.

---

## D-016 — The static fallback SVG is server-only
**2026-09-02 · technical**

`StackGraphSVG` is rendered on the server and passed into the client
`StackGraph` as a `fallback` prop rather than imported by it. Importing it from
a client component pulled `logos.ts` (~30KB of path data) plus the whole static
SVG tree into the initial client bundle, for markup the client never needs to
own.

This single change moved mobile Performance from 68 to 84 and halved TBT. It is
the clearest reminder in this codebase that `'use client'` is transitive through
imports.

---

## D-017 — The 3D monogram is CSS, not WebGL
**2026-09-02 · technical · supersedes the monogram half of D-005**

The hero's letterhead seal is a genuinely 3D, cursor-reactive mark built from
twelve laminated CSS layers — identical rounded squares each pushed further back
in Z, shaded by a single `color-mix` toward the page.

**It was built with React Three Fiber first, and measured.** The WebGL version
looked right, but pulling in all of three.js for an 84px logo cost:

| | WebGL monogram | CSS monogram |
|---|---|---|
| Desktop script transfer | 395KB | **162KB** |
| Desktop TBT | 350ms | **30ms** |
| Desktop Performance | 84 | **100** |
| Canvases in the hero | 1 | **0** |

Not a defensible trade for one mark, especially when the stack constellation
already carries the site's WebGL moment — and the graph is where depth actually
communicates something.

Lamination rather than four rotated face quads because it gives a correct
rounded silhouette at the corners, which assembled faces cannot. The shading
formula needs no per-theme branch: mixing toward `--paper` reads as a lit edge
on the dark tile in Paper and a shaded edge on the light tile in After hours.

Cursor tracking uses a window `pointermove` listener rather than events on the
element, so the seal leans toward the cursor anywhere on the page rather than
only while it is directly over 84 pixels of it. Skipped entirely under
`prefers-reduced-motion`; pointer tracking is skipped on coarse pointers while
the idle drift continues.

**The general lesson, worth keeping:** reach for WebGL when depth carries
meaning across many elements. For a single small mark, CSS 3D transforms give
the same result for none of the bytes.
