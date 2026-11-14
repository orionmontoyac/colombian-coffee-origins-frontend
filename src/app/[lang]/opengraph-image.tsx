import { hasLocale } from "@/app/[lang]/dictionaries";
import { ogContentType, ogSize, renderOg } from "@/lib/seo/og";

export const alt = "Colombian Coffee Origins: specialty coffee direct from family farms in Urrao, Antioquia";
export const size = ogSize;
export const contentType = ogContentType;

const copy = {
  en: { eyebrow: "Urrao & Medellín, Antioquia", title: "Colombian specialty coffee", accent: "direct from farms", footer: "Green coffee for roasters worldwide · Roasted coffee in Colombia" },
  es: { eyebrow: "Urrao y Medellín, Antioquia", title: "Café especial colombiano", accent: "directo de la finca", footer: "Café verde para tostadores del mundo · Café tostado en Colombia" },
} as const;

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return renderOg({ ...copy[hasLocale(lang) ? lang : "en"] });
}
