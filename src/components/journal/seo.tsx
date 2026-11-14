import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href, type RouteKey } from "@/lib/routes";
import { breadcrumb, graph as buildGraph, type Node } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export { JsonLd } from "@/lib/seo/jsonld";

/** Metadata through buildMetadata. `paths` are public paths per language; the OG image is generated. */
export function pageMeta({
  lang, title, description, paths, type = "website", noindex = false,
}: {
  lang: Locale; title: string; description: string; paths: Record<Locale, string>;
  image?: StaticImageData; type?: "website" | "article"; noindex?: boolean;
}): Metadata {
  return buildMetadata({ lang, title, description, paths, type, noindex });
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList plus the page's own nodes. Organization and WebSite are rendered by the layout. */
export function graph(_lang: Locale, crumbs: Crumb[], extra: unknown[] = []) {
  return buildGraph(breadcrumb(crumbs), ...(extra as Node[]));
}

export function homeCrumb(lang: Locale, dict: Dictionary): Crumb {
  return { name: dict.nav.home, path: href(lang, "home") };
}

export function routeCrumb(lang: Locale, key: RouteKey, name: string): Crumb {
  return { name, path: href(lang, key) };
}
