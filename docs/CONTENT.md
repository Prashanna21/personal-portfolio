# Content

Where every word on the site comes from, and how to change it.

> All CV-derived content was extracted from the real
> `public/Prashanna-Maharjan-CV.pdf` using `pdfjs-dist`. It is transcribed, not
> invented. Keep it that way — if a claim is not in the CV or confirmed by
> Prashanna, it does not go on the site.

## Map

| Content | Lives in |
|---|---|
| Name, role, email, socials, domain | `src/lib/site.ts` |
| Nav items | `src/lib/site.ts` → `nav` |
| The 4 case studies (cards **and** `/work/[slug]`) | `src/data/projects.ts` |
| Experiments grid | `src/data/projects.ts` → `experiments` |
| Roles, education, achievements, skills, stats | `src/data/resume.ts` |
| Tech graph nodes, edges, categories | `src/data/stack.ts` |
| Blog posts | `content/blog/*.mdx` |
| Hero and section prose | the section components in `src/components/home/` |

## Add a blog post

Create `content/blog/my-post.mdx`. The filename is the slug.

```mdx
---
title: 'Client-side encryption in an Electron app'
description: 'One sentence for search results and the card. ~155 chars.'
date: '2026-09-02'
tags: ['electron', 'cryptography']
draft: false
---

Body in MDX. Code fences are highlighted at build time by Shiki — zero
client-side JavaScript.
```

- `draft: true` hides it from the index, the sitemap and RSS.
- Reading time is computed, not written.
- The post's OG image is generated from the title — nothing to supply.

## Add or edit a project

Everything for a project is one object in `src/data/projects.ts`. Fields that
carry behaviour rather than copy:

| Field | Meaning |
|---|---|
| `shot` | basename in `public/work/`, or `null` to render the designed mock |
| `embeddable` | may this site be shown in an iframe? **Verify against live headers before setting `true`** |
| `offline` | domain resolves but serves no product — suppresses the visit link |
| `facts` | the `BUILT` / `SHIPPED` rows on the card |
| `caseStudy` | only used by `/work/[slug]` |

### Re-capture screenshots

```bash
pnpm shots                  # all four
pnpm shots orbit-chat       # just one
```

Writes AVIF + WebP to `public/work/` and blur placeholders to
`src/data/shot-placeholders.json`.

### Supplying your own screenshot

Drop a file into `public/work/<slug>.webp` (and `.avif` if you have it), then
point `shot` at the basename. Best results at 16:10 and at least 1600px wide.

**This is how the two logged-in UIs get real screenshots** — the Auth Sync
desktop app and the Orbit Chat CRM cannot be captured automatically.

## Update the CV

Two places, and they must be kept in step:

1. `public/Prashanna-Maharjan-CV.pdf` — the downloadable file.
2. `src/data/resume.ts` — what `/cv` and the home Experience section render.

The HTML version is the canonical one for search engines; the PDF is what people
download. Changing one without the other is the main way this page goes stale.
