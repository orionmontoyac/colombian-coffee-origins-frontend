# ASSETS.md — placeholders and what belongs there

Every `PlaceholderImage` in the code has an `assetId` listed here. Agents append rows; the owner replaces placeholders with real files (drop them in `src/assets/<area>/` with the given file name and remove the row's placeholder note).

Photo rules for all real photos: real people and places from Urrao (no stock photos from other countries), natural light, people's consent to appear, at least 2400 px on the long side, JPG quality ≥ 85, no text on the image.

| Priority | assetId | Where it is used | What should be there | Orientation / ratio | Min size | File name | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | lot-urr-024-gallery-1..4 | Lot detail gallery | Chiroso cherries on the branch, drying beds with this lot, the producer picking, green beans close-up on a white tray | 4:3 landscape | 2400×1800 | `lots/urr-024-1.jpg`…`-4.jpg` | placeholder |
| P1 | lot-card-photo-* | Lot cards (catalog, home) when a lot has no photo yet | Real photo of that lot's cherries or green beans, shown 4:3 in the card header | 4:3 landscape (card crops to about 2:1) | 2400×1800 | `lots/<code>-card.jpg` | placeholder |
| P1 | producer-luz-mery-portrait | Producer profile story, producers directory | Luz Mery Higuita at Finca El Mirador, waist-up, coffee plants behind, looking at camera, smiling | 4:5 portrait | 1600×2000 | `producers/luz-mery-higuita.jpg` | placeholder |
| P1 | farm-el-mirador-drying-beds | Producer profile farm gallery | Raised drying beds (camas africanas) with parchment coffee, mountains behind | 4:3 | 2400×1800 | `farms/el-mirador-drying.jpg` | placeholder |
| P1 | farm-el-mirador-map | Producer profile, Urrao page | Static map of the farm area (no exact address), or an illustrated map of Urrao | 1:1 | 1200×1200 | `maps/urrao.png` | placeholder |
| P1 | product-photos-* | Shop product cards and product pages | Real bag photo per product on a neutral background (front, back label, beans) | 1:1 | 2000×2000 | `shop/<product-slug>-1.jpg` | bag mockup used meanwhile |
| P2 | og-default | Social sharing image | Wide photo of Urrao coffee hills (the hero photo works) with space on the left for the title | 1200×630 | 1200×630 | `og/default.jpg` | generated from hero photo |
| P2 | team-photo | Our story | The founding team in Urrao or Medellín | 3:2 | 2400×1600 | `story/team.jpg` | placeholder |
| P2 | journal-chiroso-cover | Journal article "What is Chiroso coffee?" | Chiroso cherries or a cup on a cupping table | 16:9 | 2400×1350 | `journal/chiroso.jpg` | placeholder |
| P2 | logo-svg | Header, footer, favicon, OG | Final logo as SVG + square icon (current bean mark is a placeholder mark) | — | vector | `brand/logo.svg`, `brand/icon.svg` | placeholder |

## Text and data the owner must provide

| Item | Where | Placeholder in code |
| --- | --- | --- |
| Contact email | `src/lib/site.ts`, footer, contact page, llms.txt | `[hello@yourdomain.com]` |
| WhatsApp number (Colombia, +57) | Floating button, contact page, shop checkout | `+57 300 000 0000` |
| Instagram / LinkedIn URLs | Footer, Organization `sameAs` | `#` |
| Final domain | `NEXT_PUBLIC_SITE_URL`, canonical URLs, sitemap, llms.txt | `http://localhost:3100` |
| Real lots, producers, products, prices | `src/data/*` → later Supabase | example data, labelled |
| Legal text (privacy, terms, derecho de retracto, PQRS) | `/privacy`, `/terms`, shop | draft marked for legal review |
| Shipping prices and free-shipping threshold | Shop, cart, product pages | COP 12,000 flat, free over COP 150,000 (example) |
| Sample policy and minimum order | Lot pages, For buyers | free 200 g sample, one 35 kg box (example) |

<!-- agents append rows below -->
| Legal entity name and NIT | `src/lib/site.ts` (`legal`), footer, privacy/terms, shop | `[Legal entity name]`, `[NIT 000.000.000-0]` |
| PQRS email | `src/lib/site.ts` (`contact.pqrsEmail`), shop, privacy | `pqrs@yourdomain.com` |
| Facebook URL | `src/lib/site.ts` (`social.facebook`), footer, Organization `sameAs` | empty |
| WhatsApp number (raw, international) | `src/lib/site.ts` (`whatsappNumber`), wa.me links | `+573000000000` |
| Real lot photos for URR-035, URR-028, URR-019 | `src/data/lots.ts` | existing stock photos reused |
| Producer stories, "coffee since" year, farm facts | `src/data/producers.ts` | story stubs marked for owner review |
| Cupping reports, moisture, packaging for each lot | `src/data/lots.ts` (`detail`) | only URR-024 has example values |
| Real shop products, brands, COP prices, sizes | `src/data/products.ts` | example data, labelled |
| P1 | farm-drying-beds-* | Producer profile farm gallery (one per producer: luz-mery-higuita, hernan-dario-restrepo, jhon-jairo-usuga) | Raised drying beds (camas africanas) with parchment coffee at that producer's farm, mountains behind | 4:3 landscape (tile crops to about 4:3) | 2400×1800 | `farms/<producer-slug>-drying.jpg` | placeholder |
| P1 | farm-map-* | Producer profile farm gallery (one per producer) | Static map of the farm area (no exact address) or illustrated map of Urrao with the farm zone marked | 4:3 landscape | 1600×1200 | `maps/<producer-slug>.png` | placeholder |
| P1 | producer-story-photo-* | Producer profile story section (currently the stock harvest photo `farmers-harvest.jpg` for all three) | The producer at work on their own farm, with their consent; replaces the stock harvest photo | 4:5 portrait (section crops to about 4:5 on desktop) | 1600×2000 | `producers/<producer-slug>.jpg` | stock photo shown meanwhile |
| P2 | producer-farm-gallery-* | Producer profile farm gallery: three photo tiles (hills, cherries, Urrao square) currently stock | Real photos of the producer's own farm: plants, cherries, the view | mixed: 1 tall, 2 landscape | 2400 px long side | `farms/<producer-slug>-1.jpg`…`-3.jpg` | stock photos shown meanwhile |
| P2 | producer-quote-* | Producer profile story quote | A real short quote from each producer, with consent | text | — | `src/components/producer/` dictionary `producerPage.story.quote` | placeholder text |
| P1 | lot-<code>-gallery-2..4 | Lot detail gallery (slots 2 to 4 of every lot; slot 1 uses the lot's card photo) | Green beans of the lot on a white tray; harvest at the farm; the farm in Urrao | 4:3 landscape (frame crops about 1.15:1 at 1440) | 2400×1800 | `lots/<code>-2.jpg`…`-4.jpg` | placeholder |
| P2 | lot-producer-photo | Lot detail producer block (all lots) | Producer at their farm among the coffee plants (currently a generic Urrao valley stock photo with generic alt text) | 4:3 landscape | 2400×1800 | `producers/<slug>-farm.jpg` | stock photo reused |
| P2 | lot-map-urrao | Lot detail producer block ("Map placeholder · Urrao, Antioquia" chip) | Small map or illustration of Urrao (same file as `farm-el-mirador-map`) | 1:1 | 1200×1200 | `maps/urrao.png` | placeholder text chip |
| P1 | product-photos-<slug>-1..3 | Product detail gallery (3 labelled placeholders per product: front, back label, whole beans) | Real bag photos per product on a neutral background | 1:1 | 2000×2000 | `shop/<product-slug>-1.jpg`…`-3.jpg` | placeholder (bag mockup used meanwhile) |
| P2 | product-reviews | Product page (no slot rendered yet) | Real customer reviews only; add a reviews block when real ones exist, no fake ratings | — | — | — | not built |
| Shipping times by city, returns window (5 business days), coffee club price COP 59,000 | Shop, product page, JSON-LD (OfferShippingDetails, MerchantReturnPolicy) | example values, labelled; derecho de retracto and PQRS text pending legal review |
| Real WhatsApp number for shop orders | `src/lib/site.ts`, cart checkout, club and quiz links | `+573000000000` |

## T2.7 placeholders (regions, story)

| Priority | assetId | Where it is used | What should be there | Orientation / ratio | Min size | File name | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | urrao-region-map | /regions/urrao "Find Urrao" | Map of Urrao and the Páramo del Sol in brand greens, municipality outline, pins for partner farms (no farm GPS without consent) | 4:1 landscape | 2400×600 | `regions/urrao-map.png` | placeholder |
| P2 | team-portraits | /our-story team (3 slots) | Portrait of each team member, natural light, shoulders up, looking at camera, with consent | 4:5 portrait | 1600×2000 | `story/team-<name>.jpg` | placeholder |
| P3 | journal-article-photos | /journal and 3 articles (currently reuse home photos) | One original photo per article: Chiroso cherries up close, a green-coffee sample table, Urrao landscape at dawn | 16:9 landscape | 2400×1350 | `journal/<slug>.jpg` | stock reuse |
| P2 | publication-dates | Article JSON-LD and banner | Real publication dates (drafted 2026-11-13) | n/a | n/a | `src/components/journal/articles.ts` | placeholder |

## T3.1 SEO additions
- `sameAs` links: owner to fill `site.social.instagram`, `linkedin`, `facebook` in `src/lib/site.ts`; Organization JSON-LD in the layout picks them up (empty today). Also the real `NEXT_PUBLIC_SITE_URL` for production canonicals, sitemap and robots.
- Organization `logo` uses `/images/bean-brown.png` as a stand-in; owner to provide the final logo file (square PNG or SVG, at least 112x112 px).
- OG images are generated (no photo needed). Optional upgrade: a real farm photo (1200x630, under 300 KB) as the background of `src/lib/seo/og.tsx`; real bag photos for roasted `Product.image`.
- Dictionary `meta` default description and `nav.forBuyers` label are copy for owner review.
