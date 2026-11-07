import type { StaticImageData } from "next/image";
import type { Locale } from "@/app/[lang]/dictionaries";
import chirosoCherries from "@/assets/home/lot-chiroso-cherries.jpg";
import castilloProducer from "@/assets/home/lot-castillo-producer.jpg";
import pinkBourbonProducer from "@/assets/home/lot-pink-bourbon-producer.jpg";

/**
 * EXAMPLE DATA for the home page design preview. Producers, farms, scores and
 * prices are illustrative, not real offers. Replace with lots from Supabase
 * once real producers are onboarded (see the Website Starter Manifest).
 * Photos are from Unsplash and do not show the named producers.
 */
export type Verification = "coffeeVerified" | "farmVerified" | "registered";
export type Process = "washed" | "honey" | "natural";

export type SampleLot = {
  code: string;
  variety: string;
  process: Process;
  producer: string;
  initials: string;
  farm: string;
  altitudeM: number;
  kg: number;
  notes: Record<Locale, string[]>;
  /** SCA cupping score; null when the lot has not been cupped yet */
  score: number | null;
  /** USD per kg of green coffee, FOB; null = price on request */
  priceUsdPerKg: number | null;
  verification: Verification;
  image: StaticImageData;
  imageAlt: Record<Locale, string>;
};

export const sampleLots: SampleLot[] = [
  {
    code: "URR-024",
    variety: "Chiroso",
    process: "washed",
    producer: "Luz Mery Higuita",
    initials: "LH",
    farm: "Finca El Mirador",
    altitudeM: 2150,
    kg: 120,
    notes: { en: ["Jasmine", "White peach", "Panela"], es: ["Jazmín", "Durazno blanco", "Panela"] },
    score: 87.5,
    priceUsdPerKg: 18.5,
    verification: "coffeeVerified",
    image: chirosoCherries,
    imageAlt: { en: "Ripe red coffee cherries on the branch", es: "Cerezas de café rojas y maduras en la rama" },
  },
  {
    code: "URR-017",
    variety: "Castillo",
    process: "honey",
    producer: "Hernán Darío Restrepo",
    initials: "HR",
    farm: "Finca La Esperanza",
    altitudeM: 1950,
    kg: 600,
    notes: { en: ["Red apple", "Caramel", "Cacao"], es: ["Manzana roja", "Caramelo", "Cacao"] },
    score: 85,
    priceUsdPerKg: 8.9,
    verification: "farmVerified",
    image: castilloProducer,
    imageAlt: { en: "Coffee producer among his coffee plants", es: "Caficultor entre sus matas de café" },
  },
  {
    code: "URR-031",
    variety: "Pink Bourbon",
    process: "natural",
    producer: "Jhon Jairo Úsuga",
    initials: "JU",
    farm: "Finca Los Naranjos",
    altitudeM: 2050,
    kg: 90,
    notes: { en: ["Strawberry", "Hibiscus", "Red wine"], es: ["Fresa", "Flor de Jamaica", "Vino tinto"] },
    score: null,
    priceUsdPerKg: null,
    verification: "registered",
    image: pinkBourbonProducer,
    imageAlt: {
      en: "Smiling coffee producer in a straw hat on his farm",
      es: "Caficultor sonriente con sombrero en su finca",
    },
  },
];
