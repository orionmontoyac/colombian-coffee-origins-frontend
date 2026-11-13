# DECISIONS.md — calls made without asking

Append only. Format: `YYYY-MM-DD · who · decision · why · how to undo`. Mark anything the owner must confirm with **OWNER**.

## Pre-set by the owner and Claude (factory setup, 2026-11-13)

- 2026-11-13 · setup · **No backend yet.** Forms use Server Actions that validate and return success; a `// TODO(backend)` marks where Resend/Supabase plug in. · Supabase/Resend not set up. · Replace the TODO with real calls.
- 2026-11-13 · setup · **Shop checkout = WhatsApp order** with a prefilled message; online payments (PSE, Nequi, Daviplata, cards) shown as "coming soon". · No payment provider yet. · Swap the WhatsApp button for a checkout route. **OWNER**: choose a payment provider (e.g. Wompi, ePayco, Mercado Pago).
- 2026-11-13 · setup · **AI crawlers allowed** (search and training) in robots.txt. · The goal is to be found and cited by AI assistants. · Add `Disallow: /` rules for GPTBot, ClaudeBot, Google-Extended, Applebot-Extended to opt out of training. **OWNER** to confirm.
- 2026-11-13 · setup · **Motion rules relaxed** from "no scroll animation" to restrained one-time reveals, a hero entrance and page transitions, because the owner asked for opening effects and transitions. Planner updates DESIGN.md in task T4.1. · Owner request. · Revert the DESIGN.md motion section.
- 2026-11-13 · setup · **Lot URLs use the lot code in lower case** (`/en/coffees/urr-024`), producers and products use name slugs. · Short, stable, readable. · Change the helpers in `src/lib/routes.ts`.
- 2026-11-13 · setup · **Example data stays labelled as example** on every page until real producers are onboarded. · Avoid presenting invented offers as real. · Remove the note when data comes from Supabase.

## Agent decisions

<!-- agents append below -->
- 2026-11-13 · planner · **T0.1 kick-off findings.** Boards present: Main, Lots, Lot, Producer, Shop (all with `renderVals()` example data). **No board** for: producers directory, product detail, sell with us, for buyers, samples, contact, regions, Urrao, our story, journal, legal, 404. These are built from the DESIGN.md sub-page pattern (notched header → banner with 3 stats → body → CTA → footer). · SPEC §3 lists them as board-less. · Add boards to `design/boards/` and re-run the matching page task.
- 2026-11-13 · planner · **impeccable is installed** at `.claude/skills/impeccable/` (with `reference/craft-floor.md`), so page-builder, foundation-builder and motion preload it and the reviewer runs audit + critique. It is still untracked in git, along with the rest of `.claude/`. · Install found on disk. · Remove `.claude/skills/impeccable/` and drop the impeccable steps from T5.2.
- 2026-11-13 · planner · **Branch `factory/website` checked out**, 3 commits ahead of `development` with `main` (e4b58e0) as an ancestor, so it includes the latest home page. · Matches the FACTORY.md setup. · None needed.
- 2026-11-13 · planner · **BLOCKER (OWNER): crew and safety config missing.** `.claude/agents/` has none of the 8 crew files (planner, foundation-builder, page-builder, content-seo, ai-discoverability, motion, qa, reviewer), and `.claude/settings.json` doesn't exist. That file should hold the allowlist, the deny rules for `git push`/`rm -rf`/`sudo`/`.env`, and the Stop + post-edit hooks. FACTORY.md says the owner edits both, so the planner did not create them on its own. · Without them, delegation has no owner-defined roles and the safety rules aren't enforced. · Add the files and rerun from Phase 1.
- 2026-11-13 · planner · **Blocker resolved.** Commit 640813b added the 8 crew files and `.claude/settings.json`, which has the allowlist, deny rules and the post-edit + Stop hooks. Phase 1 starts now. · Owner supplied the config. · None needed.
