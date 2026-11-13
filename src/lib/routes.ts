import type { Locale } from "@/app/[lang]/dictionaries";
import { journalSlugs, type JournalArticleId } from "./journal-slugs";

/**
 * Localized path segments for every route in SPEC.md section 3.
 * Page folders in src/app/[lang] use the English segments; src/proxy.ts rewrites
 * Spanish URLs (/es/cafes) to them, so always build links with these helpers.
 */
const slugs = {
  home: { en: "", es: "" },
  coffees: { en: "coffees", es: "cafes" },
  producers: { en: "producers", es: "productores" },
  forBuyers: { en: "for-buyers", es: "para-compradores" },
  ourStory: { en: "our-story", es: "nuestra-historia" },
  samples: { en: "samples", es: "muestras" },
  contact: { en: "contact", es: "contacto" },
  regions: { en: "regions", es: "regiones" },
  urrao: { en: "regions/urrao", es: "regiones/urrao" },
  journal: { en: "journal", es: "blog" },
  privacy: { en: "privacy", es: "privacidad" },
  terms: { en: "terms", es: "terminos" },
  shop: { en: "shop", es: "tienda" },
  sellWithUs: { en: "shop/sell", es: "tienda/vender" },
} as const;

export type RouteKey = keyof typeof slugs;
export const routeKeys = Object.keys(slugs) as RouteKey[];

const langs: Locale[] = ["en", "es"];

export function href(lang: Locale, key: RouteKey): string {
  const slug = slugs[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

/** Same route in the other language (for the language switcher and hreflang). */
export function alternateHref(lang: Locale, key: RouteKey): string {
  return href(lang === "en" ? "es" : "en", key);
}

/** URL of one route in every language, e.g. { en: "/en/coffees", es: "/es/cafes" }. */
export function alternates(key: RouteKey): Record<Locale, string> {
  return { en: href("en", key), es: href("es", key) };
}

// Dynamic routes. Lot URLs use the lower-case lot code (/en/coffees/urr-024).
export function lotHref(lang: Locale, code: string): string {
  return `${href(lang, "coffees")}/${code.toLowerCase()}`;
}
export function producerHref(lang: Locale, slug: string): string {
  return `${href(lang, "producers")}/${slug}`;
}
export function productHref(lang: Locale, slug: string): string {
  return `${href(lang, "shop")}/${slug}`;
}

export function articleHref(lang: Locale, id: JournalArticleId): string {
  return `${href(lang, "journal")}/${journalSlugs[id][lang]}`;
}
export const articleAlternates = (id: JournalArticleId): Record<Locale, string> => ({
  en: articleHref("en", id),
  es: articleHref("es", id),
});

export const lotAlternates = (code: string) => ({ en: lotHref("en", code), es: lotHref("es", code) });
export const producerAlternates = (slug: string) => ({ en: producerHref("en", slug), es: producerHref("es", slug) });
export const productAlternates = (slug: string) => ({ en: productHref("en", slug), es: productHref("es", slug) });

// ---- Path translation (used by src/proxy.ts) --------------------------------

const keysByLength = routeKeys
  .filter((k) => slugs[k].en !== "")
  .sort((a, b) => slugs[b].en.split("/").length - slugs[a].en.split("/").length);

function translate(lang: Locale, rest: string, from: Locale, to: Locale): string {
  const parts = rest.split("/").filter(Boolean);
  for (const key of keysByLength) {
    const src = slugs[key][from].split("/");
    if (src.length <= parts.length && src.every((s, i) => parts[i] === s)) {
      return [...slugs[key][to].split("/"), ...parts.slice(src.length)].join("/");
    }
  }
  return parts.join("/");
}

/** "/es/cafes/urr-024" -> "/es/coffees/urr-024" (the folder the page lives in). Unchanged for "en". */
export function toInternalPath(pathname: string): string {
  const [, lang, ...rest] = pathname.split("/");
  if (!langs.includes(lang as Locale) || lang === "en") return pathname;
  const out = translate(lang as Locale, rest.join("/"), lang as Locale, "en");
  return out ? `/${lang}/${out}` : `/${lang}`;
}

/** "/es/coffees/urr-024" -> "/es/cafes/urr-024" (the public URL). Unchanged for "en". */
export function toPublicPath(pathname: string): string {
  const [, lang, ...rest] = pathname.split("/");
  if (!langs.includes(lang as Locale) || lang === "en") return pathname;
  const out = translate(lang as Locale, rest.join("/"), "en", lang as Locale);
  return out ? `/${lang}/${out}` : `/${lang}`;
}
