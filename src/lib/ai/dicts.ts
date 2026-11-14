import type { Locale } from "@/app/[lang]/dictionaries";
import * as hero from "@/app/[lang]/dictionaries/hero";
import * as lines from "@/app/[lang]/dictionaries/lines";
import * as lotsPage from "@/app/[lang]/dictionaries/lotsPage";
import * as lotPage from "@/app/[lang]/dictionaries/lotPage";
import * as producersPage from "@/app/[lang]/dictionaries/producersPage";
import * as producerPage from "@/app/[lang]/dictionaries/producerPage";
import * as buyersPage from "@/app/[lang]/dictionaries/buyersPage";
import * as regionsPage from "@/app/[lang]/dictionaries/regionsPage";
import * as shopPage from "@/app/[lang]/dictionaries/shopPage";
import * as journal from "@/app/[lang]/dictionaries/journal";
import * as faq from "@/app/[lang]/dictionaries/faq";

/** Dictionaries by explicit locale (route handlers have no request-scoped `lang()`). */
export function dicts(lang: Locale) {
  return {
    hero: hero[lang],
    lines: lines[lang],
    lotsPage: lotsPage[lang],
    lotPage: lotPage[lang],
    producersPage: producersPage[lang],
    producerPage: producerPage[lang],
    buyersPage: buyersPage[lang],
    regionsPage: regionsPage[lang],
    shopPage: shopPage[lang],
    journal: journal[lang],
    faq: faq[lang],
  };
}

export const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)).replace(/ /g, " ");

export const joinList = (lang: Locale, items: string[]) => {
  if (items.length < 2) return items.join("");
  const and = lang === "es" ? "y" : "and";
  return `${items.slice(0, -1).join(", ")} ${and} ${items[items.length - 1]}`;
};
