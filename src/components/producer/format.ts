import type { Locale } from "@/app/[lang]/dictionaries";

/** Replace {placeholders} in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function formatNumber(lang: Locale, value: number, digits = 0): string {
  return new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}

/** Shop prices: "COP 68,000" in English, "$68.000" in Spanish (Colombian format). */
export function formatCop(value: number, lang: Locale): string {
  if (lang === "es") return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
  return `COP ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

export function plural(count: number, one: string, other: string): string {
  return fill(count === 1 ? one : other, { count });
}

/** "Luz Mery Higuita" -> ["Luz Mery", "Higuita"]: the last word is the italic accent in the H1. */
export function splitName(name: string): [string, string] {
  const i = name.lastIndexOf(" ");
  return i === -1 ? ["", name] : [name.slice(0, i), name.slice(i + 1)];
}
