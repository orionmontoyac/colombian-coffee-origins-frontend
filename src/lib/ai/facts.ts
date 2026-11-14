import type { Locale } from "@/app/[lang]/dictionaries";
import { lots } from "@/data/lots";
import { products } from "@/data/products";
import { site } from "@/lib/site";

/**
 * Canonical facts. The site copy, /llms.txt, /llms-full.txt, /md/* and the JSON-LD builders read
 * from here (or must match it). tests/e2e/facts.spec.ts checks that they agree.
 * All lots, producers and prices are EXAMPLE DATA (see src/data/lots.ts).
 */
export const CONTENT_UPDATED = "2026-11-13";
export const SAMPLE_GRAMS = 200;

const prices = lots.flatMap((l) => (l.priceUsdPerKg === null ? [] : [l.priceUsdPerKg]));
const copPrices = products.map((p) => p.sizes[0].priceCop);
const altitudes = lots.map((l) => l.altitudeM);

const nf = (lang: Locale, n: number, digits = 0) =>
  new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);

export const facts = {
  name: site.name,
  origin: "Urrao, Antioquia, Colombia",
  town: "Urrao",
  department: "Antioquia",
  country: "Colombia",
  greenCurrency: "USD",
  greenUnit: "kg",
  incoterm: "FOB",
  roastedCurrency: "COP",
  minOrderKg: Math.min(...lots.map((l) => l.minOrderKg)),
  sampleGrams: SAMPLE_GRAMS,
  lotCount: lots.length,
  pricedLotCount: prices.length,
  usdMin: Math.min(...prices),
  usdMax: Math.max(...prices),
  copMin: Math.min(...copPrices),
  copMax: Math.max(...copPrices),
  altitudeMin: Math.min(...altitudes),
  altitudeMax: Math.max(...altitudes),
  varieties: [...new Set(lots.map((l) => l.variety))],
  harvestYear: "2026",
} as const;

/** Language-dependent canonical phrases. Keep wording identical wherever they appear. */
export function phrases(lang: Locale) {
  const es = lang === "es";
  const usdRange = `USD ${nf(lang, facts.usdMin, 2)} ${es ? "a" : "to"} ${nf(lang, facts.usdMax, 2)} ${es ? "por kg" : "per kg"}`;
  const copRange = `COP ${nf(lang, facts.copMin)} ${es ? "a" : "to"} ${nf(lang, facts.copMax)}`;
  return {
    name: facts.name,
    origin: facts.origin,
    /** Two-line summary used by llms.txt and the home answer-first block */
    summary: es
      ? `${facts.name} conecta a tostadores y amantes del café con fincas familiares de ${facts.origin}: lotes de café verde para tostadores de todo el mundo, en USD por kg FOB y con muestras gratis, y café tostado de las marcas propias de los productores, enviado solo dentro de Colombia en COP.`
      : `${facts.name} connects roasters and coffee lovers with family farms in ${facts.origin}: green coffee lots for roasters worldwide, priced in USD per kg FOB with free samples, and roasted coffee from the producers' own brands, shipped inside Colombia only and priced in COP.`,
    greenLine: es
      ? `Café verde: lotes trazables para tostadores, importadores y cafeterías de todo el mundo, en USD por kg FOB.`
      : `Green coffee: traceable lots for roasters, importers and coffee shops worldwide, priced in USD per kg FOB.`,
    roastedLine: es
      ? `Café tostado: bolsas de las marcas propias de los productores, enviadas solo dentro de Colombia, en COP.`
      : `Roasted coffee: bags from the producers' own brands, shipped inside Colombia only, priced in COP.`,
    minOrder: es ? `${facts.minOrderKg} kg (una caja)` : `${facts.minOrderKg} kg (one box)`,
    sample: es
      ? `Muestra gratis de ${facts.sampleGrams} g para compradores verificados`
      : `Free ${facts.sampleGrams} g sample for verified buyers`,
    shipsGreen: es ? "Todo el mundo (café verde)" : "Worldwide (green coffee)",
    shipsRoasted: es ? "Solo en Colombia (café tostado)" : "Colombia only (roasted coffee)",
    priceUnit: es ? "USD por kg, FOB Colombia" : "USD per kg, FOB Colombia",
    usdRange,
    copRange,
    altitudeRange: `${nf(lang, facts.altitudeMin)}–${nf(lang, facts.altitudeMax)} m`,
    harvest: es ? "Cosecha principal 2026" : "2026 main crop",
    exampleNote: es
      ? "Lotes, productores y precios son datos de ejemplo para esta vista previa, no ofertas reales."
      : "Lots, producers and prices are example data for this preview, not real offers.",
    updated: es ? `Actualizado ${CONTENT_UPDATED}` : `Updated ${CONTENT_UPDATED}`,
  };
}
export const num = nf;
