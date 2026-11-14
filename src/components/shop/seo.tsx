import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { JsonLd, breadcrumb, organization, website } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export { JsonLd };

/** Full Organization and WebSite nodes. Shop pages build their graph by hand, not via `graph()`. */
export function organizationLd() {
  return organization();
}
export function websiteLd() {
  return website();
}
export const breadcrumbLd = breadcrumb;

/**
 * Shop metadata is static so it renders in <head>. The non-CO noindex is sent by src/proxy.ts as an
 * `X-Robots-Tag: noindex, follow` response header, so the meta robots tag stays index for everyone.
 */
export function shopMetadata({
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
