# Status

> Rewrite this file whenever the picture changes. It describes the present only.

**Last updated:** 2026-09-02
**Phase:** 8 of 8 complete — built, measured, documented
**Dev:** `pnpm dev` · **Prod:** `pnpm build && pnpm start`

---

## Measured results

Lighthouse against the production build (`pnpm lh`, `pnpm lh --desktop`):

| | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| **Desktop** | **100** | **100** | **100** | **100** |
| **Mobile** | **82–94** | **100** | **100** | **100** |

Desktop: LCP 0.8s · TBT 10–30ms · CLS 0 · 162KB script
Mobile: LCP 2.9–3.5s · TBT 100–340ms · CLS 0 · 162KB script, 30KB image

Mobile LCP is dominated by Lighthouse's slow-4G throttle (1.6 Mbps) against a
full-bleed photographic hero. That trade is deliberate — see D-015. Numbers
swing ±5 between runs on a busy machine; run `pnpm lh` three times and take the
median rather than reacting to one result.

`pnpm lint` clean · `pnpm typecheck` clean.

Degraded modes, all passing (`pnpm qa`, 11/11):

- `prefers-reduced-motion` — all content visible, no WebGL mounted, static graph present
- JavaScript disabled — all content visible, reveal gate never armed, static graph present
- dark theme — palette flips, ground is `rgb(12,12,10)`

## Built

Everything in the plan. All 27 routes prerender at build time:

```
/                     home — hero · about · work · experience · stack(3D) · cv · contact
/work/[slug]     × 4  case studies
/blog                 index + client-side tag filter
/blog/[slug]     × 3  posts (MDX, Shiki-highlighted at build)
/cv                   indexable HTML résumé + PDF toggle
sitemap.xml · robots.txt · rss.xml · manifest.webmanifest · icon.svg
opengraph-image  × 10 generated at build (Instrument Serif + JetBrains Mono)
```

## Blockers & things needing Prashanna

| # | Item | Impact | State |
|---|---|---|---|
| 1 | **`true2fa.com` serves no site** — resolves, returns HTTP 200, but shows a bare LiteSpeed "Index of /" directory listing. | Auth Sync is project 01. Its "visit" link is suppressed everywhere so the portfolio never sends anyone to a broken page. | **Needs a decision.** Restore the site, or leave the link off. One flag: `offline: true` in `src/data/projects.ts`. |
| 2 | **Web3Forms access key** | The contact form falls back to `mailto:` until it is set — messages still reach you, but through the visitor's mail client. | Paste into `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.local`. No code change needed. |
| 3 | **Real app screenshots** for the Auth Sync desktop UI and the Orbit Chat CRM | Both are behind login, so the cards currently show a designed representation (Auth Sync) and the marketing page (Orbit Chat). | Optional. Drop files in `public/work/` and set `shot` in `src/data/projects.ts`. See CONTENT.md. |
| 4 | **Seeded blog posts are drafts** | Three posts are written in Prashanna's voice from his real work. They are honest but they are not his words. | Review and rewrite. `content/blog/*.mdx`. |

## Not done / deliberate omissions

- **No `/blog/tag/[tag]` routes.** Tag filtering is client-side over the
  fully-server-rendered list, so filtered views are not linkable. Add routes if
  tag pages ever need to rank on their own.
- **No analytics.** Nothing is loaded that the user did not ask for.
- **Mobile graph has no orbit control.** One-finger rotate would swallow page
  scroll; mobile gets idle drift plus tappable nodes instead.

## Verified environment facts

- Node 24.14.1 · pnpm 10.33.0 · Chrome installed (Playwright uses `channel: 'chrome'`, no download)
- **Never run `pnpm build` while `next dev` is running** — both own `.next`, and
  the result is a server that quietly serves broken CSS and stale HTML. Kill
  node processes matching `next` first.
- Git Bash rewrites a bare `/` argument into a Windows path — pass routes as
  `--route /blog`, never as a bare positional `/`
- `sharp` needs `C:/...` paths, not MSYS `/c/...`

## Iframe embeddability (verified against live headers)

| Site | Embeddable | Evidence |
|---|---|---|
| orbitchat.ai | yes | no `X-Frame-Options`, no restrictive CSP |
| vrittechnologies.com | yes | no `X-Frame-Options` |
| everestthrills.com | **no** | `X-Frame-Options: DENY` |
| true2fa.com | n/a | site is down |
