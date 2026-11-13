import type { Locale } from "@/app/[lang]/dictionaries";
import type { Lot } from "@/data/lots";
import { href, lotHref } from "@/lib/routes";
import { absoluteUrl, sameAs, site } from "@/lib/site";

export type LotJsonLdProps = {
  lang: Locale;
  lot: Lot;
  /** Localized "Variety Process" name */
  name: string;
  description: string;
  processLabel: string;
  breadcrumb: { homeLabel: string; lotsLabel: string; regionLabel: string };
};

/** Organization + WebSite + BreadcrumbList + Product (with Offer only when the lot has a price). */
export function LotJsonLd({ lang, lot, name, description, processLabel, breadcrumb }: LotJsonLdProps) {
  const url = absoluteUrl(lotHref(lang, lot.code));
  const prop = (n: string, value: string | number, unitCode?: string) => ({
    "@type": "PropertyValue",
    name: n,
    value,
    ...(unitCode ? { unitCode } : {}),
  });

  const product = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: `${name} (${lot.code})`,
    sku: lot.code,
    description,
    url,
    image: [absoluteUrl(lot.image.src)],
    category: "Green coffee",
    brand: { "@type": "Brand", name: lot.farm },
    countryOfOrigin: { "@type": "Country", name: "Colombia" },
    additionalProperty: [
      prop("Altitude", lot.altitudeM, "MTR"),
      prop("Process", processLabel),
      prop("Variety", lot.variety),
      ...(lot.score !== null ? [prop("SCA score", lot.score)] : []),
    ],
    ...(lot.priceUsdPerKg !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "USD",
            price: lot.priceUsdPerKg.toFixed(2),
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: lot.priceUsdPerKg.toFixed(2),
              priceCurrency: "USD",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
            },
            eligibleQuantity: { "@type": "QuantitativeValue", minValue: lot.minOrderKg, unitCode: "KGM" },
          },
        }
      : {}),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.baseUrl}/#organization`,
        name: site.name,
        url: site.baseUrl,
        ...(sameAs().length ? { sameAs: sameAs() } : {}),
        contactPoint: { "@type": "ContactPoint", contactType: "sales", email: site.contact.email },
      },
      { "@type": "WebSite", "@id": `${site.baseUrl}/#website`, name: site.name, url: site.baseUrl, inLanguage: lang },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: breadcrumb.homeLabel, item: absoluteUrl(href(lang, "home")) },
          { "@type": "ListItem", position: 2, name: breadcrumb.lotsLabel, item: absoluteUrl(href(lang, "coffees")) },
          { "@type": "ListItem", position: 3, name: breadcrumb.regionLabel, item: absoluteUrl(href(lang, "urrao")) },
          { "@type": "ListItem", position: 4, name: lot.code, item: url },
        ],
      },
      product,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
