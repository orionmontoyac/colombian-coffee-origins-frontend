import type { MetadataRoute } from "next";
import { articles } from "@/components/journal/articles";
import { lots } from "@/data/lots";
import { producers } from "@/data/producers";
import { products } from "@/data/products";
import { alternates, articleAlternates, lotAlternates, producerAlternates, productAlternates, routeKeys } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

/**
 * Every indexable URL in both languages with hreflang alternates. Left out on purpose: filtered
 * catalog URLs (?process=...), /md/* Markdown twins, and any form success page (none exist).
 * Shop URLs stay in; non-CO crawlers get noindex on the page itself (see DECISIONS.md).
 */
const BUILD_DATE = new Date("2026-11-13");

function entries(paths: Record<"en" | "es", string>, priority: number, lastModified: Date = BUILD_DATE): MetadataRoute.Sitemap {
  const languages = { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) };
  return (["en", "es"] as const).map((lang) => ({
    url: absoluteUrl(paths[lang]),
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = routeKeys.flatMap((key) => entries(alternates(key), key === "home" ? 1 : 0.7));
  return [
    ...staticRoutes,
    ...lots.flatMap((l) => entries(lotAlternates(l.code), 0.8)),
    ...producers.flatMap((p) => entries(producerAlternates(p.slug), 0.7)),
    ...products.flatMap((p) => entries(productAlternates(p.slug), 0.6)),
    ...articles.flatMap((a) => entries(articleAlternates(a.id), 0.6, new Date(a.dateModified))),
  ];
}
