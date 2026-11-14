import type { Locale } from "@/app/[lang]/dictionaries";
import { articles } from "@/components/journal/articles";
import { getBlocks } from "@/components/journal/content";
import { resolveTarget } from "@/components/journal/rich-text";
import { harvestCalendar } from "@/components/regions/data";
import { lots, lotsByProducer } from "@/data/lots";
import { producers } from "@/data/producers";
import { brands, products, productsByBrand, roastLabels } from "@/data/products";
import { articleHref, href, lotHref, producerHref, productHref } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";
import { answerFor, lotPrice, type FactRow } from "./answers";
import { dicts, fill } from "./dicts";
import { CONTENT_UPDATED, facts, num, phrases } from "./facts";

export type MdPage = {
  lang: Locale;
  /** Public HTML path, e.g. /es/cafes/urr-024 */
  path: string;
  /** Markdown path, e.g. /md/es/cafes/urr-024 */
  mdPath: string;
  group: "green" | "shop" | "producers" | "buyers" | "optional" | "home";
  title: string;
  description: string;
  body: string;
};

export const mdPathOf = (path: string) => `/md${path}`;
export const absMd = (path: string) => absoluteUrl(mdPathOf(path));

const table = (head: [string, string], rows: FactRow[]) =>
  [`| ${head[0]} | ${head[1]} |`, "| --- | --- |", ...rows.map((r) => `| ${r.label} | ${r.value.replace(/\|/g, "/")} |`)].join("\n");

const grid = (head: string[], rows: string[][]) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, "/")).join(" | ")} |`)].join("\n");

const link = (text: string, path: string) => `[${text}](${absoluteUrl(path)})`;
const mdLink = (text: string, path: string) => `[${text}](${absMd(path)})`;

function wrap(lang: Locale, title: string, path: string, kind: Parameters<typeof answerFor>[1], id: string | undefined, sections: string[]) {
  const a = answerFor(lang, kind, id);
  const es = lang === "es";
  return [
    `# ${title}`,
    "",
    a.answer,
    "",
    table(es ? ["Dato", "Detalle"] : ["Fact", "Detail"], a.rows),
    "",
    `*${a.note}*`,
    "",
    ...sections.flatMap((s) => [s, ""]),
    `Source: ${absoluteUrl(path)}`,
    `Updated: ${CONTENT_UPDATED}`,
    `Language: ${lang}`,
    "",
  ].join("\n");
}

function lotsTable(lang: Locale, list = lots) {
  const es = lang === "es";
  return grid(
    es ? ["Lote", "Café", "Productor y finca", "Altitud", "Puntaje SCA", "Disponible", "Precio"] : ["Lot", "Coffee", "Producer and farm", "Altitude", "SCA score", "Available", "Price"],
    list.map((l) => [
      mdLink(l.code, lotHref(lang, l.code)),
      l.name[lang],
      `${l.producerName}, ${l.farm}`,
      `${num(lang, l.altitudeM)} m`,
      l.score === null ? (es ? "Sin catar" : "Not yet cupped") : num(lang, l.score, 2),
      `${num(lang, l.availableKg)} kg`,
      lotPrice(lang, l.priceUsdPerKg),
    ]),
  );
}

function faqMd(items: readonly { q: string; a: string }[]) {
  return items.map((i) => `### ${i.q}\n\n${i.a}`).join("\n\n");
}

function productsTable(lang: Locale, list = products) {
  const es = lang === "es";
  return grid(
    es ? ["Café", "Marca", "Tostión", "Notas", "Tamaño", "Precio"] : ["Coffee", "Brand", "Roast", "Notes", "Size", "Price"],
    list.map((p) => [
      link(p.name[lang], productHref(lang, p.slug)),
      p.brand,
      roastLabels[p.roastLevel][lang],
      p.notes[lang],
      `${p.sizes[0].grams} g`,
      `COP ${num(lang, p.sizes[0].priceCop)}`,
    ]),
  );
}

function build(lang: Locale): MdPage[] {
  const d = dicts(lang);
  const p = phrases(lang);
  const es = lang === "es";
  const pages: MdPage[] = [];
  const add = (path: string, group: MdPage["group"], title: string, description: string, body: string) =>
    pages.push({ lang, path, mdPath: mdPathOf(path), group, title, description, body });

  // Home
  const homeFaq = d.faq.home;
  add(href(lang, "home"), "home", facts.name, d.hero.meta.description, wrap(lang, facts.name, href(lang, "home"), "home", undefined, [
    `## ${es ? "Dos líneas de negocio" : "Two business lines"}`,
    `- ${p.greenLine} ${mdLink(es ? "Ver los lotes" : "See the lots", href(lang, "coffees"))}.\n- ${p.roastedLine} ${mdLink(es ? "Ver la tienda" : "See the shop", href(lang, "shop"))}.`,
    `## ${es ? "Lotes de café verde (datos de ejemplo)" : "Green coffee lots (example data)"}\n\n${lotsTable(lang)}`,
    `## ${es ? "Productores" : "Producers"}\n\n${producers.map((x) => `- ${mdLink(x.name, producerHref(lang, x.slug))}: ${x.tagline[lang]}`).join("\n")}`,
    `## ${es ? "Niveles de confianza" : "Trust levels"}\n\n${es ? "Registrado, Finca verificada y Café verificado. Cada insignia dice solo lo que verificamos nosotros." : "Registered, Farm verified and Coffee verified. Each badge says only what we checked ourselves."} ${mdLink(es ? "Cómo funciona" : "How it works", href(lang, "forBuyers"))}.`,
    `## ${es ? "Preguntas frecuentes" : "Frequently asked questions"}\n\n${faqMd(homeFaq)}`,
  ]));

  // Catalog
  add(href(lang, "coffees"), "green", d.lotsPage.banner.title + " " + d.lotsPage.banner.accent, d.lotsPage.meta.description, wrap(lang, `${d.lotsPage.banner.title} ${d.lotsPage.banner.accent}`, href(lang, "coffees"), "lots", undefined, [
    `## ${d.lotsPage.gridHeading}\n\n${lotsTable(lang)}`,
    `${es ? "Solicita una muestra gratis" : "Request a free sample"}: ${link(es ? "Muestras" : "Samples", href(lang, "samples"))}.`,
  ]));

  // Lots
  for (const lot of lots) {
    const path = lotHref(lang, lot.code);
    const title = `${lot.name[lang]}, ${es ? "lote" : "lot"} ${lot.code}`;
    const verification = d.lotsPage.card.badges[lot.verification];
    const producerLine = lot.producerSlug ? mdLink(lot.producerName, producerHref(lang, lot.producerSlug)) : lot.producerName;
    const spec: FactRow[] = [
      { label: es ? "Lote" : "Lot", value: lot.code },
      { label: es ? "Productor" : "Producer", value: producerLine },
      { label: es ? "Finca" : "Farm", value: `${lot.farm}, ${lot.region}` },
      { label: es ? "Puntaje SCA" : "SCA score", value: lot.score === null ? (es ? "Aún no catado" : "Not yet cupped") : num(lang, lot.score, 2) },
      { label: es ? "Notas de sabor" : "Flavor notes", value: lot.notes[lang].join(", ") },
      { label: es ? "Disponible" : "Available", value: `${num(lang, lot.availableKg)} kg (${lot.availableBags} ${es ? "bultos de 35 kg" : "bags of 35 kg"})` },
      { label: es ? "Pedido mínimo" : "Minimum order", value: `${lot.minOrderKg} kg` },
      { label: es ? "Muestra" : "Sample", value: lot.sampleAvailable ? p.sample : es ? "No disponible" : "Not available" },
      { label: es ? "Nivel de confianza" : "Trust level", value: verification },
    ];
    if (lot.detail) {
      spec.push(
        { label: es ? "Proceso (detalle)" : "Process detail", value: lot.detail.processNote[lang] },
        { label: es ? "Humedad" : "Moisture", value: `${num(lang, lot.detail.moisturePct, 1)} %` },
        { label: es ? "Actividad de agua" : "Water activity", value: `${num(lang, lot.detail.waterActivity, 2)} aw` },
        { label: es ? "Empaque" : "Packaging", value: lot.detail.packaging[lang] },
        { label: es ? "Almacenado en" : "Stored in", value: lot.detail.storedIn },
      );
    }
    add(path, "green", title, answerFor(lang, "lot", lot.code).answer, wrap(lang, title, path, "lot", lot.code, [
      `## ${es ? "Especificaciones" : "Specifications"}\n\n${table(es ? ["Campo", "Valor"] : ["Field", "Value"], spec)}`,
      `## ${es ? "Cómo comprar" : "How to buy"}\n\n${es ? "Pide una muestra gratis, cátala y confirma tu pedido." : "Request a free sample, cup it, then confirm your order."} ${link(es ? "Pedir muestra" : "Request a sample", href(lang, "samples"))} · ${mdLink(es ? "Para compradores" : "For buyers", href(lang, "forBuyers"))} · ${mdLink(es ? "Todos los lotes" : "All lots", href(lang, "coffees"))}`,
    ]));
  }

  // Producers
  add(href(lang, "producers"), "producers", `${d.producersPage.banner.title} ${d.producersPage.banner.accent}`, d.producersPage.meta.description, [
    `# ${d.producersPage.banner.title} ${d.producersPage.banner.accent}`,
    "",
    es
      ? `${facts.name} trabaja con ${producers.length} familias productoras de café en Urrao, Antioquia, Colombia. Cada lote tiene un productor con nombre y una finca.`
      : `${facts.name} works with ${producers.length} coffee-growing families in Urrao, Antioquia, Colombia. Every lot has a named producer and a farm.`,
    "",
    grid(es ? ["Productor", "Finca", "Altitud", "Variedades", "Lotes verdes"] : ["Producer", "Farm", "Altitude", "Varieties", "Green lots"],
      producers.map((x) => [mdLink(x.name, producerHref(lang, x.slug)), x.farm, `${num(lang, x.altitudeM)} m`, x.varieties.join(", "), String(x.lotCodes.length)])),
    "",
    `*${p.exampleNote}*`,
    "",
    `Source: ${absoluteUrl(href(lang, "producers"))}`,
    `Updated: ${CONTENT_UPDATED}`,
    `Language: ${lang}`,
    "",
  ].join("\n"));

  for (const pr of producers) {
    const path = producerHref(lang, pr.slug);
    const own = lotsByProducer(pr.slug);
    const brand = brands.find((b) => b.slug === pr.brandSlug);
    const roasted = brand ? productsByBrand(brand.slug) : [];
    const spec: FactRow[] = [
      { label: es ? "Finca" : "Farm", value: pr.farm },
      { label: es ? "Ubicación" : "Location", value: `${pr.town}, Colombia` },
      { label: es ? "Nivel de confianza" : "Trust level", value: d.lotsPage.card.badges[pr.verification] },
      { label: es ? "Cultiva café desde" : "Growing coffee since", value: pr.coffeeSince === null ? (es ? "Por confirmar con el productor" : "To be confirmed with the producer") : String(pr.coffeeSince) },
    ];
    add(path, "producers", pr.name, pr.tagline[lang], wrap(lang, pr.name, path, "producer", pr.slug, [
      `## ${es ? "Perfil" : "Profile"}\n\n${pr.tagline[lang]}\n\n${table(es ? ["Campo", "Valor"] : ["Field", "Value"], spec)}\n\n${es ? "La historia del productor se escribirá junto con la familia y se publicará aquí." : "The producer's story is being written together with the family and will be published here."}`,
      `## ${es ? "Lotes de café verde" : "Green coffee lots"}\n\n${own.length ? lotsTable(lang, own) : d.producerPage.lots.empty}`,
      ...(brand && roasted.length
        ? [`## ${es ? `Café tostado: ${brand.name} (solo en Colombia)` : `Roasted coffee: ${brand.name} (Colombia only)`}\n\n${productsTable(lang, roasted)}`]
        : []),
    ]));
  }

  // For buyers
  const b = d.buyersPage;
  const priced = lots.filter((l) => l.priceUsdPerKg !== null);
  add(href(lang, "forBuyers"), "buyers", `${b.banner.title} ${b.banner.accent}`, b.meta.description, wrap(lang, `${b.banner.title} ${b.banner.accent}`, href(lang, "forBuyers"), "lots", undefined, [
    `## ${b.steps.title} ${b.steps.accent}\n\n${b.steps.text}\n\n${b.steps.items.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")}`,
    `## ${b.trust.title} ${b.trust.accent}\n\n${b.trust.text}\n\n${b.trust.items.map((s) => `- **${s.label}.** ${s.text}`).join("\n")}`,
    `## ${b.pricing.title} ${b.pricing.accent}\n\n${b.pricing.text}\n\n${table(es ? ["Concepto", "Detalle"] : ["Item", "Detail"], b.pricing.rows.map((r) => ({
      label: r.label,
      value: fill(r.value, { kg: facts.minOrderKg, g: facts.sampleGrams, min: num(lang, facts.usdMin, 2), max: num(lang, facts.usdMax, 2), n: lots.length - priced.length, total: lots.length }),
    })))}\n\n*${b.pricing.exampleNote}*\n\n**${b.pricing.fobTitle}.** ${b.pricing.fobText}`,
    `## ${b.logistics.title} ${b.logistics.accent}\n\n${b.logistics.text}\n\n${b.logistics.items.map((s) => `- **${s.title}.** ${s.text}`).join("\n")}\n\n${b.logistics.note}`,
    `## ${b.faq.title} ${b.faq.accent}\n\n${faqMd(d.faq.buyers)}`,
    `${link(es ? "Pedir una muestra gratis" : "Request a free sample", href(lang, "samples"))} · ${link(es ? "Contacto" : "Contact", href(lang, "contact"))}`,
  ]));

  // Shop (Colombia only)
  const sp = d.shopPage;
  add(href(lang, "shop"), "shop", sp.breadcrumbShop, sp.metaDescription, wrap(lang, sp.breadcrumbShop, href(lang, "shop"), "shop", undefined, [
    `## ${es ? "Cafés (datos de ejemplo)" : "Coffees (example data)"}\n\n${productsTable(lang)}`,
    `## ${es ? "Marcas de productores" : "Producer brands"}\n\n${brands.map((x) => `- ${x.name}, ${x.place}: ${productsByBrand(x.slug).length} ${es ? "cafés" : "coffees"}`).join("\n")}`,
    `## ${es ? "Entrega" : "Delivery"}\n\n${es ? "Los pedidos se entregan solo dentro de Colombia y se pagan en COP. Los compradores de otros países compran café verde." : "Orders are delivered inside Colombia only and priced in COP. Buyers in other countries purchase green coffee."} ${mdLink(es ? "Café verde para compradores" : "Green coffee for buyers", href(lang, "forBuyers"))}`,
  ]));

  // Urrao
  const u = d.regionsPage.urrao;
  const urraoTitle = es ? "Urrao, región cafetera de Antioquia" : "Urrao, Antioquia coffee region";
  const months = es ? ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNames = (idx: number) => harvestCalendar[idx].map((m) => months[m - 1]).join(", ");
  add(href(lang, "urrao"), "green", urraoTitle, d.regionsPage.urraoMeta.description, wrap(lang, urraoTitle, href(lang, "urrao"), "urrao", undefined, [
    `## ${u.geography.title} ${u.geography.accent}\n\n${u.geography.paragraphs.join("\n\n")}`,
    `## ${u.varieties.title} ${u.varieties.accent}\n\n${u.varieties.items.map((v) => `- **${v.name}.** ${v.text}`).join("\n")}\n\n*${u.varieties.note}*`,
    `## ${u.calendar.title} ${u.calendar.accent}\n\n${u.calendar.rows.map((r, i) => `- ${r}: ${monthNames(i)}`).join("\n")}\n\n*${u.calendar.note}*`,
    `## ${u.producers.title} ${u.producers.accent}\n\n${producers.map((x) => `- ${mdLink(x.name, producerHref(lang, x.slug))}, ${x.farm}`).join("\n")}`,
    `## ${u.lots.title} ${u.lots.accent}\n\n${lotsTable(lang)}`,
    `${u.map.coords} (${u.map.text})`,
  ]));

  // Journal (optional)
  for (const a of articles) {
    const path = articleHref(lang, a.id);
    const meta = d.journal.articles[a.id];
    const body = getBlocks(lang, a.id)
      .map((blk) => [blk.h2 ? `## ${blk.h2}` : "", ...blk.p.map((t) => t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, target) => `[${text}](${absMd(resolveTarget(lang, target))})`))].filter(Boolean).join("\n\n"))
      .join("\n\n");
    add(path, "optional", meta.name, meta.description, [
      `# ${meta.name}`, "", meta.description, "", body, "",
      `Source: ${absoluteUrl(path)}`, `Updated: ${a.dateModified}`, `Language: ${lang}`, "",
    ].join("\n"));
  }
  return pages;
}

const cache: Partial<Record<Locale, MdPage[]>> = {};
export function mdPages(lang: Locale): MdPage[] {
  return (cache[lang] ??= build(lang));
}
export const allMdPages = () => [...mdPages("en"), ...mdPages("es")];
export function findMdPage(segments: string[]): MdPage | undefined {
  const mdPath = `/md/${segments.join("/")}`;
  return allMdPages().find((p) => p.mdPath === mdPath);
}
