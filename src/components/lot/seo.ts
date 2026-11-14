import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Lot } from "@/data/lots";
import { href, lotAlternates, lotHref } from "@/lib/routes";
import { breadcrumb, graph, greenLotProduct } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/site";

/** Lot detail metadata: canonical, hreflang, Markdown alternate and the generated OG image of the lot. */
export function lotMetadata(lang: Locale, lot: Lot, meta: { title: string; description: string }): Metadata {
  return buildMetadata({ lang, paths: lotAlternates(lot.code), ...meta });
}

/**
 * Lot graph: BreadcrumbList (home, lots, Urrao, lot) and Product with an Offer only when the lot has a price.
 * Organization and WebSite come from the layout. Render with `<JsonLd data={lotJsonLd(...)} />`.
 */
export function lotJsonLd(
  lang: Locale,
  lot: Lot,
  opts: {
    name: string;
    description: string;
    processLabel: string;
    breadcrumb: { homeLabel: string; lotsLabel: string; regionLabel: string };
  },
) {
  const url = absoluteUrl(lotHref(lang, lot.code));
  return graph(
    breadcrumb([
      { name: opts.breadcrumb.homeLabel, path: href(lang, "home") },
      { name: opts.breadcrumb.lotsLabel, path: href(lang, "coffees") },
      { name: opts.breadcrumb.regionLabel, path: href(lang, "urrao") },
      { name: lot.code, path: lotHref(lang, lot.code) },
    ]),
    greenLotProduct({
      url,
      code: lot.code,
      name: opts.name,
      description: opts.description,
      image: [absoluteUrl(lot.image.src)],
      farm: lot.farm,
      altitudeM: lot.altitudeM,
      process: opts.processLabel,
      variety: lot.variety,
      score: lot.score,
      priceUsdPerKg: lot.priceUsdPerKg,
      minOrderKg: lot.minOrderKg,
    }),
  );
}
