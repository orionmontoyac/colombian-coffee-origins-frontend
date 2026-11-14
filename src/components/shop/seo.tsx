import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { JsonLd, ORG_ID, WEBSITE_ID, breadcrumb } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export { JsonLd };

/**
 * The layout renders the full Organization and WebSite once; these return node references by @id
 * so existing graphs stay valid without repeating the nodes.
 */
export function organizationLd() {
  return { "@id": ORG_ID };
}
export function websiteLd(_lang?: Locale) {
  return { "@id": WEBSITE_ID };
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
