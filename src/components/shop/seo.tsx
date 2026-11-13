import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { getVisitorCountry } from "@/lib/geo";
import { absoluteUrl, sameAs, site } from "@/lib/site";

/** JSON-LD script. `<` is escaped so the data cannot close the tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/images/bean-brown.png"),
    sameAs: sameAs(),
    address: { "@type": "PostalAddress", addressLocality: "Urrao", addressRegion: site.region, addressCountry: site.country },
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: site.contact.email, telephone: site.contact.whatsappNumber },
  };
}

export function websiteLd(lang: Locale) {
  return { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: site.name, url: absoluteUrl("/"), inLanguage: lang };
}

export function breadcrumbLd(items: { name: string; path?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

/** Page metadata: canonical, hreflang, Open Graph, and `noindex` for visitors outside Colombia. */
export async function shopMetadata({
  lang,
  title,
  description,
  paths,
}: {
  lang: Locale;
  title: string;
  description: string;
  paths: Record<Locale, string>;
}): Promise<Metadata> {
  const country = await getVisitorCountry();
  const url = absoluteUrl(paths[lang]);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) },
    },
    // The shop ships inside Colombia only: other visitors get a 200 notice page that stays out of the index.
    robots: country === site.country ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: lang === "es" ? "es_CO" : "en_US",
      type: "website",
      // TODO(T3.1): replace with the generated OG image
      images: [{ url: absoluteUrl("/images/beans-caramel.png"), width: 1024, height: 1024, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
