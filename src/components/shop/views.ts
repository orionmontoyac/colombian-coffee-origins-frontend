import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import {
  defaultSize,
  getBrand,
  pricePerKgCop,
  roastLabels,
  tagLabels,
  type GrindOption,
  type Product,
  type ProductTag,
} from "@/data/products";
import { uiLabels } from "@/components/ui/labels";
import { productHref } from "@/lib/routes";
import { fill, formatCop, formatPerKg } from "./format";

/** Tag pill colors on the product card, from the Shop board (all brown-line tokens). */
const tagTone: Record<ProductTag, string> = {
  bestSeller: "bg-roast text-on-primary",
  bestValue: "bg-roast-dark text-on-primary",
  limited: "bg-neutral text-roast",
  ground: "bg-neutral text-roast-dark",
  microLot: "bg-roast-dark text-on-primary",
  new: "bg-caramel text-roast-dark",
  familyFarm: "bg-neutral text-roast-dark",
  forEspresso: "bg-neutral text-roast-dark",
};

export type RoastGroup = "light" | "medium" | "dark";
export const roastGroup = (level: number): RoastGroup => (level <= 2 ? "light" : level <= 4 ? "medium" : "dark");
export const isPreGround = (p: Product) => !p.grindOptions.includes("wholeBean");

/** Everything the (client) catalog needs for one product, already localized. */
export type ProductView = {
  slug: string;
  brandSlug: string | null;
  brand: string;
  name: string;
  meta: string;
  notes: string;
  tag: { label: string; className: string };
  bag: { color: string; stage: string; label: string; roastLabel: string; size: string };
  roast: { level: 1 | 2 | 3 | 4 | 5; label: string; hint: string };
  price: string;
  pricePerKg: string;
  href: string;
  priceCop: number;
  roastGroup: RoastGroup;
  ground: boolean;
  defaultGrind: GrindOption;
  grams: number;
};

export function toProductView(p: Product, lang: Locale, dict: Dictionary): ProductView {
  const size = defaultSize(p);
  const brand = p.brandSlug ? getBrand(p.brandSlug) : undefined;
  const town = brand?.place ?? "Urrao";
  const filters = dict.shopPage.catalog.filters;
  const grindLabel = isPreGround(p) ? filters.ground : filters.wholeBean;
  const roastLabel = roastLabels[p.roastLevel][lang];
  const grams = `${size.grams} g`;
  return {
    slug: p.slug,
    brandSlug: p.brandSlug,
    brand: p.brand,
    name: p.name[lang],
    meta: `${town} · ${grindLabel} · ${grams}`,
    notes: p.notes[lang],
    tag: { label: tagLabels[p.tag][lang], className: tagTone[p.tag] },
    bag: { color: p.bag, stage: p.stage, label: p.labelBrand, roastLabel, size: grams },
    roast: {
      level: p.roastLevel,
      label: roastLabel,
      hint: fill(uiLabels[lang].roastHint, { label: roastLabel, level: p.roastLevel }),
    },
    price: formatCop(size.priceCop, lang),
    pricePerKg: formatPerKg(pricePerKgCop(size), lang),
    href: productHref(lang, p.slug),
    priceCop: size.priceCop,
    roastGroup: roastGroup(p.roastLevel),
    ground: isPreGround(p),
    defaultGrind: p.grindOptions[0],
    grams: size.grams,
  };
}
