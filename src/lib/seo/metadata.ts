import type { Metadata } from "next";
import type { Locale } from "@/app/[lang]/dictionaries";
import { alternates, toInternalPath, type RouteKey } from "@/lib/routes";
import { absoluteUrl, site } from "@/lib/site";

/** Brand suffix rules: full brand when the title still fits in 60 characters, short brand next, none last. */
export const TITLE_MAX = 60;
const BRAND_FULL = site.name;
const BRAND_SHORT = "Origins";

/** Remove a trailing brand written by a page author ("... | Origins", "... · Colombian Coffee Origins"). */
function stripBrand(title: string): string {
  return title.replace(/\s*[|·–-]\s*(Colombian Coffee Origins|Origins)\s*$/i, "").trim();
}

/** `Page title · Colombian Coffee Origins`, falling back to `· Origins` or no suffix to stay at 60 characters or fewer. */
export function brandedTitle(title: string): string {
  const base = stripBrand(title);
  for (const brand of [BRAND_FULL, BRAND_SHORT]) {
    const full = `${base} · ${brand}`;
    if (full.length <= TITLE_MAX) return full;
  }
  return base;
}

/**
 * Pages that have a Markdown twin at /md/{lang}/<same path after /{lang}> (route handlers by the
 * ai-discoverability work). Matching runs on the English-folder path, so ES URLs match too.
 */
const MARKDOWN_PATTERNS = [
  /^\/(en|es)$/, // home
  /^\/(en|es)\/coffees\/[^/]+$/, // every lot
  /^\/(en|es)\/producers\/[^/]+$/, // every producer
  /^\/(en|es)\/for-buyers$/,
  /^\/(en|es)\/regions\/urrao$/,
];

/** Absolute URL of the Markdown version of a public path, or undefined when the page has none. */
export function markdownUrl(publicPath: string): string | undefined {
  const internal = toInternalPath(publicPath);
  if (!MARKDOWN_PATTERNS.some((re) => re.test(internal))) return undefined;
  const [, lang, ...rest] = publicPath.split("/");
  return absoluteUrl(`/md/${lang}${rest.length ? `/${rest.join("/")}` : ""}`);
}

const OG_ALT = {
  en: "Colombian Coffee Origins: specialty coffee direct from family farms in Urrao, Antioquia, Colombia",
  es: "Colombian Coffee Origins: café especial directo de fincas familiares en Urrao, Antioquia, Colombia",
} as const;

/**
 * Generated Open Graph image for a page. Lots and roasted products have their own card
 * (/{lang}/og/lot/<code>, /{lang}/og/product/<slug>); everything else uses /{lang}/opengraph-image.
 * Pages that set `openGraph` replace the layout's file-based image, so the URL is set explicitly.
 */
export function ogImageFor(lang: Locale, publicPath: string): { url: string; width: number; height: number; alt: string } {
  const internal = toInternalPath(publicPath).split("/");
  const [, , section, slug] = internal;
  let path = `/${lang}/opengraph-image`;
  if (section === "coffees" && slug && internal.length === 4) path = `/${lang}/og/lot/${slug}/opengraph-image`;
  if (section === "shop" && slug && slug !== "sell" && internal.length === 4) path = `/${lang}/og/product/${slug}/opengraph-image`;
  return { url: absoluteUrl(path), width: 1200, height: 630, alt: OG_ALT[lang] };
}

export type BuildMetadataInput = {
  lang: Locale;
  /** Route key, when the page is a static route (alternates come from routes.ts). */
  routeKey?: RouteKey;
  /** Public paths in both languages. Required for dynamic pages (lots, producers, products, articles). */
  paths?: Record<Locale, string>;
  title: string;
  description: string;
  /** Override the generated Open Graph image. */
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  /** Keep out of the index (non-CO shop response, drafts). */
  noindex?: boolean;
  /** Open Graph type. Default website. */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Force or suppress the Markdown alternate. Default: by URL pattern. */
  markdown?: boolean;
};

/** One place for title, description, canonical, hreflang, Open Graph, Twitter, robots and the Markdown alternate. */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { lang, routeKey, title, description, images, noindex = false, type = "website" } = input;
  const paths = input.paths ?? (routeKey ? alternates(routeKey) : undefined);
  if (!paths) throw new Error("buildMetadata needs `paths` or `routeKey`");
  const url = absoluteUrl(paths[lang]);
  const full = brandedTitle(title);
  const ogImages = images?.length ? images : [ogImageFor(lang, paths[lang])];
  const md = input.markdown === false ? undefined : markdownUrl(paths[lang]);

  return {
    title: { absolute: full },
    description,
    alternates: {
      canonical: url,
      languages: { en: absoluteUrl(paths.en), es: absoluteUrl(paths.es), "x-default": absoluteUrl(paths.en) },
      ...(md ? { types: { "text/markdown": md } } : {}),
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      title: full,
      description,
      url,
      siteName: site.name,
      locale: lang === "es" ? "es_CO" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_CO"],
      ...(type === "article" && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(type === "article" && input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
