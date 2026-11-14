import type { Locale } from "@/app/[lang]/dictionaries";
import { absoluteUrl, sameAs, site } from "@/lib/site";

/**
 * Typed JSON-LD builders (SPEC section 6). Rules: never output a property without real or clearly
 * example data, and never output aggregateRating or review. Organization and WebSite are rendered
 * once by the [lang] layout; pages reference them by @id.
 */
export type Node = Record<string, unknown>;

export const ORG_ID = `${site.baseUrl}/#organization`;
export const WEBSITE_ID = `${site.baseUrl}/#website`;
export const orgRef = { "@id": ORG_ID } as const;

const address = {
  "@type": "PostalAddress",
  addressLocality: "Urrao",
  addressRegion: site.region,
  addressCountry: site.country,
} as const;

/** `<script type="application/ld+json">` with "<" escaped so text can never close the tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** `{ "@context", "@graph" }` wrapper. */
export function graph(...nodes: (Node | false | null | undefined)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) as Node[] };
}

export function organization(): Node {
  const links = sameAs();
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/en"),
    logo: absoluteUrl("/images/bean-brown.png"),
    description:
      "Colombian Coffee Origins connects family coffee farms in Urrao, Antioquia, with roasters and importers (green coffee, USD per kg FOB) and sells roasted coffee inside Colombia (COP).",
    areaServed: "Worldwide",
    ...(links.length ? { sameAs: links } : {}),
    address,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: site.contact.email,
      telephone: site.contact.whatsappNumber,
      availableLanguage: ["English", "Spanish"],
    },
  };
}

export function website(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absoluteUrl("/en"),
    inLanguage: ["en", "es"],
    publisher: orgRef,
  };
}

export type Crumb = { name: string; path?: string };

export function breadcrumb(items: Crumb[]): Node {
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

export function itemList(opts: { name: string; url?: string; lang?: Locale; items: { name: string; path?: string }[] }): Node {
  return {
    "@type": "ItemList",
    name: opts.name,
    ...(opts.url ? { url: opts.url } : {}),
    ...(opts.lang ? { inLanguage: opts.lang } : {}),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { url: absoluteUrl(it.path) } : {}),
    })),
  };
}

const prop = (name: string, value: string | number, unitCode?: string): Node => ({
  "@type": "PropertyValue",
  name,
  value,
  ...(unitCode ? { unitCode } : {}),
});

/** Green coffee lot: USD per kg FOB as a UnitPriceSpecification; no Offer when the price is on request. */
export function greenLotProduct(opts: {
  url: string;
  code: string;
  name: string;
  description: string;
  image: string[];
  farm: string;
  altitudeM: number;
  process: string;
  variety: string;
  score: number | null;
  priceUsdPerKg: number | null;
  minOrderKg: number;
}): Node {
  const price = opts.priceUsdPerKg?.toFixed(2);
  return {
    "@type": "Product",
    "@id": `${opts.url}#product`,
    name: `${opts.name} (${opts.code})`,
    sku: opts.code,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    category: "Green coffee",
    brand: { "@type": "Brand", name: opts.farm },
    countryOfOrigin: { "@type": "Country", name: "Colombia" },
    additionalProperty: [
      prop("Altitude", opts.altitudeM, "MTR"),
      prop("Process", opts.process),
      prop("Variety", opts.variety),
      ...(opts.score !== null ? [prop("SCA score", opts.score)] : []),
    ],
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            url: opts.url,
            priceCurrency: "USD",
            price,
            availability: "https://schema.org/InStock",
            seller: orgRef,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price,
              priceCurrency: "USD",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
            },
            eligibleQuantity: { "@type": "QuantitativeValue", minValue: opts.minOrderKg, unitCode: "KGM" },
          },
        }
      : {}),
  };
}

/** Roasted coffee (Colombia only): COP offer, shipping inside Colombia and a return policy. Policy numbers are example data. */
export function roastedProduct(opts: {
  url: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  image?: string[];
  grams: number;
  priceCop: number;
  roast: string;
  roastLevel: number;
  shippingCop: number;
  returnDays: number;
  handlingDays: { min: number; max: number };
  transitDays: { min: number; max: number };
}): Node {
  return {
    "@type": "Product",
    "@id": `${opts.url}#product`,
    name: opts.name,
    description: opts.description,
    sku: opts.sku,
    category: "Coffee",
    ...(opts.image?.length ? { image: opts.image } : {}),
    brand: { "@type": "Brand", name: opts.brand },
    weight: { "@type": "QuantitativeValue", value: opts.grams, unitCode: "GRM" },
    additionalProperty: [
      prop("Roast level", opts.roast),
      prop("Roast level (1-5)", opts.roastLevel),
      prop("Origin", "Urrao, Antioquia, Colombia"),
    ],
    offers: {
      "@type": "Offer",
      url: opts.url,
      priceCurrency: "COP",
      price: String(opts.priceCop),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: orgRef,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: String(opts.shippingCop), currency: "COP" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CO" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: opts.handlingDays.min, maxValue: opts.handlingDays.max, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: opts.transitDays.min, maxValue: opts.transitDays.max, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CO",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: opts.returnDays,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  };
}

/** Place for a town or farm. Coordinates are the municipality's unless the owner supplies the farm's. */
export function place(opts: {
  id: string;
  name: string;
  description?: string;
  url?: string;
  geo: { latitude: number; longitude: number };
  image?: string;
}): Node {
  return {
    "@type": "Place",
    "@id": opts.id,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.url ? { url: opts.url } : {}),
    geo: { "@type": "GeoCoordinates", ...opts.geo },
    address,
    containedInPlace: { "@type": "AdministrativeArea", name: "Antioquia, Colombia" },
    ...(opts.image ? { image: opts.image } : {}),
  };
}

/** Producer: Person working for a farm (Organization) located in a Place. */
export function personWithFarm(opts: {
  url: string;
  name: string;
  jobTitle: string;
  description: string;
  farm: string;
  varieties: string[];
  placeName: string;
  geo: { latitude: number; longitude: number };
}): Node[] {
  const farmId = `${opts.url}#farm`;
  const placeId = `${opts.url}#place`;
  return [
    {
      "@type": "Person",
      "@id": `${opts.url}#person`,
      name: opts.name,
      url: opts.url,
      jobTitle: opts.jobTitle,
      description: opts.description,
      worksFor: { "@id": farmId },
      affiliation: { "@id": farmId },
      homeLocation: { "@id": placeId },
    },
    { "@type": "Organization", "@id": farmId, name: opts.farm, location: { "@id": placeId }, knowsAbout: opts.varieties },
    place({ id: placeId, name: opts.placeName, geo: opts.geo }),
  ];
}

export function faqPage(opts: { url: string; lang: Locale; items: readonly { q: string; a: string }[] }): Node {
  return {
    "@type": "FAQPage",
    url: opts.url,
    inLanguage: opts.lang,
    mainEntity: opts.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function article(opts: {
  url: string;
  lang: Locale;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image: string[];
  authorName: string;
  wordCount?: number;
  blogUrl?: string;
}): Node {
  return {
    "@type": "Article",
    "@id": `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    inLanguage: opts.lang,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    ...(opts.wordCount ? { wordCount: opts.wordCount } : {}),
    image: opts.image,
    author: { "@type": "Organization", "@id": ORG_ID, name: opts.authorName, url: absoluteUrl("/en") },
    publisher: orgRef,
    ...(opts.blogUrl ? { isPartOf: { "@type": "Blog", url: opts.blogUrl } } : {}),
  };
}
