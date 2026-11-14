import type { Locale } from "@/app/[lang]/dictionaries";

/**
 * EXAMPLE DATA (from the Shop board). Brands, products and prices are
 * illustrative, not real offers. Prices are integer Colombian pesos (the shop
 * sells inside Colombia only). Raw hex colours are allowed in src/data: they
 * paint the bag drawing and its soft background. Replace with Supabase records.
 */
type L10n<T> = Record<Locale, T>;

export type RoastLevel = 1 | 2 | 3 | 4 | 5;
export type GrindOption = "wholeBean" | "espresso" | "moka" | "filter" | "frenchPress";
export type ProductTag = "bestSeller" | "bestValue" | "limited" | "ground" | "microLot" | "new" | "familyFarm" | "forEspresso";

export const tagLabels: Record<ProductTag, L10n<string>> = {
  bestSeller: { en: "Best seller", es: "Más vendido" },
  bestValue: { en: "Best value", es: "Mejor precio" },
  limited: { en: "Limited", es: "Edición limitada" },
  ground: { en: "Ground", es: "Molido" },
  microLot: { en: "Micro-lot", es: "Microlote" },
  new: { en: "New", es: "Nuevo" },
  familyFarm: { en: "Family farm", es: "Finca familiar" },
  forEspresso: { en: "For espresso", es: "Para espresso" },
};

export const roastLabels: Record<RoastLevel, L10n<string>> = {
  1: { en: "Light roast", es: "Tostión clara" },
  2: { en: "Light roast", es: "Tostión clara" },
  3: { en: "Medium roast", es: "Tostión media" },
  4: { en: "Medium-dark roast", es: "Tostión media-oscura" },
  5: { en: "Dark roast", es: "Tostión oscura" },
};

export type Brand = {
  slug: string;
  name: string;
  place: string;
  /** Number of coffees shown on the Shop board (example) */
  coffeeCount: number;
  /** Producer profile slug, when the brand belongs to one of the profiled producers */
  producerSlug: string | null;
  /** Brand colour on the shop's brand strip */
  color: string;
};

export type ProductSize = { grams: number; priceCop: number };

export type Product = {
  slug: string;
  /** null when the brand is not on the Shop board strip (Santa Isabel) */
  brandSlug: string | null;
  /** Brand as printed on the product card */
  brand: string;
  /** Short brand name printed on the bag drawing */
  labelBrand: string;
  producerSlug: string | null;
  name: L10n<string>;
  notes: L10n<string>;
  /** 1 (light) to 5 (dark) */
  roastLevel: RoastLevel;
  /** Pre-ground products only offer the grind they are sold in */
  grindOptions: GrindOption[];
  /** First size is the default */
  sizes: ProductSize[];
  tag: ProductTag;
  /** Bag colour and the soft background behind it */
  bag: string;
  stage: string;
};

export const brands: Brand[] = [
  { slug: "el-mirador", name: "Café El Mirador", place: "Urrao", coffeeCount: 3, producerSlug: "luz-mery-higuita", color: "#7A4A2B" },
  { slug: "la-esperanza", name: "La Esperanza", place: "Urrao", coffeeCount: 2, producerSlug: "hernan-dario-restrepo", color: "#0B3D2A" },
  { slug: "los-naranjos", name: "Los Naranjos", place: "Urrao", coffeeCount: 4, producerSlug: "jhon-jairo-usuga", color: "#C9877A" },
  { slug: "alto-penderisco", name: "Alto Penderisco", place: "Urrao", coffeeCount: 3, producerSlug: null, color: "#3E5448" },
  { slug: "la-cumbre", name: "Finca La Cumbre", place: "Urrao", coffeeCount: 2, producerSlug: null, color: "#B0763F" },
  { slug: "dona-gloria", name: "Doña Gloria", place: "Urrao", coffeeCount: 3, producerSlug: null, color: "#5B3A6B" },
];

const whole: GrindOption[] = ["wholeBean", "espresso", "moka", "filter", "frenchPress"];
const preGround: GrindOption[] = ["filter"];

export const products: Product[] = [
  {
    slug: "el-mirador-chiroso", brandSlug: "el-mirador", brand: "Café El Mirador", labelBrand: "El Mirador",
    producerSlug: "luz-mery-higuita", name: { en: "Chiroso Washed", es: "Chiroso lavado" },
    notes: { en: "Jasmine, white peach, panela", es: "Jazmín, durazno blanco, panela" },
    roastLevel: 1, grindOptions: whole, sizes: [{ grams: 340, priceCop: 68000 }], tag: "bestSeller",
    bag: "#7A4A2B", stage: "#EFE6D6",
  },
  {
    slug: "la-esperanza-castillo", brandSlug: "la-esperanza", brand: "Tostado La Esperanza", labelBrand: "La Esperanza",
    producerSlug: "hernan-dario-restrepo", name: { en: "Castillo Honey", es: "Castillo honey" },
    notes: { en: "Red apple, caramel, cacao", es: "Manzana roja, caramelo, cacao" },
    roastLevel: 3, grindOptions: whole, sizes: [{ grams: 340, priceCop: 48000 }], tag: "bestValue",
    bag: "#0B3D2A", stage: "#E3EDD2",
  },
  {
    slug: "los-naranjos-pink-bourbon", brandSlug: "los-naranjos", brand: "Los Naranjos Coffee", labelBrand: "Los Naranjos",
    producerSlug: "jhon-jairo-usuga", name: { en: "Pink Bourbon Natural", es: "Pink Bourbon natural" },
    notes: { en: "Strawberry, hibiscus, red wine", es: "Fresa, flor de Jamaica, vino tinto" },
    roastLevel: 2, grindOptions: whole, sizes: [{ grams: 250, priceCop: 62000 }], tag: "limited",
    bag: "#C9877A", stage: "#F1DFCF",
  },
  {
    slug: "alto-penderisco-caturra", brandSlug: "alto-penderisco", brand: "Café Alto Penderisco", labelBrand: "Alto Penderisco",
    producerSlug: null, name: { en: "Caturra House Blend", es: "Caturra mezcla de la casa" },
    notes: { en: "Chocolate, panela, nuts", es: "Chocolate, panela, nueces" },
    roastLevel: 4, grindOptions: preGround, sizes: [{ grams: 500, priceCop: 42000 }], tag: "ground",
    bag: "#3E5448", stage: "#E7E3D3",
  },
  {
    slug: "la-cumbre-geisha", brandSlug: "la-cumbre", brand: "Finca La Cumbre", labelBrand: "La Cumbre",
    producerSlug: null, name: { en: "Geisha Washed", es: "Geisha lavado" },
    notes: { en: "Bergamot, honeysuckle, lime", es: "Bergamota, madreselva, lima" },
    roastLevel: 1, grindOptions: whole, sizes: [{ grams: 250, priceCop: 95000 }], tag: "microLot",
    bag: "#B0763F", stage: "#F3E3CC",
  },
  {
    slug: "santa-isabel-castillo", brandSlug: null, brand: "Café Santa Isabel", labelBrand: "Santa Isabel",
    producerSlug: null, name: { en: "Castillo Natural", es: "Castillo natural" },
    notes: { en: "Blackberry, cocoa, molasses", es: "Mora, cacao, melaza" },
    roastLevel: 3, grindOptions: whole, sizes: [{ grams: 340, priceCop: 46000 }], tag: "new",
    bag: "#8A3B2E", stage: "#F0DAD2",
  },
  {
    slug: "dona-gloria-tabi", brandSlug: "dona-gloria", brand: "Doña Gloria Café", labelBrand: "Doña Gloria",
    producerSlug: null, name: { en: "Tabi Washed", es: "Tabi lavado" },
    notes: { en: "Orange, brown sugar, almond", es: "Naranja, azúcar morena, almendra" },
    roastLevel: 3, grindOptions: whole, sizes: [{ grams: 454, priceCop: 54000 }], tag: "familyFarm",
    bag: "#5B3A6B", stage: "#E9E0EC",
  },
  {
    slug: "alto-penderisco-espresso", brandSlug: "alto-penderisco", brand: "Café Alto Penderisco", labelBrand: "Alto Penderisco",
    producerSlug: null, name: { en: "Espresso Blend", es: "Mezcla espresso" },
    notes: { en: "Dark chocolate, toasted nuts", es: "Chocolate oscuro, nueces tostadas" },
    roastLevel: 5, grindOptions: ["espresso"], sizes: [{ grams: 500, priceCop: 38000 }], tag: "forEspresso",
    bag: "#2B1A10", stage: "#E5DCD2",
  },
];

/** English titles drop the Spanish "Café" / "Tostado" so the product title reads in English. */
export function brandName(brand: string, lang: Locale): string {
  if (lang === "es") return brand;
  return brand.replace(/^Café /, "").replace(/ Café$/, " Coffee").replace(/^Tostado /, "");
}

export const getProduct = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const getBrand = (slug: string): Brand | undefined => brands.find((b) => b.slug === slug);
export const productsByProducer = (producerSlug: string): Product[] =>
  products.filter((p) => p.producerSlug === producerSlug);
export const productsByBrand = (brandSlug: string): Product[] =>
  products.filter((p) => p.brandSlug === brandSlug);
export const productParams = () => products.map((p) => ({ slug: p.slug }));
export const defaultSize = (p: Product): ProductSize => p.sizes[0];
/** Price per kg in COP, rounded to the nearest 100 (as on the Shop board) */
export const pricePerKgCop = (size: ProductSize): number =>
  Math.round(((size.priceCop / size.grams) * 1000) / 100) * 100;
