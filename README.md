# Colombian Coffee Origins — Frontend

Public website and dashboards for a B2B specialty coffee marketplace connecting Colombian producers with international buyers.

Business model and the full website spec (sitemap, design system, page-by-page requirements) live in Notion: *Colombian Coffee Origins — Business Model & Product Strategy* and its subpage *Website Starter Manifest*.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Bilingual routing under `src/app/[lang]` (English default, Spanish) with JSON dictionaries and `src/proxy.ts` for locale redirects
- Planned: Supabase (auth, Postgres, storage), Resend

> This Next.js version has breaking changes from older releases. Read the guides in `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`; Claude Code loads it through `CLAUDE.md`).

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Structure

- `src/app/[lang]/` — localized routes, layout and dictionaries
- `src/components/` — shared UI (`pill-nav`, more to come per the manifest)
- `src/app/globals.css` — design tokens in code
- `DESIGN.md` — Origin Ledger design system (tokens and rules), the single source of truth for design

## Status

Initial scaffold: home page skeleton, EN/ES routing, design tokens. Photos are placeholders. Next: catalog, lot detail, producers, sample request form.
