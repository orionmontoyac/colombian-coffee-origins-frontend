import type { Metadata } from "next";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import type { Producer } from "@/data/producers";
import { href, producerHref } from "@/lib/routes";
import { breadcrumb, graph, itemList, personWithFarm } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/site";

export { JsonLd } from "@/lib/seo/jsonld";

/** Directory and profile metadata through buildMetadata (generated OG image). */
export function pageMetadata({
  lang,
  title,
  description,
  paths,
}: {
  lang: Locale;
  title: string;
  description: string;
  paths: Record<Locale, string>;
}): Metadata {
  return buildMetadata({ lang, title, description, paths });
}

/** Urrao, Antioquia. Coordinates are the municipality's, not the farm's. */
const URRAO_GEO = { latitude: 6.3167, longitude: -76.1333 } as const;

export function directoryJsonLd(lang: Locale, dict: Dictionary, producers: Producer[]) {
  const t = dict.producersPage;
  return graph(
    breadcrumb([
      { name: dict.nav.home, path: href(lang, "home") },
      { name: t.breadcrumbList, path: href(lang, "producers") },
    ]),
    itemList({
      name: t.meta.title,
      items: producers.map((p) => ({ name: p.name, path: producerHref(lang, p.slug) })),
    }),
  );
}

export function profileJsonLd(lang: Locale, dict: Dictionary, producer: Producer) {
  const url = absoluteUrl(producerHref(lang, producer.slug));
  return graph(
    breadcrumb([
      { name: dict.nav.home, path: href(lang, "home") },
      { name: dict.producersPage.breadcrumbList, path: href(lang, "producers") },
      { name: producer.name, path: producerHref(lang, producer.slug) },
    ]),
    ...personWithFarm({
      url,
      name: producer.name,
      jobTitle: dict.producerPage.jsonLd.jobTitle,
      description: producer.tagline[lang],
      farm: producer.farm,
      varieties: producer.varieties,
      placeName: `${producer.farm}, ${producer.town}`,
      geo: URRAO_GEO,
    }),
  );
}
