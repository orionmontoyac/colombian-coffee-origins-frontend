import type { Locale } from "@/app/[lang]/dictionaries";
import { getLot, lots, lotsByProducer } from "@/data/lots";
import { getProducer } from "@/data/producers";
import { brands, products, productsByBrand } from "@/data/products";
import { dicts, joinList } from "./dicts";
import { facts, num, phrases } from "./facts";

export type FactRow = { label: string; value: string };
export type Answer = { answer: string; rows: FactRow[]; note: string };
export type AnswerKind = "home" | "lots" | "lot" | "producer" | "shop" | "urrao";

const L = (lang: Locale) =>
  lang === "es"
    ? {
        region: "Región", altitude: "Altitud", varieties: "Variedades", variety: "Variedad", process: "Proceso",
        harvest: "Cosecha", priceUnit: "Unidad de precio", price: "Precio", ships: "Envío a", greenCoffee: "Café verde",
        roasted: "Café tostado", minOrder: "Pedido mínimo", sample: "Muestra", delivery: "Entrega", currency: "Moneda",
        brands: "Marcas de productores", coffees: "Cafés", roast: "Tostión", sizes: "Tamaños", farm: "Finca",
        onRequest: "Precio a consulta", worldwide: "Todo el mundo (café verde)", colombiaOnly: "Solo en Colombia",
      }
    : {
        region: "Region", altitude: "Altitude", varieties: "Varieties", variety: "Variety", process: "Process",
        harvest: "Harvest", priceUnit: "Price unit", price: "Price", ships: "Ships to", greenCoffee: "Green coffee",
        roasted: "Roasted coffee", minOrder: "Minimum order", sample: "Sample", delivery: "Delivery", currency: "Currency",
        brands: "Producer brands", coffees: "Coffees", roast: "Roast", sizes: "Sizes", farm: "Farm",
        onRequest: "Price on request", worldwide: "Worldwide (green coffee)", colombiaOnly: "Colombia only",
      };

export function lotName(lang: Locale, code: string) {
  const lot = getLot(code)!;
  return lot.name[lang];
}
export const processLabel = (lang: Locale, p: "washed" | "honey" | "natural") => dicts(lang).lotsPage.card.processes[p];
export const lotPrice = (lang: Locale, price: number | null) =>
  price === null ? L(lang).onRequest : `USD ${num(lang, price, 2)} ${lang === "es" ? "por kg" : "per kg"} FOB`;

export function answerFor(lang: Locale, kind: AnswerKind, id?: string): Answer {
  const l = L(lang);
  const p = phrases(lang);
  const es = lang === "es";
  const procs = joinList(lang, [...new Set(lots.map((x) => processLabel(lang, x.process).toLowerCase()))]);
  const note = p.exampleNote;

  if (kind === "home") {
    return {
      answer: p.summary,
      note,
      rows: [
        { label: l.region, value: facts.origin },
        { label: l.varieties, value: joinList(lang, [...facts.varieties]) },
        { label: l.harvest, value: p.harvest },
        { label: l.greenCoffee, value: `${p.priceUnit}; ${p.usdRange} (${es ? "ejemplo" : "example"}); ${p.minOrder}; ${p.sample}` },
        { label: l.roasted, value: `COP; ${p.copRange} (${es ? "ejemplo" : "example"}); ${l.colombiaOnly}` },
        { label: l.ships, value: `${p.shipsGreen}; ${p.shipsRoasted}` },
      ],
    };
  }
  if (kind === "lots") {
    const names = lots.map((x) => `${x.name[lang]} (${x.code})`);
    return {
      answer: es
        ? `${facts.name} lista ${facts.lotCount} lotes de café verde de fincas familiares de ${facts.origin}: ${joinList(lang, names)}.`
        : `${facts.name} lists ${facts.lotCount} green coffee lots from family farms in ${facts.origin}: ${joinList(lang, names)}.`,
      note,
      rows: [
        { label: l.altitude, value: p.altitudeRange },
        { label: l.varieties, value: joinList(lang, [...facts.varieties]) },
        { label: l.process, value: procs },
        { label: l.harvest, value: p.harvest },
        { label: l.priceUnit, value: `${p.priceUnit}; ${p.usdRange} (${es ? "ejemplo" : "example"})` },
        { label: l.ships, value: p.shipsGreen },
      ],
    };
  }
  if (kind === "lot") {
    const lot = getLot(id!)!;
    const proc = processLabel(lang, lot.process);
    const scoreBit = lot.score !== null ? (es ? `, con puntaje SCA de ${num(lang, lot.score, 2)}` : `, scoring ${num(lang, lot.score, 2)} on the SCA scale`) : "";
    return {
      answer: es
        ? `${lot.name[lang]} (lote ${lot.code}) es un café verde de ${lot.variety}, proceso ${proc.toLowerCase()}, cultivado por ${lot.producerName} en ${lot.farm}, ${facts.origin}, a ${num(lang, lot.altitudeM)} m${scoreBit}.`
        : `${lot.name[lang]} (lot ${lot.code}) is a ${lot.variety} green coffee, ${proc.toLowerCase()} process, grown by ${lot.producerName} at ${lot.farm}, ${facts.origin}, at ${num(lang, lot.altitudeM)} m${scoreBit}.`,
      note,
      rows: [
        { label: l.altitude, value: `${num(lang, lot.altitudeM)} m` },
        { label: l.variety, value: lot.variety },
        { label: l.process, value: proc },
        { label: l.harvest, value: lot.harvest[lang] },
        { label: l.price, value: `${lotPrice(lang, lot.priceUsdPerKg)}; ${l.minOrder.toLowerCase()} ${lot.minOrderKg} kg` },
        { label: l.ships, value: p.shipsGreen },
      ],
    };
  }
  if (kind === "producer") {
    const pr = getProducer(id!)!;
    const own = lotsByProducer(pr.slug);
    const brand = pr.brandSlug ? brands.find((b) => b.slug === pr.brandSlug) : undefined;
    const roasted = brand && productsByBrand(brand.slug).length > 0;
    const procsOwn = joinList(lang, [...new Set(own.map((x) => processLabel(lang, x.process).toLowerCase()))]);
    const priced = own.flatMap((x) => (x.priceUsdPerKg === null ? [] : [x.priceUsdPerKg]));
    return {
      answer: es
        ? `${pr.name} cultiva ${joinList(lang, pr.varieties)} en ${pr.farm}, ${pr.town}, Colombia, a ${num(lang, pr.altitudeM)} m, y ofrece ${own.length} ${own.length === 1 ? "lote" : "lotes"} de café verde${roasted ? ` y café tostado bajo la marca ${brand!.name} (solo en Colombia)` : ""}.`
        : `${pr.name} grows ${joinList(lang, pr.varieties)} at ${pr.farm}, ${pr.town}, Colombia, at ${num(lang, pr.altitudeM)} m, and offers ${own.length} green coffee ${own.length === 1 ? "lot" : "lots"}${roasted ? ` and roasted coffee under the ${brand!.name} brand (Colombia only)` : ""}.`,
      note,
      rows: [
        { label: l.altitude, value: `${num(lang, pr.altitudeM)} m` },
        { label: l.varieties, value: joinList(lang, pr.varieties) },
        { label: l.process, value: procsOwn || "-" },
        { label: l.harvest, value: p.harvest },
        { label: l.priceUnit, value: priced.length ? `${p.priceUnit}; USD ${num(lang, Math.min(...priced), 2)}${priced.length > 1 ? `–${num(lang, Math.max(...priced), 2)}` : ""} (${es ? "ejemplo" : "example"})` : `${p.priceUnit}; ${l.onRequest.toLowerCase()}` },
        { label: l.ships, value: roasted ? `${p.shipsGreen}; ${p.shipsRoasted}` : p.shipsGreen },
      ],
    };
  }
  if (kind === "shop") {
    const roastLevels = [...new Set(products.map((x) => x.roastLevel))];
    return {
      answer: es
        ? `La tienda de ${facts.name} vende ${products.length} cafés tostados de ${brands.length} marcas de productores de Urrao, Antioquia, en pesos colombianos (COP) y con entrega solo dentro de Colombia.`
        : `The ${facts.name} shop sells ${products.length} roasted coffees from ${brands.length} producer brands in Urrao, Antioquia, priced in Colombian pesos (COP) and delivered inside Colombia only.`,
      note,
      rows: [
        { label: l.delivery, value: l.colombiaOnly },
        { label: l.currency, value: `COP; ${p.copRange} (${es ? "ejemplo" : "example"})` },
        { label: l.coffees, value: String(products.length) },
        { label: l.brands, value: String(brands.length) },
        { label: l.roast, value: `${roastLevels.length} ${es ? "niveles, de clara a oscura" : "levels, light to dark"}` },
        { label: l.ships, value: l.colombiaOnly },
      ],
    };
  }
  // urrao
  const rows = dicts(lang).regionsPage.urrao.facts.rows;
  const row = (i: number) => rows[i].value;
  return {
    answer: es
      ? `Urrao es un pueblo de montaña en el occidente de Antioquia, Colombia, al borde del Páramo del Sol, donde fincas familiares cultivan Chiroso, Castillo y Caturra entre 1.800 y 2.300 m.`
      : `Urrao is a mountain town in western Antioquia, Colombia, at the edge of the Páramo del Sol, where family farms grow Chiroso, Castillo and Caturra at 1,800–2,300 m.`,
    note: dicts(lang).regionsPage.urrao.facts.note,
    rows: [
      { label: l.altitude, value: row(2) },
      { label: l.varieties, value: row(3) },
      { label: l.process, value: procs },
      { label: l.harvest, value: row(5) },
      { label: l.priceUnit, value: `${p.priceUnit} (${es ? "café verde" : "green coffee"})` },
      { label: l.ships, value: `${p.shipsGreen}; ${p.shipsRoasted}` },
    ],
  };
}
