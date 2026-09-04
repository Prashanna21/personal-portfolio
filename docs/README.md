# Documentation

Working docs for the Prashanna Maharjan portfolio. Written so a fresh session —
human or agent — can pick the work up cold without re-deriving anything.

## Read in this order

| File | What it is | Read it when |
|---|---|---|
| [STATUS.md](./STATUS.md) | Current state, next step, open blockers | **Always first.** Start of every session. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, routes, file layout, data model | Before writing code |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens, type scale, motion rules | Before writing any UI |
| [DECISIONS.md](./DECISIONS.md) | Why things are the way they are | Before changing a settled choice |
| [CONTENT.md](./CONTENT.md) | How to add a post, project or CV edit | When editing content, not code |
| [SEO.md](./SEO.md) | SEO surface and its checklist | When touching metadata or routes |
| [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) | Append-only build history | For context on how something got here |

## Rules for maintaining these

1. **`STATUS.md` is rewritten, everything else is appended.** It describes only
   the present. If it disagrees with reality, reality is wrong until fixed.
2. **Log at phase boundaries, not per file.** One entry per meaningful chunk of
   work, with what changed, what it broke, and what is now true.
3. **A decision goes in `DECISIONS.md` the moment it is made**, with the
   alternatives that lost and why. Never re-litigate a logged decision without
   adding a superseding entry.
4. **Record surprises.** A dead domain, a header that blocks embedding, a
   library that fights React 19 — those cost real time to rediscover.
5. **Never document intent as fact.** If it is not built, it belongs in
   `STATUS.md` under Next up, not in `ARCHITECTURE.md` as though it exists.
