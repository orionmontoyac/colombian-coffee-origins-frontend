import type { Locale } from "@/app/[lang]/dictionaries";

/** Replaces {name} placeholders in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

/** 2,150 in English, 2.150 in Spanish (always grouped, so four-digit altitudes read the same way). */
export function num(lang: Locale, value: number, digits = 0): string {
  const en = new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  return lang === "en" ? en : en.replace(/[,.]/g, (c) => (c === "," ? "." : ","));
}

/** SCA score: one decimal, two when needed (87.5, 88.25). */
export function score(lang: Locale, value: number): string {
  return num(lang, value, 2).replace(/([.,]\d)0$/, "$1");
}

/** Cup attribute out of ten: 8, 8.5, 7.75. */
export function attr(lang: Locale, value: number): string {
  return num(lang, value, 2).replace(/[.,]00$/, "").replace(/([.,]\d)0$/, "$1");
}

export function list(lang: Locale, items: string[]): string {
  return new Intl.ListFormat(lang, { style: "long", type: "conjunction" }).format(items);
}

/** First four-digit year in a harvest label ("2026 main crop" gives "2026"). */
export function harvestYear(label: string): string {
  return label.match(/\d{4}/)?.[0] ?? label;
}
