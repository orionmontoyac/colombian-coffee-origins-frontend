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
