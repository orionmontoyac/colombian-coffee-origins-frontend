import { getProduct, type GrindOption } from "@/data/products";
import { MAX_QTY } from "./constants";

/**
 * Cart persistence. The cart lives in localStorage and is read through useSyncExternalStore,
 * so the server and the first client render both see an empty cart and nothing mismatches.
 * Every storage call is wrapped: private mode or blocked storage falls back to memory.
 */
export type CartLine = { slug: string; grind: GrindOption; grams: number; qty: number };

const KEY = "cco-cart-v1";
const EMPTY = "[]";
const listeners = new Set<() => void>();
let memory: string | null = null;

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export const getServerSnapshot = (): string => EMPTY;
export const getSnapshot = (): string => memory ?? readStorage() ?? EMPTY;

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) {
      memory = null;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export const lineKey = (line: Pick<CartLine, "slug" | "grind" | "grams">) => `${line.slug}|${line.grind}|${line.grams}`;

/** Parses stored JSON and drops anything that no longer matches the product data. */
export function parseLines(raw: string): CartLine[] {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const lines: CartLine[] = [];
    for (const item of data) {
      if (!item || typeof item !== "object") continue;
      const { slug, grind, grams, qty } = item as Record<string, unknown>;
      if (typeof slug !== "string" || typeof grind !== "string" || typeof grams !== "number" || typeof qty !== "number") continue;
      const product = getProduct(slug);
      if (!product || !product.grindOptions.includes(grind as GrindOption)) continue;
      if (!product.sizes.some((s) => s.grams === grams)) continue;
      const quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
      lines.push({ slug, grind: grind as GrindOption, grams, qty: quantity });
    }
    return lines;
  } catch {
    return [];
  }
}

export function writeLines(lines: CartLine[]): void {
  const raw = JSON.stringify(lines);
  memory = raw;
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Storage is blocked or full: the cart keeps working in memory for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function addLine(line: CartLine): void {
  const lines = parseLines(getSnapshot());
  const existing = lines.find((l) => lineKey(l) === lineKey(line));
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + line.qty);
  else lines.push({ ...line, qty: Math.min(MAX_QTY, line.qty) });
  writeLines(lines);
}

export function setLineQty(key: string, qty: number): void {
  const lines = parseLines(getSnapshot())
    .map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
    .filter((l) => l.qty > 0);
  writeLines(lines);
}

export function removeLine(key: string): void {
  writeLines(parseLines(getSnapshot()).filter((l) => lineKey(l) !== key));
}
