import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Lot } from "@/data/lots";
import { href, lotHref } from "@/lib/routes";
import { breadcrumb, graph, itemList } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/site";

/** The canonical never carries the filter query string, so filtered URLs (`?process=washed`) point at `/coffees`. */
export function lotsMetadata(lang: Locale, meta: { title: string; description: string }, _image?: string): Metadata {
  return buildMetadata({ lang, routeKey: "coffees", ...meta });
}

/** BreadcrumbList and the ItemList of lot cards (SPEC section 6). */
export function lotsJsonLd(lang: Locale, opts: { homeLabel: string; pageLabel: string; lots: Lot[] }) {
  return graph(
    breadcrumb([
      { name: opts.homeLabel, path: href(lang, "home") },
      { name: opts.pageLabel, path: href(lang, "coffees") },
    ]),
    itemList({
      name: opts.pageLabel,
      url: absoluteUrl(href(lang, "coffees")),
      lang,
      items: opts.lots.map((lot) => ({ name: `${lot.name[lang]} (${lot.code})`, path: lotHref(lang, lot.code) })),
    }),
  );
}
