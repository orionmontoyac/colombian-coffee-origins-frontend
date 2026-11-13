import type { Locale } from "@/app/[lang]/dictionaries";

/** Shop prices: "COP 68,000" in English, "$68.000" in Spanish (Colombian format). Whole pesos only. */
export function formatCop(value: number, lang: Locale): string {
  const digits = Math.round(value).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, lang === "es" ? "." : ",");
  return lang === "es" ? `$${grouped}` : `COP ${grouped}`;
}

export const formatPerKg = (value: number, lang: Locale): string => `${formatCop(value, lang)} / kg`;

/** Fills `{name}` placeholders in a dictionary string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => String(vars[key] ?? ""));
}
