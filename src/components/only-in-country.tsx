import { Suspense, type ReactNode } from "react";
import { getVisitorCountry } from "@/lib/geo";

async function CountryGate({ country, children }: { country: string; children: ReactNode }) {
  const visitor = await getVisitorCountry();
  return visitor === country ? children : null;
}

/**
 * Renders its children only for visitors from `country` (ISO 3166-1 alpha-2).
 * The rest of the page stays static; only this slot is resolved per request.
 */
export function OnlyInCountry({ country, children }: { country: string; children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CountryGate country={country.toUpperCase()}>{children}</CountryGate>
    </Suspense>
  );
}
