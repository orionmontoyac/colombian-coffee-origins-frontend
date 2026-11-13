# ASSETS.md — placeholders and what belongs there

Every `PlaceholderImage` in the code has an `assetId` listed here. Agents append rows; the owner replaces placeholders with real files (drop them in `src/assets/<area>/` with the given file name and remove the row's placeholder note).

Photo rules for all real photos: real people and places from Urrao (no stock photos from other countries), natural light, people's consent to appear, at least 2400 px on the long side, JPG quality ≥ 85, no text on the image.

| Priority | assetId | Where it is used | What should be there | Orientation / ratio | Min size | File name | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | lot-urr-024-gallery-1..4 | Lot detail gallery | Chiroso cherries on the branch, drying beds with this lot, the producer picking, green beans close-up on a white tray | 4:3 landscape | 2400×1800 | `lots/urr-024-1.jpg`…`-4.jpg` | placeholder |
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
