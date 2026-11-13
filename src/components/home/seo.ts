import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { alternates, href } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

export type FaqItem = { q: string; a: string };

/** Home metadata: title and description from dict.hero.meta, canonical, hreflang en/es/x-default. */
export function homeMetadata(lang: Locale, meta: { title: string; description: string }, image: string): Metadata {
  const paths = alternates("home");
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

/** Organization and WebSite, plus FAQPage built from the same three Q&A the teaser renders. */
export function homeJsonLd(lang: Locale, faq: readonly FaqItem[]) {
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
        "@type": "FAQPage",
        url: homeUrl,
        inLanguage: lang,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
