# maharjanprashanna.com.np

Personal site and portfolio for **Prashanna Maharjan** — Full-Stack &
Electron.js Engineer, Kathmandu.

Built on Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
React Three Fiber · MDX.

## Measured

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** |
| Mobile | **82–94** | **100** | **100** | **100** |

Desktop LCP 0.8s · TBT 30ms · CLS 0 · 162KB script.
Plus 11/11 assertions passing across reduced-motion, no-JavaScript and dark
theme (`pnpm qa`).

## Getting started

```bash
pnpm install
cp .env.example .env.local     # then paste your Web3Forms key
pnpm dev
```

Open http://localhost:3000.

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin. Defaults to the production domain. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | no | Contact form delivery. **Without it the form falls back to `mailto:`** rather than silently dropping messages. |

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build (prerenders all 27 routes)
pnpm start        # serve the production build
pnpm typecheck    # tsc --noEmit
pnpm lint

pnpm shots        # re-capture live project screenshots via headless Chrome
pnpm logos        # regenerate src/data/logos.ts from simple-icons
pnpm lh           # Lighthouse vs. the production build (--desktop for desktop)
pnpm qa           # reduced-motion / no-JS / dark-theme assertions
pnpm preview      # dev screenshots (--route, --mobile, --dark, --full)
```

> **Do not run `pnpm build` while `pnpm dev` is running.** Both own `.next`, and
> the result is a server that quietly serves broken CSS and stale HTML.

## Structure

```
src/app/          routes, the design system (globals.css), generated SEO files
src/components/   UI — server by default, 'use client' only where needed
src/data/         all content: projects, résumé, stack graph, logos
src/lib/          site config, fonts, JSON-LD, blog reader
content/blog/     posts as MDX
scripts/          screenshot capture, logo generation, Lighthouse, QA
docs/             working docs — start with docs/STATUS.md
```

## Docs

Everything about how and why this is built the way it is lives in
[`docs/`](./docs). Read [`docs/STATUS.md`](./docs/STATUS.md) first — it carries
the current state, open items and the environment traps worth knowing.

| | |
|---|---|
| [STATUS](./docs/STATUS.md) | Current state, blockers, measured results |
| [ARCHITECTURE](./docs/ARCHITECTURE.md) | Stack, routes, data model, budgets |
| [DESIGN_SYSTEM](./docs/DESIGN_SYSTEM.md) | Tokens, type scale, motion rules |
| [DECISIONS](./docs/DECISIONS.md) | Why things are the way they are |
| [CONTENT](./docs/CONTENT.md) | How to add a post, project or CV edit |
| [SEO](./docs/SEO.md) | Indexable surface and structured data |
| [IMPLEMENTATION_LOG](./docs/IMPLEMENTATION_LOG.md) | Build history |

## Two things worth knowing before you edit

1. **Nothing is hidden behind JavaScript.** Scroll reveals are gated behind a
   `[data-reveal-ready]` attribute set pre-paint, and the hero portrait's settle
   is a CSS animation rather than WAAPI. Both exist so the page works with JS
   disabled — don't "simplify" them away.
2. **Content is transcribed from the real CV, not invented.** If a claim isn't
   in `public/Prashanna-Maharjan-CV.pdf` or confirmed by Prashanna, it doesn't
   ship.

## Deploy

Push to a Git remote and import on Vercel. Set `NEXT_PUBLIC_WEB3FORMS_KEY` (and
`NEXT_PUBLIC_SITE_URL` if the domain changes) in the project's environment
variables. Everything else is static at build time.

Post-deploy checklist is in [`docs/SEO.md`](./docs/SEO.md): verify in the Rich
Results Test, submit the sitemap in Search Console, and confirm the canonical
resolves once DNS is live.
