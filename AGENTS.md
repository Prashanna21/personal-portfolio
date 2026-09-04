<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prashanna Maharjan — portfolio

**Read `docs/STATUS.md` before doing anything.** It carries the current phase,
what is done, what is next, and the open blockers. Then `docs/README.md` indexes
the rest.

## Ground rules

- **Design system is `src/app/globals.css`.** No hardcoded colours in
  components — use the tokens, they flip with theme. No second easing curve.
  See `docs/DESIGN_SYSTEM.md`.
- **Never hide content behind JavaScript.** Reveal animations are gated behind
  `[data-reveal-ready]`; the hero portrait settle is CSS, not WAAPI. Both exist
  so the page works with JS disabled. Do not "simplify" these away.
- **Content is transcribed from the real CV, not invented.** If a claim is not
  in `public/Prashanna-Maharjan-CV.pdf` or confirmed by Prashanna, it does not
  ship. See `docs/CONTENT.md`.
- **Server components by default.** `'use client'` only for genuine
  interactivity.
- **Mobile first.** Build 375px, then widen.
- Log meaningful work in `docs/IMPLEMENTATION_LOG.md`; log choices in
  `docs/DECISIONS.md`; rewrite `docs/STATUS.md` when the picture changes.

## Commands

```bash
pnpm dev --port 3210          # dev server
pnpm build                    # production build
pnpm shots [slug]             # re-capture project screenshots
node scripts/preview.mjs --route /blog [--mobile] [--dark] [--full]
```

## Environment gotchas

- Git Bash rewrites a bare `/` argument into a Windows path — pass routes via
  `--route`, never as a bare `/`.
- `sharp` needs `C:/...` paths, not MSYS `/c/...`.
