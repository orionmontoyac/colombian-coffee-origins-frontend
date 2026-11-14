import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqPage, graph } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/site";

export type FaqItem = { q: string; a: string };

/** Home metadata through buildMetadata. The Open Graph image is the generated /[lang]/opengraph-image. */
export function homeMetadata(lang: Locale, meta: { title: string; description: string }, _image?: string): Metadata {
  return buildMetadata({ lang, routeKey: "home", ...meta });
}

/** FAQPage built from the same three Q&A the teaser renders. Organization and WebSite come from the layout. */
export function homeJsonLd(lang: Locale, faq: readonly FaqItem[]) {
  return graph(faqPage({ url: absoluteUrl(href(lang, "home")), lang, items: faq }));
}
