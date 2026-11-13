# TASKS.md — factory work list

The single source of state for the factory. Work top to bottom. A task is ticked only when **its verify command passes** and every checkpoint under it is ticked. Owners and file ownership come from `.claude/agents/*.md`; the planner may split tasks but never deletes checkpoints.

**Definition of Done (whole site)** — all must be true; `scripts/factory/is-done.sh` checks it (these are not checkboxes, the tasks below are):
- Every task below is ticked.
- `npm run verify` exits 0 (lint, typecheck, token check, build, SEO/AI checker, Playwright e2e + axe, Lighthouse CI on every page in `scripts/factory/pages.json`).
- Lighthouse mobile on every page: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
- No "Lorem", "TODO", "TBD" visible on any page; every placeholder image is listed in `ASSETS.md`.
- Final reviewer report verdict PASS and final qa report all PASS.

Legend: `Owner` = agent · `Owns` = files only that agent may edit · `Verify` = command that must pass.

---

## Phase 0 — Kick-off (planner, alone)

- [x] **T0.1 Read and confirm the plan** · Owner: planner · Owns: TASKS.md, DECISIONS.md
  - [x] Read FACTORY.md, SPEC.md, DESIGN.md, ASSETS.md, AGENTS.md, current code under `src/`.
  - [x] Confirm `design/boards/*.dc.html` exist (Main, Lots, Lot, Producer, Shop); note any page without a board.
  - [x] Check whether `.claude/skills/impeccable/` exists; record the answer in DECISIONS.md (agents use it if present).
  - [x] Work on branch `factory/website` (created from `main` during setup; if missing, `git switch -c factory/website main`).
  - Verify: `test -f SPEC.md && test -f DESIGN.md && git rev-parse --abbrev-ref HEAD | grep -q factory/website`

## Phase 1 — Foundation (foundation-builder, alone, in order)

- [x] **T1.1 Tooling and scripts** · Owns: package.json, playwright.config.ts, lighthouserc.json, tests/e2e/smoke.spec.ts
  - [x] Install pinned dev deps: `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`; run `npx playwright install chromium`.
  - [x] npm scripts exist: `typecheck`, `lint`, `test:e2e`, `lhci`, `check:tokens`, `check:seo`, `verify`.
  - [x] Playwright projects: desktop 1440×900, Pixel 7, `x-country: CO` variant, `reducedMotion: 'reduce'` variant; `webServer` builds and starts on port 3100.
  - [x] `tests/e2e/smoke.spec.ts`: `/en` and `/es` return 200, one H1, no console errors.
  - Verify: `npm run lint && npm run typecheck && npm run build && npx playwright test tests/e2e/smoke.spec.ts`
- [x] **T1.2 Tokens from DESIGN.md** · Owns: src/app/globals.css, scripts/factory/check-tokens.mjs
  - [x] Every DESIGN.md color, radius, spacing and type token exists in `globals.css` under the same name (colors include the roasted line: roast, roast-dark, caramel, roast-surface, roast-line, roast-body, on-roast-body; add `roast-card #F3E6D8` to DESIGN.md through the planner).
  - [x] Type utilities: `font-display` Vollkorn, `font-sans` Fira Sans, `font-label` Ubuntu; text styles headline-xl/lg/md/sm, body-lg/md/sm, label-md, label-caps, nav-caps.
  - [x] Motion block placeholder at the end of `globals.css` (`/* motion */`), handed to the motion agent.
  - [x] `npm run check:tokens` fails on raw hex colors in `src/components/**` and `src/app/**/*.tsx` (data files allowed) and passes now (fix the existing `#5e3820` hovers with a `roast-hover` token).
  - Verify: `npm run check:tokens && npm run build`
- [x] **T1.3 Fonts to WOFF2** · Owns: src/fonts/**, src/app/[lang]/layout.tsx
  - [x] TTF → WOFF2, subset Latin + Latin-1, only the weights DESIGN.md uses; unused files removed.
  - [x] Total font bytes < 250 KB (`du -cb src/fonts/**/*.woff2`).
  - [x] No visual change on home at 1440 and 390 (screenshots before/after in `artifacts/screenshots/t1-3-*`).
  - Verify: `test $(find src/fonts -name '*.woff2' -exec cat {} + | wc -c) -lt 256000 && npm run build`
- [x] **T1.4 Shared components** · Owns: src/components/ui/**, src/components/home/site-header.tsx
  - [x] SubpageBanner, StatBox, Chip, TrustBadge, Button (5 variants), SectionHeader, LotCard, ProductCard (+BagMockup, RoastMeter with the bean icon), ProducerCard, CtaPanel, FilterBar shell, Breadcrumbs, PlaceholderImage, WhatsAppButton, SkipLink.
  - [x] Home page refactored to use LotCard, ProductCard, SectionHeader, CtaPanel with no visual change.
  - [x] Header: Cart button variant for shop pages; skip link to `#main`; mobile menu keyboard-accessible.
  - [x] Bean icon and pattern assets added from `design/assets/` (bean-brown.png, bean-white.png, beans-caramel.png).
  - Verify: `npm run lint && npm run typecheck && npm run build && npx playwright test tests/e2e/smoke.spec.ts`
- [x] **T1.5 Site constants, routes, data** · Owns: src/lib/site.ts, src/lib/routes.ts, src/data/**
  - [x] `site.ts` with name, base URL, locales, placeholder contacts (each listed in ASSETS.md).
  - [x] All SPEC.md §3 route keys plus `lotHref`, `producerHref`, `productHref`.
  - [x] Data: 6 example lots (the 3 existing + 3 from the Lots board), 3 producers (Luz Mery Higuita, Hernán Darío Restrepo, Jhon Jairo Úsuga) with slugs, 8 roasted products and 6 brands from the Shop board, prices in COP; every file headed "EXAMPLE DATA".
  - Verify: `npm run typecheck && npm run build`

- [x] **T1.6 Per-key dictionary files (enables parallel page work)** · Owner: foundation-builder · Owns: src/app/[lang]/dictionaries.ts, src/app/[lang]/dictionaries/**
  - [x] Each top-level dictionary key lives in its own pair of files `dictionaries/<key>/en.json` + `es.json` (or an equivalent layout); `getDictionary()` merges them and the `Dictionary` type is still inferred, with EN as the source of truth and ES checked to have the same shape.
  - [x] A new page key is added by creating its own folder only. No shared file needs editing, so parallel page builders never touch the same file.
  - [x] Home renders identically (same keys, same text).
  - Verify: `npm run typecheck && npm run build && npx playwright test tests/e2e/smoke.spec.ts`
- [x] **T1.7 Isolated build and test slots for parallel builders** · Owner: foundation-builder · Owns: next.config.ts, playwright.config.ts, .gitignore
  - [x] `next.config.ts` reads `distDir` from `NEXT_DIST_DIR` (default `.next`); `.gitignore` ignores `/.next-*/`.
  - [x] `playwright.config.ts` reads the port from `E2E_PORT` (default 3100) for baseURL, the webServer command and url, and writes output to `artifacts/playwright-<port>`, so four builders can each build and test at once.
  - Verify: `npm run build && npx playwright test tests/e2e/smoke.spec.ts && NEXT_DIST_DIR=.next-slot1 E2E_PORT=3101 npx playwright test tests/e2e/smoke.spec.ts`

## Phase 2 — Pages (page-builder × up to 4 in parallel; each owns its route folder + dictionary key)

Each page task has these **standard checkpoints** in addition to its own:
`[ ] matches its board (or DESIGN.md sub-page pattern) at 1440 and 390, EN and ES` · `[ ] one H1, sub-page banner with exactly 3 stats` · `[ ] all copy in en.json and es.json under its own key` · `[ ] generateMetadata with title/description from SPEC §5 keywords` · `[ ] JSON-LD per SPEC §6` · `[ ] missing photos use PlaceholderImage + ASSETS.md row` · `[ ] check-seo-ai passes for the route` · `[ ] qa report PASS` · `[ ] renders `<main id="main">` (skip-link target)`

- [ ] **T2.1 Green coffee lots catalog** `/coffees` · Owns: src/app/[lang]/coffees/page.tsx, src/components/lots/**, dict key `lotsPage`
  - [ ] Filters (variety, process, altitude, score, availability, price) and sort work client-side and sync to the URL; filtered URLs canonical to `/coffees`.
  - [ ] Empty state with reset; Load more; "Can't find what you need?" CTA → samples/contact.
  - [ ] ItemList JSON-LD; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en/coffees,/es/cafes && npx playwright test tests/e2e/lots.spec.ts`
- [ ] **T2.2 Lot detail** `/coffees/[code]` · Owns: src/app/[lang]/coffees/[code]/**, src/components/lot/**, dict key `lotPage`
  - [ ] `generateStaticParams` for every lot × locale; unknown code → 404.
  - [ ] Gallery, sticky decision panel (price USD/kg FOB or "price on request", min order, free sample, Request sample → `/samples?lot=CODE`), specs table, cup profile, producer block, "What we checked", "How buying works", "More from Urrao", CTA.
  - [ ] Product + Offer JSON-LD (no Offer when price on request); BreadcrumbList; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en/coffees/urr-024,/es/cafes/urr-024 && npx playwright test tests/e2e/lot.spec.ts`
- [ ] **T2.3 Producers directory + producer profile** · Owns: src/app/[lang]/producers/**, src/components/producer/**, dict keys `producersPage`, `producerPage`
  - [ ] Directory grid; profile per Producer board (no avatar; in-page nav; story; green lots; roasted panel CO-only; farm gallery with map placeholder; CTA).
  - [ ] Person + Place JSON-LD; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en/producers,/en/producers/luz-mery-higuita,/es/productores/luz-mery-higuita && npx playwright test tests/e2e/producers.spec.ts`
- [ ] **T2.4 Roasted coffee shop + product detail + cart** · Owns: src/app/[lang]/shop/**, src/components/shop/**, dict keys `shopPage`, `productPage`, `cart`
  - [ ] Shop page per Shop board (brown identity, bean pattern banner, perks, brands, filters, product grid with roast meter, coffee club, quiz card, delivery steps, sell band).
  - [ ] Product page per SPEC §4.6 (roast date promise, grind selector, size, price/kg, shipping & returns).
  - [ ] Cart drawer: add/remove/quantity, COP subtotal, free-shipping progress (threshold COP 150,000), persisted in localStorage, focus-trapped, WhatsApp checkout with prefilled order text; "online payment coming soon (PSE, Nequi, cards)".
  - [ ] Non-CO visitors get the "ships inside Colombia only" page, HTTP 200, noindex.
  - [ ] Product + Offer (COP, shipping details, return policy) JSON-LD; prices `COP 68,000` EN / `$68.000` ES; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /es/tienda --country CO && npx playwright test tests/e2e/shop.spec.ts`
- [ ] **T2.5 For buyers + FAQ** `/for-buyers` · Owns: src/app/[lang]/for-buyers/**, src/components/buyers/**, dict key `buyersPage`
  - [ ] 5 sourcing steps, trust levels, pricing (FOB, minimums, samples), export & logistics, FAQ (from ai-discoverability `faq` key), CTA.
  - [ ] FAQPage JSON-LD; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en/for-buyers,/es/para-compradores`
- [ ] **T2.6 Forms: samples, contact, sell with us** · Owns: src/app/[lang]/samples/**, src/app/[lang]/contact/**, src/app/[lang]/shop/sell/**, src/components/forms/**, src/lib/actions/**, dict key `forms`
  - [ ] Server Actions with validation, honeypot, consent checkbox, success state, `// TODO(backend)` hand-off; `?lot=` prefill on samples.
  - [ ] Accessible errors (`aria-describedby`, focus first error); WhatsApp + email on contact (placeholders).
  - [ ] Standard checkpoints (JSON-LD: BreadcrumbList only).
  - Verify: `npm run build && npx playwright test tests/e2e/forms.spec.ts`
- [ ] **T2.7 Regions + Urrao, Our story, Journal (3 articles), Legal, 404** · Owns: src/app/[lang]/regions/**, src/app/[lang]/our-story/**, src/app/[lang]/journal/**, src/app/[lang]/privacy/**, src/app/[lang]/terms/**, src/app/[lang]/not-found.tsx, dict keys `regionsPage`, `storyPage`, `journal`, `legal`, `notFound`
  - [ ] Urrao page with facts table, harvest calendar, producers and lots from Urrao, map placeholder; Place JSON-LD.
  - [ ] Journal: "What is Chiroso coffee?", "How to buy green coffee from Colombia", "Urrao, Antioquia: a coffee region guide" (EN + ES, 600–900 words each, Article JSON-LD, internal links to lots and producers; factual claims kept general or marked for owner review).
  - [ ] Legal pages structured, marked "draft for legal review"; includes derecho de retracto and PQRS contact for the shop.
  - [ ] Branded 404 with links to lots, shop and home; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en/regions/urrao,/en/journal,/en/our-story`
- [ ] **T2.8 Home polish** · Owns: src/app/[lang]/page.tsx, src/components/home/** (except site-header), dict keys `hero`, `lines`, `farmers`, `lots`, `shop`, `producersBand`, `closing`
  - [ ] Links from home cards go to the real lot, producer and product pages.
  - [ ] Replace the interim `ink-soft` and `line-soft` tokens in `sections.tsx`, `TrustBadge` and `LotCard` with DESIGN.md palette tokens (e.g. `body`/`ink`, `line`/`surface-sunken`), then remove both from `globals.css` (request to foundation-builder).
  - [ ] Reconcile home-parity sizes with the Main board and DESIGN.md (LotCard radius 28px vs card 24px; SectionHeader xl 56px); change DESIGN.md through the planner if the board wins.
  - [ ] FAQ teaser (3 questions → For buyers) before the closing CTA; answer-first sentence in the hero subtitle.
  - [ ] Matches the Main board at 1440 and 390; standard checkpoints.
  - Verify: `npm run build && node scripts/factory/check-seo-ai.mjs --only /en,/es`

## Phase 3 — Findability (content-seo and ai-discoverability in parallel)

- [ ] **T3.1 SEO system** · Owner: content-seo · Owns: src/lib/seo/**, src/app/sitemap.ts, src/app/robots.ts, src/app/[lang]/opengraph-image.tsx, dict keys `meta`, `nav`, `footer`
  - [ ] `buildMetadata` and JSON-LD builders used by every page (pages switched over via small tasks for their owners if needed).
  - [ ] Titles 30–60 chars, descriptions 70–155 chars, unique per page and language; primary keyword placement per SPEC §5.
  - [ ] Canonical + hreflang (`en`, `es`, `x-default`) on every page; `<html lang>` per locale.
  - [ ] `sitemap.xml` lists every indexable URL in both languages with alternates; excludes filtered, success and `/md/` URLs.
  - [ ] `robots.txt` allows search + AI crawlers (SPEC §7) and points to the sitemap.
  - [ ] OG images 1200×630 (default + lot + product variants) with alt text.
  - [ ] Internal links: lot ↔ producer ↔ region; descriptive anchor text; breadcrumbs on every sub-page.
  - [ ] Organization + WebSite JSON-LD in the layout; sameAs placeholders listed in ASSETS.md.
  - Verify: `npm run build && npm run check:seo && npm run lhci -- --collect.settings.onlyCategories=seo`
- [ ] **T3.2 AI discoverability** · Owner: ai-discoverability · Owns: src/app/llms.txt/**, src/app/llms-full.txt/**, src/app/md/**, src/lib/ai/**, dict key `faq`, tests/e2e/facts.spec.ts
  - [ ] `/llms.txt` in llmstxt.org format, generated from data, absolute links to Markdown pages.
  - [ ] `/llms-full.txt` (< 200 KB) with source URL and updated date per section.
  - [ ] `/md/{lang}/...` for home, for buyers, every lot, every producer, shop, Urrao; `rel="alternate" type="text/markdown"` + `rel="describedby"` links in those pages.
  - [ ] Answer-first sentence + facts table on home, catalog, lots, producers, shop, Urrao.
  - [ ] FAQ: 8–10 Q&A per language (+3 for home) feeding FAQPage JSON-LD.
  - [ ] `src/lib/ai/facts.ts` canonical facts; `facts.spec.ts` asserts they match across `/llms.txt`, `/en`, `/es`.
  - [ ] View-source contains lot names, prices and producer names (no client-only content for key facts).
  - Verify: `npm run build && npm run check:seo -- --ai && npx playwright test tests/e2e/facts.spec.ts`

## Phase 4 — Motion (motion agent)

- [ ] **T4.1 Motion system + DESIGN.md rule update** · Owns: src/components/motion/**, the `/* motion */` block of globals.css
  - [ ] Planner updates DESIGN.md motion rules (hero entrance, sub-page banner entrance, view transitions, restrained one-time section reveals, interaction states; all with reduced-motion fallback) and logs it in DECISIONS.md.
  - [ ] Motion tokens (easings, 4 durations) in globals.css and DESIGN.md.
  - Verify: `npm run check:tokens && npm run build`
- [ ] **T4.2 Opening effects and transitions**
  - [ ] Home hero entrance sequence (title rise, giant word un-blur, slow photo scale) — H1 visible immediately (transform-only).
  - [ ] Sub-page banner entrance on every sub-page.
  - [ ] View transitions: lot card image → lot gallery; product bag → product page; crossfade elsewhere; feature-detected.
  - [ ] `<Reveal>` on section headers and card grids only, once, 12px.
  - [ ] Hover lift, press scale, chip crossfade, filter crossfade, cart drawer slide + focus trap, cart count bean pop, roast meter fill.
  - [ ] `prefers-reduced-motion`: nothing moves (Playwright reduced-motion project passes).
  - [ ] CLS < 0.05 and Performance ≥ 90 on home and a lot page after the change.
  - Verify: `npm run build && npx playwright test --project=reduced-motion && npm run lhci`

## Phase 5 — Quality gates (qa and reviewer, then fixes by owners)

- [ ] **T5.1 Full QA pass** · Owner: qa · Owns: tests/e2e/**, artifacts/**
  - [ ] Screenshots of every page in `pages.json` at 1440/390, EN/ES (and CO / non-CO for shop pages).
  - [ ] axe: zero serious/critical; keyboard walk of header, filters, forms, cart.
  - [ ] All e2e specs green; report `artifacts/reports/qa-final.md` all PASS.
  - Verify: `npm run test:e2e`
- [ ] **T5.2 Full review** · Owner: reviewer
  - [ ] Lighthouse mobile ≥ 90/95/95/100 and desktop ≥ 95 on every page.
  - [ ] Token and DESIGN.md compliance; Next 16 API correctness; no secrets; first-load JS ≤ 180 KB per route.
  - [ ] impeccable audit + critique (if installed) with no P0/P1 left.
  - [ ] Report `artifacts/reports/review-final.md` verdict PASS.
  - Verify: `npm run verify`
- [ ] **T5.3 Fix round** · Owner: planner (assigns fixes to owners)
  - [ ] Every P0/P1 from T5.1 and T5.2 fixed and re-verified.
  - Verify: `bash scripts/factory/is-done.sh`

## Phase 6 — Hand-off (planner)

- [ ] **T6.1 Owner hand-off**
  - [ ] Summary at the top of this file: pages built, Lighthouse table, open decisions.
  - [ ] ASSETS.md sorted by priority (hero and lot photos first) with exact specs.
  - [ ] DECISIONS.md reviewed; items that need the owner marked **OWNER**.
  - [ ] Branch `factory/website` pushed is **not** done automatically — leave it local and say so.
  - Verify: `bash scripts/factory/is-done.sh`
