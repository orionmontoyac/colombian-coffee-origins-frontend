# design/ — exported Claude Design boards

Read-only references for the page builders. Exported 2026-11-13 from the Claude Design canvas "Colombian Coffee Origins — Home Page Design".

| Board file | Page | Notes |
| --- | --- | --- |
| `boards/Main.dc.html` | Home (desktop) | Already built in code; use for polish (T2.8) |
| `boards/Lots.dc.html` | Green coffee lots catalog | T2.1 |
| `boards/Lot.dc.html` | Lot detail (URR-024) | T2.2 |
| `boards/Producer.dc.html` | Producer profile (Luz Mery Higuita) | T2.3 |
| `boards/Shop.dc.html` | Roasted coffee shop (Colombia) | T2.4 |

How to read a board: the markup inside `<x-dc>` is the page; inline styles give exact sizes, spacing and colors. **Map every color to a DESIGN.md token; never copy hex values into components.** `{{…}}` placeholders and `<sc-for>` loops are filled from the `renderVals()` data at the bottom of each file — that data is the example content to use. Fonts in the boards are the final ones (Vollkorn, Fira Sans, Ubuntu).

## Images referenced as `/_blob/<id>`

| Blob id | Repo file to use |
| --- | --- |
| `d5d2cd8a…` | `src/assets/home/hero-coffee-hills.jpg` (hero) |
| `355d41ff…` | `src/assets/home/lot-chiroso-cherries.jpg` (cherries; CTA panel background) |
| `c6fbd193…` | `src/assets/home/lot-castillo-producer.jpg` |
| `c8fa79cf…` | `src/assets/home/lot-pink-bourbon-producer.jpg` |
| `fa0a0041…` | `src/assets/home/farmers-harvest.jpg` (also stands in for Luz Mery until her real photo — see ASSETS.md) |
| `044f4ea3…` | `src/assets/home/urrao-main-square.jpg` |
| `9e856a47…` | `src/assets/home/coffee-branch-sketch.png` |
| `2a9e6e6c…` | `src/assets/home/moka-pot-sketch.png` |
| `e683b395…` | `src/assets/home/coffee-beans-pattern.png` (brown on parchment) |
| `0913480f…` | `design/assets/beans-caramel.png` → copy to `src/assets/shop/` (caramel bean pattern for dark brown panels) |
| `c580fea1…` | `design/assets/bean-brown.png` → `src/assets/shop/` (single bean icon, brown) |
| `9b140b43…` | `design/assets/bean-white.png` → `src/assets/shop/` (single bean icon, white) |
| `9c21cc07…` | old watercolor banner, hidden in the design — not used |
