import type { ReactNode } from "react";

/** One lot as the catalog needs it: the rendered card plus the raw values that filters and sort use. */
export type CatalogItem = {
  code: string;
  variety: string;
  process: string;
  altitudeM: number;
  /** SCA score; null = not cupped yet */
  score: number | null;
  availableKg: number;
  /** USD per kg; null = price on request */
  price: number | null;
  /** Higher = newer (the lot number in the code) */
  order: number;
  /** The rendered LotCard (built on the server: LotCard pulls in PlaceholderImage, which reads ASSETS.md with node:fs) */
  card: ReactNode;
};

export const FILTER_KEYS = ["variety", "process", "altitude", "score", "availability", "price"] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type SortKey = "score" | "newest" | "price";
export type Filters = Record<FilterKey, string> & { sort: SortKey };

export const ALTITUDE_OPTIONS = ["under-2000", "2000-2100", "over-2100"] as const;
export const AVAILABILITY_OPTIONS = ["under-100", "100-300", "over-300"] as const;
export const PRICE_OPTIONS = ["under-10", "10-15", "over-15", "on-request"] as const;
export const SCORE_OPTIONS = ["88", "87", "86", "85"] as const;
export const SORT_KEYS: SortKey[] = ["score", "newest", "price"];

export const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

export const emptyFilters: Filters = {
  variety: "",
  process: "",
  altitude: "",
  score: "",
  availability: "",
  price: "",
  sort: "score",
};

/** Read filters from the query string; unknown values are ignored so a bad URL shows the full catalog. */
export function parseFilters(params: URLSearchParams, valid: Record<FilterKey, readonly string[]>): Filters {
  const next = { ...emptyFilters };
  for (const key of FILTER_KEYS) {
    const value = params.get(key) ?? "";
    if (valid[key].includes(value)) next[key] = value;
  }
  const sort = params.get("sort") as SortKey | null;
  if (sort && SORT_KEYS.includes(sort)) next.sort = sort;
  return next;
}

/** Query string for the filters; defaults are left out so the clean URL stays /coffees. */
export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) if (filters[key]) params.set(key, filters[key]);
  if (filters.sort !== "score") params.set("sort", filters.sort);
  return params.toString();
}

const inAltitude = (m: number, v: string) =>
  v === "under-2000" ? m < 2000 : v === "2000-2100" ? m >= 2000 && m <= 2100 : m > 2100;
const inAvailability = (kg: number, v: string) =>
  v === "under-100" ? kg < 100 : v === "100-300" ? kg >= 100 && kg <= 300 : kg > 300;
const inPrice = (price: number | null, v: string) => {
  if (v === "on-request") return price === null;
  if (price === null) return false;
  return v === "under-10" ? price < 10 : v === "10-15" ? price >= 10 && price <= 15 : price > 15;
};

export function applyFilters(items: CatalogItem[], f: Filters): CatalogItem[] {
  const out = items.filter(
    (i) =>
      (!f.variety || slugify(i.variety) === f.variety) &&
      (!f.process || i.process === f.process) &&
      (!f.altitude || inAltitude(i.altitudeM, f.altitude)) &&
      (!f.score || (i.score !== null && i.score >= Number(f.score))) &&
      (!f.availability || inAvailability(i.availableKg, f.availability)) &&
      (!f.price || inPrice(i.price, f.price)),
  );
  const sorted = [...out];
  if (f.sort === "newest") sorted.sort((a, b) => b.order - a.order);
  else if (f.sort === "price") {
    // Lots with a price first, cheapest to dearest; "price on request" last.
    sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || b.order - a.order);
  } else {
    // Highest score first; lots not yet cupped last.
    sorted.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.order - a.order);
  }
  return sorted;
}
