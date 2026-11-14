import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";
import { breadcrumb, faqPage, graph } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/site";

export type FaqItem = { q: string; a: string };

export function buyersMetadata(lang: Locale, meta: { title: string; description: string }, _image?: string): Metadata {
  return buildMetadata({ lang, routeKey: "forBuyers", ...meta });
}

/** BreadcrumbList and FAQPage (built from the same items the page renders). */
export function buyersJsonLd(lang: Locale, opts: { homeLabel: string; pageLabel: string; faq: readonly FaqItem[] }) {
  return graph(
    breadcrumb([
      { name: opts.homeLabel, path: href(lang, "home") },
      { name: opts.pageLabel, path: href(lang, "forBuyers") },
    ]),
    faqPage({ url: absoluteUrl(href(lang, "forBuyers")), lang, items: opts.faq }),
  );
}
