/**
 * Site-wide constants. Everything marked PLACEHOLDER is listed in ASSETS.md
 * ("Text and data the owner must provide") and must be replaced before launch.
 */
export const locales = ["en", "es"] as const;
export type SiteLocale = (typeof locales)[number];
export const defaultLocale: SiteLocale = "en";

export const site = {
  name: "Colombian Coffee Origins",
  /** Canonical origin without a trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100").replace(/\/$/, ""),
  locales,
  defaultLocale,
  /** Business lines, used in metadata and JSON-LD */
  country: "CO",
  region: "Antioquia",
  origin: "Urrao",

  contact: {
    // PLACEHOLDER: owner to provide
    email: "hello@yourdomain.com",
    // PLACEHOLDER: owner to provide (PQRS: peticiones, quejas, reclamos y sugerencias; required for the Colombian shop)
    pqrsEmail: "pqrs@yourdomain.com",
    // PLACEHOLDER: owner to provide (international format, used for the green line and the shop)
    whatsappNumber: "+573000000000",
    // PLACEHOLDER: owner to provide (shown to people)
    whatsappDisplay: "+57 300 000 0000",
  },

  /** Organization.sameAs. Empty strings are skipped by JSON-LD and footers until the owner provides them. */
  social: {
    // PLACEHOLDER: owner to provide
    instagram: "",
    // PLACEHOLDER: owner to provide
    linkedin: "",
    // PLACEHOLDER: owner to provide
    facebook: "",
  },

  legal: {
    // PLACEHOLDER: owner to provide
    entityName: "[Legal entity name]",
    // PLACEHOLDER: owner to provide (Colombian tax ID)
    nit: "[NIT 000.000.000-0]",
  },
} as const;

export function whatsappLink(message?: string): string {
  const digits = site.contact.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Absolute URL for a path such as "/en/coffees". */
export function absoluteUrl(path: string): string {
  return `${site.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function sameAs(): string[] {
  return Object.values(site.social).filter(Boolean);
}
