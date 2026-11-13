import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { alternates, href } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

export type FaqItem = { q: string; a: string };

export function buyersMetadata(lang: Locale, meta: { title: string; description: string }, image: string): Metadata {
  const paths = alternates("forBuyers");
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

/** Organization, WebSite, BreadcrumbList and FAQPage (built from the same items the page renders). */
export function buyersJsonLd(lang: Locale, opts: { homeLabel: string; pageLabel: string; faq: readonly FaqItem[] }) {
  const pageUrl = absoluteUrl(href(lang, "forBuyers"));
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
        "@type": "FAQPage",
        url: pageUrl,
        inLanguage: lang,
        mainEntity: opts.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
