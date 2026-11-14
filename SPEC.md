# SPEC.md — Colombian Coffee Origins website

What to build, page by page. **How it looks** lives in `DESIGN.md` (single source of truth for design). **What to do next** lives in `TASKS.md`. Decisions agents make on their own go in `DECISIONS.md`. Missing photos and files go in `ASSETS.md`.

Visual references: the Claude Design canvas "Colombian Coffee Origins — Home Page Design", boards `Main` (home), `Lots`, `Lot`, `Producer`, `Shop`. Pages without a board are built from the DESIGN.md patterns (notched header, sub-page banner, cards, footer).

---

## 1. The business in one paragraph

A platform that connects Colombian family coffee farms, starting in **Urrao, Antioquia**, with the people who buy their coffee. Two lines that never mix:

| Line | What | Buyer | Where | Currency | Main action |
| --- | --- | --- | --- | --- | --- |
| **Green coffee lots** | Traceable green lots, one lot = one product | Roasters, importers, coffee shops | Worldwide | USD / kg (FOB) | Request sample |
| **Roasted coffee shop** | Bags roasted by producers under their own brands | Homes and cafés | **Colombia only** | COP | Add to cart |

Every coffee shows the **producer, farm and town**. Trust levels: Registered → Farm verified → Coffee verified.

## 2. Stack and hard rules

- Next.js 16 App Router under `src/app/[lang]` (EN default, ES), `cacheComponents` on, Tailwind v4, local fonts (Vollkorn, Fira Sans, Ubuntu). Read `node_modules/next/dist/docs/` before using any Next API (see AGENTS.md).
- All copy in `src/app/[lang]/dictionaries/{en,es}.json`. Both files keep identical keys.
- Routes only through `src/lib/routes.ts` (`href(lang, key)`); add new keys there with EN and ES slugs.
- Shop content is shown to every visitor; there is no country rule (owner, 2026-11-14). Roasted coffee still ships inside Colombia only, and the cart says so (`cart.shipsColombiaOnly`). Do not add geolocation gating, `OnlyInCountry`/`CountryGate`, or a country-based noindex.
- Example data lives in `src/data/*` and is labelled as example on the page. No invented facts about real people or companies beyond the existing sample producers.
- No backend yet (Supabase comes later). Forms use Server Actions that validate input and return a success state; they log to the server and have a clearly marked `// TODO(backend)` where Resend/Supabase will plug in. Record this in DECISIONS.md.

## 3. Sitemap and routes

| Key | EN | ES | Board | Type |
| --- | --- | --- | --- | --- |
| home | `/en` | `/es` | Main | Built — polish only |
| coffees | `/en/coffees` | `/es/cafes` | Lots | Catalog of green lots |
| lot (new) | `/en/coffees/[code]` | `/es/cafes/[code]` | Lot | Lot detail, one per lot |
| producers | `/en/producers` | `/es/productores` | — | Producer directory |
| producer (new) | `/en/producers/[slug]` | `/es/productores/[slug]` | Producer | Producer profile |
| shop | `/en/shop` | `/es/tienda` | Shop | Roasted shop (CO only) |
| product (new) | `/en/shop/[slug]` | `/es/tienda/[slug]` | — | Roasted product detail (CO only) |
| sellWithUs | `/en/shop/sell` | `/es/tienda/vender` | — | Producers: sell roasted / green |
| forBuyers | `/en/for-buyers` | `/es/para-compradores` | — | How sourcing works + FAQ |
| samples | `/en/samples` | `/es/muestras` | — | Sample request form |
| regions | `/en/regions` | `/es/regiones` | — | Regions index (Urrao live, others "coming") |
| urrao | `/en/regions/urrao` | `/es/regiones/urrao` | — | Region page |
| ourStory | `/en/our-story` | `/es/nuestra-historia` | — | Mission, team, how we work |
| contact | `/en/contact` | `/es/contacto` | — | Contact form + WhatsApp |
| journal | `/en/journal` | `/es/blog` | — | Index with 3 starter articles |
| privacy / terms | `/en/privacy`, `/en/terms` | `/es/privacidad`, `/es/terminos` | — | Legal (placeholder text marked for lawyer review) |
| not-found | any | any | — | Branded 404 with links to lots and shop |

Every visitor sees the full shop (indexable, HTTP 200) whatever their country. The cart drawer shows "For now, we only ship roasted coffee within Colombia." (EN) / "Por ahora, solo enviamos café tostado dentro de Colombia." (ES).

## 4. Pages and sections

Every sub-page uses the **sub-page banner** from DESIGN.md: notched header → breadcrumb (+ back button on detail pages) → chips, 64px H1 with one italic accent word, one description line → exactly three stat boxes. Then the page body, the CTA panel where noted, and the footer.

### 4.1 Home (`Main` board) — exists
Hero (photo + green fade), business-line cards, statement, "The heart of our coffee", "Featured lots from Urrao", roasted shop (CO), producers band, closing CTA, footer. Work left: motion, SEO metadata, JSON-LD, FAQ teaser (3 questions linking to For buyers), performance.

### 4.2 Green coffee lots catalog (`Lots` board)
Banner (chips: Traceable lots · Free samples · Export support; stats: lots available, harvest, region) → sticky filter bar (Variety, Process, Altitude, Score, Availability, Price; sort: Highest score, Newest, Price) → badge legend → grid of lot cards (same card as home, plus Save heart) → Load more → "Can't find what you need?" CTA panel → footer.
- Filters work client-side and write to the URL (`?process=washed`). Filtered URLs carry `<link rel="canonical">` to `/coffees` and are not in the sitemap.
- Empty state: "No lots match these filters" + reset button.

### 4.3 Lot detail (`Lot` board)
Banner (chips: LOT code, trust badge, availability; H1 "Variety · *Process*"; one line with producer, farm, town and notes; stats: SCA score, altitude, harvest) → gallery + sticky decision panel (price USD/kg FOB, minimum order, free 200 g sample, **Request sample**, Ask about this lot, Save) → specs table (variety, process, altitude, harvest, moisture, water activity, screen size, bag type, warehouse) → cup profile (notes, acidity, body, sweetness, cupper and date) → producer section linking to the producer page → "What we checked" + "How buying works" steps → "More from Urrao" (3 cards) → CTA panel → footer.

### 4.4 Producers directory
Banner → grid of producer cards (photo, name, farm, town, altitude, varieties, badges "Green coffee" / "Roasted coffee · CO") → "Are you a producer?" band (same as home producers band).

### 4.5 Producer profile (`Producer` board)
Banner (no avatar; chips: Farm verified, Green coffee, Roasted coffee · CO; H1 name with italic surname; stats: altitude, green lots, roasted bags) → sticky in-page nav (Story · Green coffee lots · Roasted coffee · The farm) → story (photo, text, quote, facts) → green lots → roasted coffee (brown panel, CO only) → farm gallery (map + photos) → CTA "Interested in her coffee?" → footer.

### 4.6 Roasted coffee shop (`Shop` board, CO only)
Dark-roast banner with the bean pattern (chips: Roasted by the producers · Ships within Colombia · Prices in COP; stats: coffees, producer brands, from COP …) → benefits strip (4, bean icons) → Shop by producer (6 brand circles) → sticky filters (roast, grind, under COP 50,000, sort) → product grid (bag mockup with bean logo, roast meter of five beans, COP price + price per kg, **Add**) → coffee club subscription panel + "Not sure which to pick?" quiz card → delivery & payment steps → "Do you roast your own coffee?" band → footer.
- Cart: drawer from the header Cart button, stored in `localStorage`, quantities, subtotal in COP, free-shipping progress ("COP 32,000 more for free shipping"). Checkout for now = **"Finish your order on WhatsApp"** with a prefilled message, plus a note that online payment (PSE, Nequi, cards) is coming. Record in DECISIONS.md.
- Product detail page: photos, brand + producer link, roast level, roast date line ("Roasted to order"), grind selector, size, price, Add to cart, tasting notes, brewing suggestion, shipping and returns summary.

### 4.7 For buyers
How sourcing works (5 steps: discover → sample → evaluate → buy → ship), trust levels explained, pricing (FOB, minimums, samples), export & logistics, **FAQ (8–10 questions, FAQPage schema)**, CTA.

### 4.8 Request samples / Contact / Sell with us
Forms with labels, inline validation, success state, honeypot field, privacy consent checkbox. Samples form pre-fills the lot when opened from a lot (`?lot=URR-024`). Contact page also shows WhatsApp (placeholder number) and email. Sell with us explains both ways to sell, requirements, and a producer sign-up form.

### 4.9 Regions and Urrao
Regions index (Urrao live; Antioquia, Huila, Nariño, Cauca "coming"). Urrao page: geography (Páramo del Sol, altitude 1,800–2,300 m), varieties (Chiroso, Castillo, Caturra), harvest calendar, producers and lots from Urrao, map placeholder.

### 4.10 Our story, Journal, Legal, 404
Our story: why we exist, how we work with producers, team placeholder. Journal: index + 3 starter articles (see keywords: "What is Chiroso coffee?", "How to buy green coffee from Colombia", "Urrao, Antioquia: a coffee region guide"), each with Article schema. Legal pages: structured placeholder text, clearly marked for review.

## 5. SEO keyword map

Use these naturally in titles, H1/H2, first paragraph, alt text and internal link text. One primary keyword per page. No stuffing: each primary keyword appears in the title, the H1 or first H2, the meta description and the first 100 words — and nowhere forced.

| Page | Primary (EN) | Secondary (EN) | Primary (ES) | Secondary (ES) |
| --- | --- | --- | --- | --- |
| Home | Colombian specialty coffee direct from farms | green coffee for roasters, roasted coffee from Colombian farms, Urrao coffee | café especial colombiano directo de la finca | café verde para tostadores, café tostado de origen, café de Urrao |
| Lots catalog | buy Colombian green coffee | specialty green coffee beans, green coffee lots, single origin green coffee, coffee samples | comprar café verde colombiano | lotes de café verde, café verde especial, muestras de café |
| Lot detail | {Variety} {Process} green coffee from Urrao | SCA {score}, {farm}, Antioquia | café verde {variedad} {proceso} de Urrao | puntaje SCA, {finca}, Antioquia |
| Producers | Colombian coffee producers | family coffee farms, coffee farmers Antioquia | productores de café colombianos | fincas cafeteras familiares, caficultores de Antioquia |
| Producer | {Name}, coffee producer in Urrao | {farm}, Chiroso, Castillo | {Nombre}, productora de café en Urrao | {finca}, café de finca |
| Shop | buy specialty coffee online in Colombia | roasted coffee from the farm, coffee beans delivery Colombia, café en grano | comprar café especial en línea en Colombia | café tostado de finca, café en grano a domicilio, tienda de café especial |
| Product | {Brand} {Name} roasted coffee | whole bean, {roast} roast, {grams} g | café {marca} {nombre} | café en grano, tueste {tueste}, {gramos} g |
| For buyers | how to import green coffee from Colombia | FOB green coffee price, coffee export Colombia, minimum order | cómo importar café verde de Colombia | precio FOB café verde, exportación de café |
| Urrao | Urrao coffee region | Chiroso coffee, Antioquia specialty coffee, Páramo del Sol | región cafetera de Urrao | café Chiroso, café especial de Antioquia |
| Journal: Chiroso | what is Chiroso coffee | Chiroso variety, Urrao, flavor profile | qué es el café Chiroso | variedad Chiroso, perfil de taza |

Brand entity, always written the same: **Colombian Coffee Origins** (working name) · Urrao & Medellín, Antioquia, Colombia · placeholders for email, WhatsApp, Instagram and LinkedIn in `src/lib/site.ts`.

## 6. Structured data (JSON-LD)

| Where | Types |
| --- | --- |
| Every page | `Organization` (name, url, logo, sameAs placeholders, contactPoint), `WebSite` (with `inLanguage`), `BreadcrumbList` on sub-pages |
| Lots catalog, producers, shop | `ItemList` of the cards |
| Lot detail | `Product` (name, sku = lot code, brand = producer farm, `additionalProperty` for altitude, process, variety, score) + `Offer` (USD, `priceSpecification` per kg, `availability`, `eligibleQuantity` min order) or no Offer when price is on request |
| Roasted product | `Product` + `Offer` (COP, `availability`, `shippingDetails` → `OfferShippingDetails` for Colombia, `hasMerchantReturnPolicy`) |
| Producer | `Person` with `worksFor`/`affiliation` → `Organization`(farm) and `Place` (Urrao, geo) |
| For buyers, home FAQ | `FAQPage` |
| Journal articles | `Article` (headline, datePublished, dateModified, author, image) |
| Urrao | `Place` with `geo` and `containedInPlace` Antioquia, Colombia |

Validate with the checker in `scripts/factory/check-seo-ai.mjs` (parses every JSON-LD block) and note results in TASKS.md.

## 7. AI discoverability (LLMs and AI search)

- `/llms.txt` following llmstxt.org: H1 name, blockquote summary (two lines, who/what/where/currency), sections "Green coffee", "Roasted coffee shop (Colombia only)", "Producers", "For buyers", "Optional". Links point to Markdown versions.
- `/llms-full.txt`: the full plain-Markdown content of the key pages (home, for buyers + FAQ, every lot, every producer, shop catalog, Urrao), generated at build time from dictionaries and `src/data/*` so it never drifts.
- Markdown version of each key page at `/md/{lang}/{path}` (route handler), linked from the HTML with `<link rel="alternate" type="text/markdown">`.
- `robots.txt` allows search and AI crawlers (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended) and lists the sitemap. Training opt-in or opt-out is the owner's decision: default **allow**, recorded in DECISIONS.md.
- Answer-first content lives **only** in the Markdown versions (`/md/*`), `/llms.txt` and `/llms-full.txt`: a one-sentence answer, a short facts table (altitude, varieties, harvest, price unit) and a date ("Updated November 2026"). **Owner decision 2026-11-14: no visible "Key facts" / answer-first block (sentence + facts table + "example data" note) on any HTML page.** Do not add one back; `tests/e2e/facts.spec.ts` fails if it reappears.
- Facts that must be identical everywhere (site, llms.txt, JSON-LD): business name, location, the two lines, currencies, Colombia-only shop, sample policy.

## 8. Performance, accessibility and quality targets

- Lighthouse (mobile, every page in `scripts/factory/pages.json`): **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100**. Desktop ≥ 95 on all four.
- Core Web Vitals in lab: LCP < 2.5 s, CLS < 0.05, TBT < 200 ms.
- Fonts converted to WOFF2 and subset to Latin; total font weight under 250 KB.
- Images through `next/image`, AVIF/WebP, correct `sizes`, hero `priority`, everything else lazy. No image over 300 KB after optimization.
- WCAG 2.2 AA: contrast, focus visible, 44px targets, labels, skip link, `lang` per locale, no axe violations of serious/critical impact.
- Motion: see DESIGN.md motion rules; everything respects `prefers-reduced-motion`.

## 9. Good practices for a coffee shop like this

- Always show: producer, farm, town, variety, process, altitude, harvest year, roast level (roasted), size, price and price per kg.
- Roast date promise ("roasted to order, ships within 3 days") and storage tip on every product.
- Grind selector (whole bean, filter, espresso, moka) with whole bean as default.
- Shipping cost and free-shipping threshold visible before checkout; delivery times by city (Medellín, Bogotá, rest of Colombia).
- Payment methods Colombians expect: PSE, Nequi, Daviplata, cards, cash on delivery — shown as "coming soon" until real.
- Green coffee: sample policy (free 200 g for verified buyers), minimum order (one 35 kg box), FOB price explained, harvest calendar, lead time.
- WhatsApp contact button (floating on mobile, not covering content), standard in Colombia.
- Reviews only when real; no fake ratings or testimonials. Leave a slot and record it in ASSETS.md.
- Legal: Colombian consumer rules (right of withdrawal "derecho de retracto", PQRS contact) on shop pages, linked from the footer — text placeholders for a lawyer.
