import type { StaticImageData } from "next/image";
import type { Locale } from "@/app/[lang]/dictionaries";
import { getLot, type Verification, type Process } from "./lots";

/**
 * EXAMPLE DATA for the home page design preview. A view over src/data/lots.ts
 * (the single source of lot data): the three featured lots in home order.
 */
export type { Verification, Process };

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

export const sampleLots: SampleLot[] = ["URR-024", "URR-017", "URR-031"].map((code) => {
  const l = getLot(code)!;
  return {
    code: l.code,
    variety: l.variety,
    process: l.process,
    producer: l.producerName,
    initials: l.initials,
    farm: l.farm,
    altitudeM: l.altitudeM,
    kg: l.availableKg,
    notes: l.notes,
    score: l.score,
    priceUsdPerKg: l.priceUsdPerKg,
    verification: l.verification,
    image: l.image,
    imageAlt: l.imageAlt,
  };
});
