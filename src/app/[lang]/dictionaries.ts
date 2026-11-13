/**
 * How to add a page dictionary key (parallel-safe)
 * 1. Fill src/app/[lang]/dictionaries/<key>/en.json and es.json (EN is the source of truth).
 * 2. <key>/index.ts re-exports { en, es } and fails typecheck/build if es.json differs in shape
 *    from en.json. Leave it unchanged.
 * 3. Your key is already registered in `sections` below; only fill in its en.json and es.json
 *    (the empty `{}` files widen by just editing the JSON). A brand-new key outside the
 *    pre-registered list is a planner request. Registration is a one-line-per-key list because
 *    TypeScript infers `Dictionary` from static import paths; Next 16 / Turbopack has no
 *    import.meta.glob or require.context to discover folders automatically.
 * 4. Use it: `const t = await getDictionary(); t.<key>.…` (no other file changes).
 */
import { lang } from "next/root-params";
import { notFound } from "next/navigation";

const sections = {
  meta: () => import("./dictionaries/meta"),
  nav: () => import("./dictionaries/nav"),
  hero: () => import("./dictionaries/hero"),
  statement: () => import("./dictionaries/statement"),
  farmers: () => import("./dictionaries/farmers"),
  lots: () => import("./dictionaries/lots"),
  shop: () => import("./dictionaries/shop"),
  story: () => import("./dictionaries/story"),
  facts: () => import("./dictionaries/facts"),
  regions: () => import("./dictionaries/regions"),
  producersBand: () => import("./dictionaries/producersBand"),
  closing: () => import("./dictionaries/closing"),
  footer: () => import("./dictionaries/footer"),
  lines: () => import("./dictionaries/lines"),
  lotsPage: () => import("./dictionaries/lotsPage"),
  lotPage: () => import("./dictionaries/lotPage"),
  producersPage: () => import("./dictionaries/producersPage"),
  producerPage: () => import("./dictionaries/producerPage"),
  shopPage: () => import("./dictionaries/shopPage"),
  productPage: () => import("./dictionaries/productPage"),
  cart: () => import("./dictionaries/cart"),
  buyersPage: () => import("./dictionaries/buyersPage"),
  forms: () => import("./dictionaries/forms"),
  regionsPage: () => import("./dictionaries/regionsPage"),
  storyPage: () => import("./dictionaries/storyPage"),
  journal: () => import("./dictionaries/journal"),
  legal: () => import("./dictionaries/legal"),
  notFound: () => import("./dictionaries/notFound"),
  faq: () => import("./dictionaries/faq"),
};

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = {
  [K in keyof typeof sections]: Awaited<ReturnType<(typeof sections)[K]>>["en"];
};
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

const load = async (locale: Locale): Promise<Dictionary> => {
  const entries = await Promise.all(
    Object.entries(sections).map(async ([key, load]) => [key, (await load())[locale]] as const),
  );
  return Object.fromEntries(entries) as Dictionary;
};

export const getDictionary = async (): Promise<Dictionary> => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return load(locale);
};
