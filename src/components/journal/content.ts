import type { Locale } from "@/app/[lang]/dictionaries";
import { contentEn } from "./content-en";
import { contentEs } from "./content-es";
import { stripLinks } from "./rich-text";
import type { ArticleId, Block } from "./types";

export const getBlocks = (lang: Locale, id: ArticleId): Block[] => (lang === "es" ? contentEs : contentEn)[id];

export const wordCount = (blocks: Block[]) =>
  blocks.reduce((n, b) => n + stripLinks(`${b.h2 ?? ""} ${b.p.join(" ")}`).split(/\s+/).filter(Boolean).length, 0);

/** About 200 words a minute. */
export const readingMinutes = (blocks: Block[]) => Math.max(1, Math.ceil(wordCount(blocks) / 200));

export const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function formatDate(lang: Locale, iso: string) {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
