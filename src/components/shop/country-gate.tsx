import type { ReactNode } from "react";
import { getVisitorCountry } from "@/lib/geo";
import { site } from "@/lib/site";

/**
 * Picks the Colombian shop or the "ships inside Colombia only" notice for each request.
 * Reads the visitor country, so render it inside <Suspense>; the rest of the page stays static.
 */
export async function CountryGate({ shop, notice }: { shop: ReactNode; notice: ReactNode }) {
  const country = await getVisitorCountry();
  return country === site.country ? shop : notice;
}
