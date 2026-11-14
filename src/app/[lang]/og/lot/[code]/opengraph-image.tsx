import { hasLocale } from "@/app/[lang]/dictionaries";
import { getLot } from "@/data/lots";
import { ogContentType, ogSize, renderOg } from "@/lib/seo/og";

export const alt = "Colombian green coffee lot: variety, process, producer, farm, town and price per kg";
export const size = ogSize;
export const contentType = ogContentType;

const processes = {
  en: { washed: "Washed", honey: "Honey", natural: "Natural" },
  es: { washed: "Lavado", honey: "Honey", natural: "Natural" },
} as const;

export default async function Image({ params }: { params: Promise<{ lang: string; code: string }> }) {
  const { lang: l, code } = await params;
  const lang = hasLocale(l) ? l : "en";
  const lot = getLot(code);
  const fmt = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return renderOg({
    eyebrow: lang === "es" ? `Lote ${lot?.code ?? ""} · café verde` : `Lot ${lot?.code ?? ""} · green coffee`,
    title: lot?.variety ?? "Colombian Coffee Origins",
    accent: lot ? `· ${processes[lang][lot.process]}` : undefined,
    lines: lot ? [lot.producerName, `${lot.farm} · ${lot.region}`] : undefined,
    badge: lot
      ? {
          label: lang === "es" ? "FOB por kg" : "FOB per kg",
          value: lot.priceUsdPerKg !== null ? `USD ${fmt.format(lot.priceUsdPerKg)}` : lang === "es" ? "A consultar" : "On request",
        }
      : undefined,
    footer: "Colombian Coffee Origins",
  });
}
