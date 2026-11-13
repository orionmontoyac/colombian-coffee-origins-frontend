import type { Locale } from "@/app/[lang]/dictionaries";

/** Plain journal slug list (no article bodies), shared by routes, the proxy and the journal data. */
export const journalSlugs = {
  chiroso: { en: "what-is-chiroso-coffee", es: "que-es-el-cafe-chiroso" },
  buying: { en: "how-to-buy-green-coffee-from-colombia", es: "como-comprar-cafe-verde-de-colombia" },
  urrao: { en: "urrao-antioquia-coffee-region-guide", es: "urrao-antioquia-guia-region-cafetera" },
} as const satisfies Record<string, Record<Locale, string>>;

export type JournalArticleId = keyof typeof journalSlugs;

export const isJournalSlug = (lang: Locale, slug: string): boolean =>
  Object.values(journalSlugs).some((s) => s[lang] === slug);
