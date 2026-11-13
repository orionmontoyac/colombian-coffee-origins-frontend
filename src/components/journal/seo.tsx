import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href, type RouteKey } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

/** Metadata with canonical, hreflang and Open Graph. `paths` are public paths per language. */
export function pageMeta({
  lang, title, description, paths, image, type = "website", noindex = false,
}: {
  lang: Locale; title: string; description: string; paths: Record<Locale, string>;
  image: StaticImageData; type?: "website" | "article"; noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(paths[lang]);
  return {
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) },
    },
    openGraph: {
      title, description, url, siteName: site.name, type,
      locale: lang === "es" ? "es_CO" : "en_US",
      images: [{ url: absoluteUrl(image.src), width: image.width, height: image.height }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type Crumb = { name: string; path: string };

export function orgNodes(lang: Locale) {
  const links = sameAs();
  return [
    {
      "@type": "Organization",
      "@id": `${site.baseUrl}/#organization`,
      name: site.name,
      url: `${site.baseUrl}/${lang}`,
      ...(links.length ? { sameAs: links } : {}),
      address: { "@type": "PostalAddress", addressLocality: "Urrao", addressRegion: "Antioquia", addressCountry: "CO" },
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: site.contact.email, availableLanguage: ["en", "es"] },
    },
    { "@type": "WebSite", "@id": `${site.baseUrl}/#website`, name: site.name, url: site.baseUrl, inLanguage: lang },
  ];
}

export function breadcrumbNode(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function graph(lang: Locale, crumbs: Crumb[], extra: unknown[] = []) {
  return { "@context": "https://schema.org", "@graph": [...orgNodes(lang), breadcrumbNode(crumbs), ...extra] };
}

export function homeCrumb(lang: Locale, dict: Dictionary): Crumb {
  return { name: dict.nav.home, path: href(lang, "home") };
}

export function routeCrumb(lang: Locale, key: RouteKey, name: string): Crumb {
  return { name, path: href(lang, key) };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
