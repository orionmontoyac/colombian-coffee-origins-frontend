---
version: alpha
name: Origin Ledger
description: Design system for Colombian Coffee Origins, a platform that sells green coffee lots from Colombian family farms to roasters worldwide and a Colombia-only shop of roasted coffee made by the producers themselves. Light theme only.
colors:
  primary: "#0B3D2A"
  primary-raised: "#1F4C3B"
  primary-hover: "#0F5A3C"
  on-primary: "#FFFFFF"
  on-primary-muted: "#9FC4AE"
  on-primary-body: "#D6E6DB"
  accent: "#6FD13B"
  accent-hover: "#8ADB5E"
  on-accent: "#0B3D2A"
  success: "#13803A"
  error: "#A3352A"
  neutral: "#FFFFFF"
  surface: "#F6F4EA"
  surface-sunken: "#E7E3D3"
  placeholder: "#D9CBB4"
  line: "#CFE0D3"
  ink: "#0E2A1F"
  body: "#3E5448"
  muted: "#5B6F63"
  roast: "#7A4A2B"
  roast-dark: "#3B2416"
  roast-hover: "#5E3820"
  caramel: "#E9B57D"
  on-roast-body: "#EAD9C6"
  roast-surface: "#F5ECE2"
  roast-line: "#E5D3C1"
  roast-body: "#5A4636"
typography:
  display-hero:
    fontFamily: Vollkorn
    fontSize: 160px
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Vollkorn
    fontSize: 64px
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Vollkorn
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Vollkorn
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
  headline-sm:
    fontFamily: Vollkorn
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
  stat-value:
    fontFamily: Vollkorn
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.1
  body-lg:
    fontFamily: Fira Sans
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.5
  body-md:
    fontFamily: Fira Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Fira Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Ubuntu
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  label-caps:
    fontFamily: Ubuntu
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.08em
  nav-caps:
    fontFamily: Ubuntu
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em
rounded:
  sm: 10px
  md: 16px
  lg: 24px
  xl: 32px
  notch: 28px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 56px
  page-margin: 16px
  panel-padding: 48px
  section-gap: 56px
  tap-target: 44px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "{spacing.page-margin}"
  banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-xl}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-padding}"
  banner-description:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary-body}"
    typography: "{typography.body-lg}"
  banner-meta:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary-muted}"
    typography: "{typography.body-sm}"
  header-notch:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.notch}"
    height: 56px
  nav-pill:
    backgroundColor: "{colors.primary-raised}"
    textColor: "{colors.on-primary}"
    typography: "{typography.nav-caps}"
    rounded: "{rounded.full}"
  nav-pill-active:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.nav-caps}"
    rounded: "{rounded.full}"
  hero-wordmark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-hero}"
  stat-box:
    backgroundColor: "{colors.primary-raised}"
    textColor: "{colors.on-primary}"
    typography: "{typography.stat-value}"
    rounded: "{rounded.md}"
    padding: 16px
  stat-box-accent:
    backgroundColor: "{colors.primary-raised}"
    textColor: "{colors.accent}"
    typography: "{typography.stat-value}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 52px
    padding: 24px
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: "{spacing.tap-target}"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
  button-on-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
  button-on-dark-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  eyebrow:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.success}"
    typography: "{typography.label-caps}"
  section-heading:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-lg}"
  section-body:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-title:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.headline-md}"
  card-meta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  card-divider:
    backgroundColor: "{colors.line}"
    height: 1px
  image-placeholder:
    backgroundColor: "{colors.placeholder}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    rounded: "{rounded.lg}"
  filter-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  chip:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
  chip-score:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.accent}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.sm}"
  chip-verified:
    backgroundColor: "{colors.roast}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.full}"
  input:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    height: 52px
  input-error:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.error}"
    typography: "{typography.body-sm}"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "{spacing.sm}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary-body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-padding}"
  shop-banner:
    backgroundColor: "{colors.roast-dark}"
    textColor: "{colors.on-primary}"
    typography: "{typography.headline-xl}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-padding}"
  shop-banner-accent:
    backgroundColor: "{colors.roast-dark}"
    textColor: "{colors.caramel}"
    typography: "{typography.headline-xl}"
  shop-banner-description:
    backgroundColor: "{colors.roast-dark}"
    textColor: "{colors.on-roast-body}"
    typography: "{typography.body-lg}"
  shop-panel:
    backgroundColor: "{colors.roast-surface}"
    textColor: "{colors.roast-dark}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-padding}"
  shop-panel-body:
    backgroundColor: "{colors.roast-surface}"
    textColor: "{colors.roast-body}"
    typography: "{typography.body-md}"
  shop-card-divider:
    backgroundColor: "{colors.roast-line}"
    height: 1px
  button-shop:
    backgroundColor: "{colors.roast}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    height: 48px
  button-shop-hover:
    backgroundColor: "{colors.roast-hover}"
    textColor: "{colors.on-primary}"
  button-shop-on-dark:
    backgroundColor: "{colors.caramel}"
    textColor: "{colors.roast-dark}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
---

# Colombian Coffee Origins — Design System (Origin Ledger)

This file is the **single source of truth** for the site's design: the YAML front matter holds the tokens (normative values), and the sections below explain how to use them. Read it before building or changing any UI, page, component, layout, styling, Tailwind class, `globals.css`, or on-screen copy. Tokens in code live in `src/app/globals.css` and must match this file; if they disagree, this file wins and the code gets fixed.

Format: [Google DESIGN.md](https://github.com/google-labs-code/design.md). Check it with `npx -y @google/design.md@latest lint DESIGN.md` after every change.

## Overview

**Origin Ledger.** The site reads like a well-kept farm ledger from Urrao: the deep green of a shaded coffee canopy, paper the color of dried parchment coffee, and one fresh-leaf lime that marks every action. It is warm and agricultural without being rustic, and trustworthy without being corporate. Buyers should feel, in the first second, that they are looking at *real coffee from named people in a real place* — not at a coffee brand.

The product has **two lines that must never blur**:

- **Green coffee lots** for roasters and importers worldwide. Identity: canopy green + leaf lime. Prices in USD per kg.
- **Roasted coffee shop**, Colombia only, bags roasted by the producers. Identity: roast brown + caramel. Prices in COP.

A page or section belongs to exactly one line. Green is the platform; brown always means "the shop".

**What this system gives up, on purpose:**
- **Dark mode.** The site is light only; the dark surfaces are deliberate banners and panels, not a theme.
- **Shadows and depth effects.** Hierarchy comes from tone and the notched cut-outs, not elevation.
- **Decoration.** No gradients beyond the banner's soft light streak, no glassmorphism, no stock icons in tinted squares. The only illustrations are hand-drawn sketches (coffee branch, moka pot) and the user's own coffee-bean pattern and icon.
- **Density.** Big type, generous rounded panels and few items per row. This is a catalog people browse, not a trading terminal.

Light theme only. Bilingual (English default, Spanish at `/es`). Source of truth for visuals is the Claude Design canvas: `Main`, `Lots`, `Lot`, `Producer`, `Shop` (`Mobile` is outdated).

## Colors

Every color names something from the coffee itself.

**Platform (green line)**
- **Canopy green (`primary`, #0B3D2A):** the shade under a coffee canopy at 2,000 m. Banners, footer, headings on light, and the text color on lime. It is dark enough to carry white text at any size.
- **Canopy raised (`primary-raised`, #1F4C3B):** white at 8% over canopy green. Only for stat boxes and inactive nav pills sitting *on* a green banner.
- **Canopy hover (`primary-hover`, #0F5A3C):** hover state for dark buttons.
- **Leaf flush (`accent`, #6FD13B):** the bright new leaves at the tip of a coffee branch. **Its one job is action**: primary buttons, the SCA score, and one italic accent word per heading on dark green. Keep it under 5% of any screen. Never lime text on white or cream — it fails contrast and stops meaning "action".
- **Mist (`on-primary-body`, #D6E6DB)** and **Sage mist (`on-primary-muted`, #9FC4AE):** body and secondary text on canopy green. Never plain grey on green.
- **Ripe cherry (`error`, #A3352A):** the red of a ripe coffee cherry, used for errors only.
- **Shade-grown green (`success`, #13803A):** eyebrows and confirmations on light backgrounds.

**Paper and ink**
- **White (`neutral`):** page background and the header notches, which must match the page exactly so the cut-out reads as a hole in the banner.
- **Parchment (`surface`, #F6F4EA):** dried parchment coffee. Cards, filter bars, quiet panels.
- **Jute (`surface-sunken`, #E7E3D3):** neutral chips such as "Registered".
- **Drying bed (`placeholder`, #D9CBB4):** photo placeholders, always labelled.
- **Ink (`ink`, #0E2A1F)**, **Body (`body`, #3E5448)**, **Muted (`muted`, #5B6F63):** text on light. All are tinted green; there are no neutral greys in this system.
- **Leaf line (`line`, #CFE0D3):** borders and outline buttons on light.

**Roasted shop (brown line)**
- **Medium roast (`roast`, #7A4A2B):** shop buttons, "Coffee verified" badges, the CO pill, the roast meter.
- **Dark roast (`roast-dark`, #3B2416):** shop banner and headings on light shop surfaces.
- **Panela (`caramel`, #E9B57D):** the shop's accent, doing for brown what lime does for green: one italic word per heading and the key stat on dark brown, plus the CTA on dark brown panels.
- **Crema (`roast-surface`, #F5ECE2)**, **Kraft line (`roast-line`, #E5D3C1)**, **Roast body (`roast-body`, #5A4636)**, **Roast mist (`on-roast-body`, #EAD9C6):** shop panels, borders and text.

Product-card "stage" colors behind each bag (soft tints of the bag color) are **content, not tokens**: each producer brand chooses its bag color.

## Typography

Three families, each with one job. The font files live in `src/fonts/` and load through `next/font/local` in `src/app/[lang]/layout.tsx`.

- **Vollkorn** (serif, `font-display`) is for titles and headers: every heading, the home hero wordmark, and every number a buyer compares (scores, altitude, prices). Weight 600 for a heading, with **one word or phrase in italic 400**, usually in the accent color: "Green coffee *lots*", "Roasted coffee, *straight from the farm*". The italic is the system's voice; one per heading, never more. The hero wordmark is the same face at 800 italic, and it appears only there.
- **Fira Sans** (humanist sans, `font-sans`, the default) is for reading: body copy, descriptions, tasting notes, table values, form text. Weights 400 and 600; italic 400 only for short notes, such as tasting notes on a product card.
- **Ubuntu** (`font-label`) is for labels: buttons, chips and badges, the header pill navigation, eyebrows, filter pills and footer column titles. Weight 500 for labels and buttons, 700 only for the active nav pill. Ubuntu has no 600, so never pair `font-label` with `font-semibold`.

A serif that talks, a sans that reads and a rounded sans that labels: the three differ in character, so no two of them compete in the same role. Don't add a fourth family.

The scale is hand-tuned at the display end. Large headings get negative tracking (-0.02em at 64px); uppercase labels get positive tracking (0.08em eyebrows, 0.05em nav). Line height drops as size grows: 1.5 for body, 1.02 for the 64px banner title.

| Token | Use |
| --- | --- |
| `headline-xl` 64px | Banner H1 on every sub-page |
| `headline-lg` 44px | Section H2 |
| `headline-md` 28px | Card titles, lot names |
| `headline-sm` 22px | Small card titles, logo, score chip |
| `stat-value` 28px | Numbers in stat boxes |
| `body-lg` 19px | Banner description (one line) |
| `body-md` 16px | Default body |
| `body-sm` 14px | Meta, captions, notes |
| `label-md` 15px | Buttons, filters (Ubuntu 500) |
| `label-caps` 13px | Eyebrows and chips, uppercase (Ubuntu 500) |
| `nav-caps` 12px | Header pill navigation, uppercase (Ubuntu 500, active 700) |

## Layout

The page is a **white sheet with rounded panels laid on it**. A 16px margin surrounds everything, and every panel and section aligns exactly with the header notches on the left and right. Nothing is wider or narrower than the banner.

- **Spacing base 4px.** Steps: 4, 8, 12, 16, 24, 32, 48, 56.
- **Colored panels** (banners, shop panel, CTA, footer): 48px side padding.
- **Plain white sections:** 56px top, 8px bottom (or 48px top on tight pages).
- **Grids:** 4 columns for product cards, 3 for lot cards and steps, 6 for producer brands, 2 for split story sections. Gaps 16–24px.
- **Breakpoints:** `nav` at 1320px (below it the pill menu collapses into a menu button) and `wide` at 1360px (home hero cards tuck into the banner cut-outs).
- **Tap targets** are at least 44px.

### Sub-page banner (identical on every sub-page)
1. Notched header.
2. Breadcrumb row (15px). Detail pages add a back button on the right ("← All lots").
3. One non-wrapping row: on the left, chips, then the 64px H1, then one 19px description line; on the right, **exactly three stat boxes**, aligned to the bottom of the text.

## Elevation & Depth

Depth is **tonal and cut-out**, never shadow.

- Three tonal layers: white page → parchment or crema panels → canopy green or dark roast banners.
- On dark banners, raised elements (stat boxes, inactive nav pills) use `primary-raised`, a slightly lighter green, not a shadow.
- **The notch is the signature:** white notches cut into the top of the banner (logo on the left, actions on the right). Their concave corners are drawn with "ears", 28px squares with a radial gradient (`.ear-br`, `.ear-bl`, `.ear-tr`, `.ear-tl`). The home hero repeats the cut-out at the bottom, where the business-line cards tuck in. Those pieces fit like a puzzle: an even 16px white gap all around each card; the cut's inner corner is the card's radius plus the gap (28px + 16px = 44px) so the two curves run parallel; and the cut is 72px tall, the 44px corner plus the 28px rounded corner of the banner tab below it, so the curves join in one smooth S with no spike.
- The only shadow allowed is under the product bag mockup, so the bag stands on its stage: `0 18px 30px` in canopy green at 18%. Never neutral black.

## Shapes

Radius is hierarchical: the bigger the container, the rounder it is.

| Token | Value | Use |
| --- | --- | --- |
| `xl` | 32px | Page-level panels: banners, sections, CTA, footer |
| `notch` | 28px | Header notches and ear corners only |
| `lg` | 24px | Cards, filter bars, image frames |
| `md` | 16px | Stat boxes, inner tiles |
| `sm` | 10px | Bag labels, score chip, tooltips |
| `full` | pill | Buttons, chips, nav, inputs |

Nothing is square-cornered. Nothing uses a radius outside this list.

## Components

- **Notched header.** Menu order on every page: Home · Green Coffee · Shop (CO pill) · Producers · Our Story. The active item is a white pill (`nav-pill-active`); others use `nav-pill`. The right notch holds the language button (globe + EN + chevron) and **Request Samples** (`button-primary`). On the shop it holds **Cart** (`button-shop`) instead.
- **Buttons.** `button-primary` is lime and means "do the main thing" (request samples, view lot); one per view where possible. `button-secondary` is the outline in canopy green. `button-on-dark` is used on banners. Shop actions use `button-shop` (Add, Add to cart) and `button-shop-on-dark` (caramel, on dark brown).
- **Stat box.** Label in `on-primary-muted`, value in `stat-value`. Only one value per row uses `stat-box-accent`.
- **Chips.** Trust levels progress from **Registered** (`chip`) to **Farm verified** to **Coffee verified** (`chip-verified`, brown). `chip-score` shows the SCA score: lime number on canopy green. The **CO** pill (brown) marks anything Colombia-only.
- **Lot card** (`card`). Photo with the lot code and score chips; trust badge; "Variety · *Process*" title; tasting notes; Altitude and Available table divided by `card-divider`; price in USD per kg; **View lot**.
- **Product card** (shop). Bag mockup on a stage tinted with the bag color; white label with the coffee-bean icon; brand eyebrow; product name; meta; notes in italic; **roast meter** of five bean icons (full opacity for the roast level, 22% for the rest, with a text label for screen readers); price in COP plus price per kg; **Add +**.
- **Filter bar.** Sticky, parchment (or crema in the shop), pill filters, a result count, and the sort control on the right.
- **CTA panel.** Canopy green fading over the coffee cherries photo on the right; lime primary plus outline secondary.
- **Footer.** Canopy green panel with the logo and tagline, four link columns plus "Get in touch", and a bottom bar with Privacy, Terms and EN · ES.
- **Inputs.** Pill-shaped, white, 52px tall; error text in ripe cherry below the field, never a red-filled field.

## Do's and Don'ts

- **Do** keep each page or section in one line: green *or* brown. **Don't** put a lime button on a brown panel or a brown button on a green banner.
- **Do** use lime only for actions, scores and one accent word on dark green. **Don't** set lime text on white or parchment, and don't use lime as a section background.
- **Do** write headings with exactly one italic accent phrase. **Don't** italicize two phrases or a whole heading.
- **Do** align every panel with the header notches. **Don't** add a section with its own max-width or extra side margin.
- **Do** show exactly three stat boxes in a sub-page banner. **Don't** let them wrap under the text.
- **Don't** add drop shadows to cards, panels or buttons. Use a tone step or a `line` border instead.
- **Don't** introduce a radius outside the shape scale (no 12px, 14px or 20px "just this once").
- **Don't** use neutral greys (#808080 family); use `muted`, `body` or `roast-body`.
- **Don't** use stock photos from other countries or generic coffee imagery. Use real photos from Urrao or a labelled placeholder.
- **Don't** add icons in tinted rounded squares. The only icons are line icons (globe, chevron, cart, heart) and the user's coffee-bean icon.
- **Do** name the producer, farm and town wherever a coffee appears.
- **Do** format prices as `USD 18.50 / kg` (green) and `COP 68,000` in English or `$68.000` in Spanish (shop), always with price per kg in the shop.
- **Do** mark Colombia-only content with the CO pill and wrap it in `<OnlyInCountry country="CO">`.
- **Do** label example data as example ("Example products for this design preview").
- **Do** set every button, chip, nav item and eyebrow in `font-label` (Ubuntu). **Don't** set body text or headings in Ubuntu.
- **Don't** animate on scroll. Only hover lifts on cards (translateY -4px, 200ms ease) and color changes on buttons move.

## Assets

| Asset | Use |
| --- | --- |
| Urrao watercolor banner | Home hero only |
| Coffee branch sketch | Green-line card on the home page |
| Moka pot sketch | Roasted-line card, "Not sure which to pick?" |
| Coffee-bean pattern (`coffe-beans-pattern.svg`) | Story section (brown on parchment), shop banner and coffee club (caramel on dark roast) |
| Coffee-bean icon (`coffe-bean.svg`) | Every single-bean icon: shop perks, brand circles, bag-label logo, roast meter |
| Real photos (farmers, cherries, Urrao square) | Producer and lot content |

## Pages

| Page | Canvas board | In code |
| --- | --- | --- |
| Home | `Main` | Partly (needs the two-line restructure) |
| Green coffee lots | `Lots` | Not yet |
| Lot detail | `Lot` | Not yet |
| Producer profile | `Producer` | Not yet |
| Roasted coffee shop (CO only) | `Shop` | Not yet |
| Mobile | `Mobile` | Outdated; redo after desktop is final |
