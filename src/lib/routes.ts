import type { Locale } from "@/app/[lang]/dictionaries";

// Localized slugs from the sitemap in the Website Starter Manifest (Notion).
const slugs = {
  home: { en: "", es: "" },
  coffees: { en: "coffees", es: "cafes" },
  producers: { en: "producers", es: "productores" },
  forBuyers: { en: "for-buyers", es: "para-compradores" },
  forFarmers: { en: "for-farmers", es: "para-productores" },
  ourStory: { en: "our-story", es: "nuestra-historia" },
  samples: { en: "samples", es: "muestras" },
  contact: { en: "contact", es: "contacto" },
  regions: { en: "regions", es: "regiones" },
  urrao: { en: "regions/urrao", es: "regiones/urrao" },
  journal: { en: "journal", es: "blog" },
  privacy: { en: "privacy", es: "privacidad" },
  terms: { en: "terms", es: "terminos" },
} as const;

export type RouteKey = keyof typeof slugs;

export function href(lang: Locale, key: RouteKey): string {
  const slug = slugs[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}
