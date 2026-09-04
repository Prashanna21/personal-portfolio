# SEO

Canonical origin: **`https://maharjanprashanna.com.np`**, set once via
`NEXT_PUBLIC_SITE_URL` and read from `src/lib/site.ts`. Every canonical, OG tag,
sitemap entry and JSON-LD `@id` derives from it — change it in one place.

## Indexable surface

Roughly `4 + N + 1` pages instead of one (D-003):

| Route | Purpose |
|---|---|
| `/` | the full scroll — the entity page |
| `/work/[slug]` × 4 | case studies: problem, approach, what shipped |
| `/blog`, `/blog/[slug]` × N | writing |
| `/cv` | HTML résumé — indexable, ATS-readable |

## Structured data (`src/lib/schema.ts`)

| Schema | Where | Notes |
|---|---|---|
| `Person` | every page, via root layout | `@id: /#person` — the anchor everything else references |
| `WebSite` | every page | publisher points at the Person |
| `SoftwareApplication` | `/work/auth-sync` | it is a cross-platform desktop app |
| `WebSite` | other case studies | |
| `BlogPosting` | `/blog/[slug]` | headline, dates, keywords, image, author |
| `BreadcrumbList` | nested routes | |

`Person` carries `sameAs` (GitHub, LinkedIn, Instagram), `knowsAbout`,
`alumniOf` and `worksFor` — these are what let Google connect the site to the
real person rather than treating it as an anonymous page.

## Metadata

- `metadataBase` + a title template (`%s · Prashanna Maharjan`)
- Per-route `openGraph` and `twitter` (`summary_large_image`)
- `robots` with `max-image-preview: large` and `max-snippet: -1`
- `alternates.canonical` on every route
- RSS advertised via `<link rel="alternate">` and `alternates.types`

## Generated files

`sitemap.ts` (with `lastModified`), `robots.ts`, `rss.xml` route handler,
`opengraph-image.tsx` per route family, `icon.svg`, `manifest.ts`.

OG images use the file convention so they are **pre-rendered at build time** on
statically generated routes — no runtime image service, no per-request cost.

## Why the 3D graph has an SVG fallback

The WebGL constellation contains no crawlable text. Its fallback is real inline
SVG with real `<text>` labels, so all 25 technology names are in the HTML —
which is exactly the vocabulary someone would search for. **The fallback is the
SEO-bearing renderer; the 3D scene is the enhancement.** (D-005)

## Checklist

- [x] One `<h1>` per page; heading hierarchy never skips a level
- [x] Descriptive `alt` on every meaningful image; decorative ones `aria-hidden`
- [x] Self-hosted fonts — no render-blocking third-party requests
- [x] `next/image` with explicit `sizes` (no layout shift)
- [x] Skip-to-content link
- [ ] Verify in Rich Results Test after deploy
- [ ] Submit sitemap in Search Console
- [ ] Confirm canonical resolves (`www` vs apex) once DNS is live
