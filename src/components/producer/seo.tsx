import type { Metadata } from "next";
import heroImage from "@/assets/home/hero-coffee-hills.jpg";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import type { Producer } from "@/data/producers";
import { absoluteUrl, site } from "@/lib/site";
import { href, producerHref } from "@/lib/routes";

/** Alternates + Open Graph shared by the directory and the profile. */
export function pageMetadata({
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
  const url = absoluteUrl(paths[lang]);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: lang === "es" ? "es_CO" : "en_US",
      images: [{ url: absoluteUrl(heroImage.src), width: heroImage.width, height: heroImage.height }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Urrao, Antioquia. Coordinates are the municipality's, not the farm's. */
const URRAO_GEO = { "@type": "GeoCoordinates", latitude: 6.3167, longitude: -76.1333 } as const;

function baseNodes(lang: Locale) {
  const origin = site.baseUrl;
  return [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: site.name,
      url: `${origin}/${lang}`,
      address: { "@type": "PostalAddress", addressLocality: "Urrao", addressRegion: "Antioquia", addressCountry: "CO" },
    },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: site.name, url: origin, inLanguage: lang },
  ];
}

function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function directoryJsonLd(lang: Locale, dict: Dictionary, producers: Producer[]) {
  const t = dict.producersPage;
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...baseNodes(lang),
      breadcrumb([
        { name: dict.nav.home, path: href(lang, "home") },
        { name: t.breadcrumbList, path: href(lang, "producers") },
      ]),
      {
        "@type": "ItemList",
        name: t.meta.title,
        numberOfItems: producers.length,
        itemListElement: producers.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(producerHref(lang, p.slug)),
          name: p.name,
        })),
      },
    ],
  };
}

export function profileJsonLd(lang: Locale, dict: Dictionary, producer: Producer) {
  const url = absoluteUrl(producerHref(lang, producer.slug));
  const placeId = `${url}#place`;
  const farmId = `${url}#farm`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...baseNodes(lang),
      breadcrumb([
        { name: dict.nav.home, path: href(lang, "home") },
        { name: dict.producersPage.breadcrumbList, path: href(lang, "producers") },
        { name: producer.name, path: producerHref(lang, producer.slug) },
      ]),
      {
        "@type": "Person",
        "@id": `${url}#person`,
        name: producer.name,
        url,
        jobTitle: dict.producerPage.jsonLd.jobTitle,
        description: producer.tagline[lang],
        worksFor: { "@id": farmId },
        affiliation: { "@id": farmId },
        homeLocation: { "@id": placeId },
      },
      {
        "@type": "Organization",
        "@id": farmId,
        name: producer.farm,
        location: { "@id": placeId },
        knowsAbout: producer.varieties,
      },
      {
        "@type": "Place",
        "@id": placeId,
        name: `${producer.farm}, ${producer.town}`,
        geo: URRAO_GEO,
        address: { "@type": "PostalAddress", addressLocality: "Urrao", addressRegion: "Antioquia", addressCountry: "CO" },
        containedInPlace: { "@type": "AdministrativeArea", name: "Antioquia, Colombia" },
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so producer text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
