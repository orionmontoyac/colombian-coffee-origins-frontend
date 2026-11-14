import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { RouteKey } from "@/lib/routes";
import { breadcrumb, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export function formMetadata(
  lang: Locale,
  key: RouteKey,
  meta: { title: string; description: string },
  _image?: string,
): Metadata {
  return buildMetadata({ lang, routeKey: key, ...meta });
}

/** BreadcrumbList only (no other types on form pages). Organization and WebSite come from the layout. */
export function formJsonLd(_lang: Locale, crumbs: { label: string; path: string }[]) {
  return graph(breadcrumb(crumbs.map((c) => ({ name: c.label, path: c.path }))));
}
