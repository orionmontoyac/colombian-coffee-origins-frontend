import { hasLocale } from "@/app/[lang]/dictionaries";
import { defaultSize, getProduct, roastLabels } from "@/data/products";
import { getProducer } from "@/data/producers";
import { ogContentType, ogSize, renderOg } from "@/lib/seo/og";

export const alt = "Roasted Colombian coffee: brand, name, roast, bag size and price in Colombian pesos";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: l, slug } = await params;
  const lang = hasLocale(l) ? l : "en";
  const p = getProduct(slug);
  if (!p) return renderOg({ eyebrow: "Colombian Coffee Origins", title: "Roasted coffee", footer: "Colombia only" });
  const s = defaultSize(p);
  const producer = p.producerSlug ? getProducer(p.producerSlug) : undefined;
  const cop = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { maximumFractionDigits: 0 }).format(s.priceCop);
  return renderOg({
    eyebrow: lang === "es" ? "Café tostado · solo Colombia" : "Roasted coffee · Colombia only",
    title: p.brand,
    accent: p.name[lang],
    lines: [
      `${roastLabels[p.roastLevel][lang]} · ${s.grams} g`,
      producer ? `${producer.name} · ${producer.farm}, ${producer.town}` : "Urrao, Antioquia",
    ],
    badge: { label: lang === "es" ? `Bolsa de ${s.grams} g` : `${s.grams} g bag`, value: `COP ${cop}` },
    footer: "Colombian Coffee Origins",
  });
}
