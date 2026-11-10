import type { Locale } from "@/app/[lang]/dictionaries";

/**
 * EXAMPLE DATA for the roasted coffee shop preview. Brands, products and prices
 * are illustrative. Replace with producer products from Supabase.
 */
export type RoastLevel = "light" | "medium" | "mediumDark";
export type Grind = "wholeBean" | "ground";
export type ProductTag = "producerBrand" | "bestValue" | "limited" | "ground";

export type SampleRoastedProduct = {
  id: string;
  brand: string;
  /** Short brand name printed on the bag drawing */
  labelBrand: string;
  name: Record<Locale, string>;
  notes: Record<Locale, string>;
  roast: RoastLevel;
  grind: Grind;
  grams: number;
  priceUsd: number;
  tag: ProductTag;
  /** Bag color and the soft background behind it */
  bag: string;
  stage: string;
};

export const sampleRoastedProducts: SampleRoastedProduct[] = [
  {
    id: "el-mirador-chiroso",
    brand: "Café El Mirador",
    labelBrand: "El Mirador",
    name: { en: "Chiroso Washed", es: "Chiroso lavado" },
    notes: { en: "Jasmine, white peach, panela", es: "Jazmín, durazno blanco, panela" },
    roast: "light",
    grind: "wholeBean",
    grams: 340,
    priceUsd: 24,
    tag: "producerBrand",
    bag: "#7A4A2B",
    stage: "#EFE6D6",
  },
  {
    id: "la-esperanza-castillo",
    brand: "Tostado La Esperanza",
    labelBrand: "La Esperanza",
    name: { en: "Castillo Honey", es: "Castillo honey" },
    notes: { en: "Red apple, caramel, cacao", es: "Manzana roja, caramelo, cacao" },
    roast: "medium",
    grind: "wholeBean",
    grams: 340,
    priceUsd: 18.5,
    tag: "bestValue",
    bag: "#0B3D2A",
    stage: "#E3EDD2",
  },
  {
    id: "los-naranjos-pink-bourbon",
    brand: "Los Naranjos Coffee",
    labelBrand: "Los Naranjos",
    name: { en: "Pink Bourbon Natural", es: "Pink Bourbon natural" },
    notes: { en: "Strawberry, hibiscus, red wine", es: "Fresa, flor de Jamaica, vino tinto" },
    roast: "light",
    grind: "wholeBean",
    grams: 250,
    priceUsd: 22,
    tag: "limited",
    bag: "#C9877A",
    stage: "#F1DFCF",
  },
  {
    id: "alto-penderisco-caturra",
    brand: "Café Alto Penderisco",
    labelBrand: "Alto Penderisco",
    name: { en: "Caturra House Blend", es: "Caturra mezcla de la casa" },
    notes: { en: "Chocolate, panela, nuts", es: "Chocolate, panela, nueces" },
    roast: "mediumDark",
    grind: "ground",
    grams: 500,
    priceUsd: 16.9,
    tag: "ground",
    bag: "#3E5448",
    stage: "#E7E3D3",
  },
];
