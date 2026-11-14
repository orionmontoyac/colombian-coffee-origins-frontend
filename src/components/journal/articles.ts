import type { StaticImageData } from "next/image";
import type { Locale } from "@/app/[lang]/dictionaries";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import farmers from "@/assets/home/farmers-harvest.jpg";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { journalSlugs } from "@/lib/journal-slugs";
export { articleHref, articleAlternates } from "@/lib/routes";
import type { ArticleId } from "./types";

export type ArticleMeta = {
  id: ArticleId;
  /** Slugs are localized: /en/journal/what-is-chiroso-coffee, /es/blog/que-es-el-cafe-chiroso */
  slug: Record<Locale, string>;
  /** ISO dates. TODO(owner): replace with the real publication date. */
  datePublished: string;
  dateModified: string;
  image: StaticImageData;
  imageAlt: Record<Locale, string>;
};

const DRAFT_DATE = "2026-11-13";

export const articles: ArticleMeta[] = [
  {
    id: "chiroso",
    slug: journalSlugs.chiroso,
    datePublished: DRAFT_DATE, dateModified: DRAFT_DATE, image: cherries,
    imageAlt: {
      en: "Ripe red coffee cherries on the branch, as grown around Urrao",
      es: "Cerezas de café rojas y maduras en la rama, como las que se cultivan en Urrao",
    },
  },
  {
    id: "buying",
    slug: journalSlugs.buying,
    datePublished: DRAFT_DATE, dateModified: DRAFT_DATE, image: farmers,
    imageAlt: {
      en: "Coffee pickers with harvest baskets on a Colombian hillside",
      es: "Recolectores con canastos de cosecha en una ladera colombiana",
    },
  },
  {
    id: "urrao",
    slug: journalSlugs.urrao,
    datePublished: DRAFT_DATE, dateModified: DRAFT_DATE, image: hills,
    imageAlt: {
      en: "Green coffee hills around Urrao, Antioquia",
      es: "Colinas verdes de café alrededor de Urrao, Antioquia",
    },
  },
];

export const getArticle = (id: ArticleId) => articles.find((a) => a.id === id)!;
export const articleBySlug = (lang: Locale, slug: string) => articles.find((a) => a.slug[lang] === slug);
export const articleParams = () =>
  (["en", "es"] as const).flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug[lang] })));
