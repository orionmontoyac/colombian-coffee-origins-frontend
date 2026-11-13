import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import type { Lot } from "@/data/lots";
import { alternates, href, lotHref } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

/**
 * Metadata for the catalog. The canonical never carries the filter query string, so every
 * filtered URL (`?process=washed`) points search engines at `/coffees`.
 */
export function lotsMetadata(lang: Locale, meta: { title: string; description: string }, image: string): Metadata {
  const paths = alternates("coffees");
  const url = absoluteUrl(paths[lang]);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: site.name,
      locale: lang === "es" ? "es_CO" : "en_US",
      type: "website",
      images: [{ url: absoluteUrl(image) }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

/** Organization, WebSite, BreadcrumbList and the ItemList of lot cards (SPEC section 6). */
export function lotsJsonLd(lang: Locale, opts: { homeLabel: string; pageLabel: string; lots: Lot[] }) {
  const pageUrl = absoluteUrl(href(lang, "coffees"));
  const homeUrl = absoluteUrl(href(lang, "home"));
  const links = sameAs();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.baseUrl}/#organization`,
        name: site.name,
        url: site.baseUrl,
        ...(links.length ? { sameAs: links } : {}),
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.contact.email, availableLanguage: ["en", "es"] },
      },
      {
        "@type": "WebSite",
        "@id": `${site.baseUrl}/#website`,
        name: site.name,
        url: homeUrl,
        inLanguage: lang,
        publisher: { "@id": `${site.baseUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: opts.homeLabel, item: homeUrl },
          { "@type": "ListItem", position: 2, name: opts.pageLabel, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: opts.pageLabel,
        url: pageUrl,
        inLanguage: lang,
        numberOfItems: opts.lots.length,
        itemListElement: opts.lots.map((lot, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(lotHref(lang, lot.code)),
          name: `${lot.name[lang]} (${lot.code})`,
        })),
      },
    ],
  };
}
