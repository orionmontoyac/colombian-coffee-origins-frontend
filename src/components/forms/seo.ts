import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { alternates, href, type RouteKey } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

export function formMetadata(
  lang: Locale,
  key: RouteKey,
  meta: { title: string; description: string },
  image: string,
): Metadata {
  const paths = alternates(key);
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

/** Organization, WebSite and BreadcrumbList (no other types on form pages). */
export function formJsonLd(lang: Locale, crumbs: { label: string; path: string }[]) {
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
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.label,
          item: absoluteUrl(c.path),
        })),
      },
    ],
  };
}
