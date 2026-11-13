import type { StaticImageData } from "next/image";
import type { Locale } from "@/app/[lang]/dictionaries";
import chirosoCherries from "@/assets/home/lot-chiroso-cherries.jpg";
import castilloProducer from "@/assets/home/lot-castillo-producer.jpg";
import pinkBourbonProducer from "@/assets/home/lot-pink-bourbon-producer.jpg";
import farmersHarvest from "@/assets/home/farmers-harvest.jpg";

/**
 * EXAMPLE DATA. Lots, producers, farms, scores and prices are illustrative, not
 * real offers (from the Lots and Lot boards). Replace with Supabase records once
 * real producers are onboarded. Photos are stock and do not show the named
 * producers. Lots 035 and 028 name producers that have no profile page yet.
 */
export type Verification = "coffeeVerified" | "farmVerified" | "registered";
export type Process = "washed" | "honey" | "natural";
type L10n<T> = Record<Locale, T>;

export type LotDetail = {
  processNote: L10n<string>;
  moisturePct: number;
  waterActivity: number;
  packaging: L10n<string>;
  storedIn: string;
  /** Cup profile, 0 to 10 */
  attributes: { acidity: number; sweetness: number; body: number; aftertaste: number };
  /** Keys of the "What we checked" list that are done for this lot */
  checks: ("farmVisited" | "cupped" | "kilosConfirmed" | "moisture")[];
};

export type Lot = {
  /** Display code, e.g. URR-024 */
  code: string;
  /** URL segment: lower-case code, e.g. urr-024 */
  slug: string;
  name: L10n<string>;
  /** Producer profile slug, or null when the producer has no profile page yet */
  producerSlug: string | null;
  producerName: string;
  initials: string;
  farm: string;
  region: string;
  altitudeM: number;
  variety: string;
  process: Process;
  /** SCA cupping score; null = not cupped yet */
  score: number | null;
  notes: L10n<string[]>;
  availableKg: number;
  availableBags: number;
  /** USD per kg green, FOB; null = price on request */
  priceUsdPerKg: number | null;
  minOrderKg: number;
  harvest: L10n<string>;
  verification: Verification;
  sampleAvailable: boolean;
  image: StaticImageData;
  imageAlt: L10n<string>;
  /** Only lots with a full lab/cupping report carry this */
  detail?: LotDetail;
};

const BAG_KG = 35;
const bags = (kg: number) => Math.ceil(kg / BAG_KG);
const harvest = { en: "2026 main crop", es: "Cosecha principal 2026" };

export const lots: Lot[] = [
  {
    code: "URR-035", slug: "urr-035", name: { en: "Geisha · Natural", es: "Geisha · Natural" },
    producerSlug: null, producerName: "Jorge Iván Restrepo", initials: "JR", farm: "Finca Alto Bonito",
    region: "Urrao, Antioquia", altitudeM: 2250, variety: "Geisha", process: "natural", score: 88.25,
    notes: { en: ["Bergamot", "Jasmine", "Honey"], es: ["Bergamota", "Jazmín", "Miel"] },
    availableKg: 70, availableBags: bags(70), priceUsdPerKg: null, minOrderKg: BAG_KG, harvest,
    verification: "coffeeVerified", sampleAvailable: true, image: chirosoCherries,
    imageAlt: { en: "Ripe red coffee cherries on the branch", es: "Cerezas de café rojas y maduras en la rama" },
  },
  {
    code: "URR-024", slug: "urr-024", name: { en: "Chiroso · Washed", es: "Chiroso · Lavado" },
    producerSlug: "luz-mery-higuita", producerName: "Luz Mery Higuita", initials: "LH", farm: "Finca El Mirador",
    region: "Urrao, Antioquia", altitudeM: 2150, variety: "Chiroso", process: "washed", score: 87.5,
    notes: { en: ["Jasmine", "White peach", "Panela"], es: ["Jazmín", "Durazno blanco", "Panela"] },
    availableKg: 120, availableBags: bags(120), priceUsdPerKg: 18.5, minOrderKg: BAG_KG, harvest,
    verification: "coffeeVerified", sampleAvailable: true, image: chirosoCherries,
    imageAlt: { en: "Ripe red coffee cherries on the branch", es: "Cerezas de café rojas y maduras en la rama" },
    detail: {
      processNote: { en: "Washed, 36 h fermentation", es: "Lavado, 36 h de fermentación" },
      moisturePct: 10.8, waterActivity: 0.55,
      packaging: { en: "GrainPro inside jute, 35 kg", es: "GrainPro dentro de yute, 35 kg" },
      storedIn: "Medellín, Antioquia",
      attributes: { acidity: 8, sweetness: 8.5, body: 7, aftertaste: 7.75 },
      checks: ["farmVisited", "cupped", "kilosConfirmed", "moisture"],
    },
  },
  {
    code: "URR-028", slug: "urr-028", name: { en: "Caturra · Washed", es: "Caturra · Lavado" },
    producerSlug: null, producerName: "Rosa Elena Cartagena", initials: "RC", farm: "Finca La Primavera",
    region: "Urrao, Antioquia", altitudeM: 2000, variety: "Caturra", process: "washed", score: 86,
    notes: { en: ["Orange", "Brown sugar", "Almond"], es: ["Naranja", "Azúcar morena", "Almendra"] },
    availableKg: 350, availableBags: bags(350), priceUsdPerKg: 12.4, minOrderKg: BAG_KG, harvest,
    verification: "coffeeVerified", sampleAvailable: true, image: farmersHarvest,
    imageAlt: { en: "Coffee pickers with harvest baskets on a Colombian hillside", es: "Recolectores con canastos de cosecha en una ladera colombiana" },
  },
  {
    code: "URR-017", slug: "urr-017", name: { en: "Castillo · Honey", es: "Castillo · Honey" },
    producerSlug: "hernan-dario-restrepo", producerName: "Hernán Darío Restrepo", initials: "HR", farm: "Finca La Esperanza",
    region: "Urrao, Antioquia", altitudeM: 1950, variety: "Castillo", process: "honey", score: 85,
    notes: { en: ["Red apple", "Caramel", "Cacao"], es: ["Manzana roja", "Caramelo", "Cacao"] },
    availableKg: 600, availableBags: bags(600), priceUsdPerKg: 8.9, minOrderKg: BAG_KG, harvest,
    verification: "farmVerified", sampleAvailable: true, image: castilloProducer,
    imageAlt: { en: "Coffee producer among his coffee plants", es: "Caficultor entre sus matas de café" },
  },
  {
    code: "URR-031", slug: "urr-031", name: { en: "Pink Bourbon · Natural", es: "Pink Bourbon · Natural" },
    producerSlug: "jhon-jairo-usuga", producerName: "Jhon Jairo Úsuga", initials: "JU", farm: "Finca Los Naranjos",
    region: "Urrao, Antioquia", altitudeM: 2050, variety: "Pink Bourbon", process: "natural", score: null,
    notes: { en: ["Strawberry", "Hibiscus", "Red wine"], es: ["Fresa", "Flor de Jamaica", "Vino tinto"] },
    availableKg: 90, availableBags: bags(90), priceUsdPerKg: null, minOrderKg: BAG_KG, harvest,
    verification: "registered", sampleAvailable: true, image: pinkBourbonProducer,
    imageAlt: { en: "Smiling coffee producer in a straw hat on his farm", es: "Caficultor sonriente con sombrero en su finca" },
  },
  {
    code: "URR-019", slug: "urr-019", name: { en: "Castillo · Washed", es: "Castillo · Lavado" },
    producerSlug: "luz-mery-higuita", producerName: "Luz Mery Higuita", initials: "LH", farm: "Finca El Mirador",
    region: "Urrao, Antioquia", altitudeM: 2100, variety: "Castillo", process: "washed", score: null,
    notes: { en: ["Milk chocolate", "Panela", "Lime"], es: ["Chocolate con leche", "Panela", "Lima"] },
    availableKg: 480, availableBags: bags(480), priceUsdPerKg: null, minOrderKg: BAG_KG, harvest,
    verification: "registered", sampleAvailable: true, image: castilloProducer,
    imageAlt: { en: "Coffee producer among his coffee plants", es: "Caficultor entre sus matas de café" },
  },
];

export const getLot = (code: string): Lot | undefined =>
  lots.find((l) => l.slug === code.toLowerCase());
export const lotsByProducer = (producerSlug: string): Lot[] =>
  lots.filter((l) => l.producerSlug === producerSlug);
/** Other lots, for "More from Urrao" */
export const relatedLots = (code: string, limit = 3): Lot[] =>
  lots.filter((l) => l.slug !== code.toLowerCase()).slice(0, limit);
export const lotParams = () => lots.map((l) => ({ code: l.slug }));
