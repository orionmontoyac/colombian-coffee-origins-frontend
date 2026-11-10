import { headers } from "next/headers";

/**
 * Two-letter country code of the visitor (e.g. "CO"), or null when unknown.
 *
 * The country comes from the geolocation header your host adds to each request:
 * Vercel (x-vercel-ip-country), Cloudflare (cf-ipcountry), CloudFront
 * (cloudfront-viewer-country) or Netlify (x-country). Locally there is no such
 * header, so set DEV_COUNTRY=CO in .env.local to preview country-only content.
 *
 * Calling this makes the caller dynamic: render it inside <Suspense>.
 */
export async function getVisitorCountry(): Promise<string | null> {
  const h = await headers();
  const fromHost =
    h.get("x-vercel-ip-country") ??
    h.get("cf-ipcountry") ??
    h.get("cloudfront-viewer-country") ??
    h.get("x-country");

  const country = fromHost ?? (process.env.NODE_ENV !== "production" ? process.env.DEV_COUNTRY : undefined);
  return country ? country.toUpperCase() : null;
}
