"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { getProduct, type GrindOption, type Product } from "@/data/products";
import { FREE_SHIPPING_COP, SHIPPING_COP } from "./constants";
import {
  addLine,
  getServerSnapshot,
  getSnapshot,
  lineKey,
  parseLines,
  removeLine,
  setLineQty,
  subscribe,
} from "./cart-store";
import { fill } from "./format";

export type CartLineView = {
  key: string;
  product: Product;
  name: string;
  grind: GrindOption;
  grams: number;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  lang: Locale;
  copy: Dictionary["cart"];
  grindLabels: Dictionary["productPage"]["purchase"]["grinds"];
  lines: CartLineView[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (slug: string, grind: GrindOption, grams: number, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}

/**
 * Cart state for the shop: lines in localStorage and a polite live region for add/remove announcements.
 * Focus goes back to whatever opened the drawer when it closes.
 */
export function CartProvider({
  lang,
  copy,
  grindLabels,
  children,
}: {
  lang: Locale;
  copy: Dictionary["cart"];
  grindLabels: CartContextValue["grindLabels"];
  children: ReactNode;
}) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const opener = useRef<HTMLElement | null>(null);

  const lines = useMemo<CartLineView[]>(() => {
    const out: CartLineView[] = [];
    for (const line of parseLines(raw)) {
      const product = getProduct(line.slug);
      const size = product?.sizes.find((s) => s.grams === line.grams);
      if (!product || !size) continue;
      out.push({
        key: lineKey(line),
        product,
        name: product.name[lang],
        grind: line.grind,
        grams: line.grams,
        qty: line.qty,
        unitPrice: size.priceCop,
        lineTotal: size.priceCop * line.qty,
      });
    }
    return out;
  }, [raw, lang]);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_COP ? 0 : SHIPPING_COP;

  const openCart = useCallback(() => {
    const active = document.activeElement;
    if (!opener.current && active instanceof HTMLElement && active !== document.body) opener.current = active;
    setOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setOpen(false);
    const target = opener.current;
    opener.current = null;
    if (target?.isConnected) target.focus();
  }, []);

  const add = useCallback(
    (slug: string, grind: GrindOption, grams: number, qty = 1) => {
      const product = getProduct(slug);
      addLine({ slug, grind, grams, qty });
      if (product) setAnnouncement(fill(copy.liveAdded, { name: product.name[lang] }));
      openCart();
    },
    [copy.liveAdded, lang, openCart],
  );

  const setQty = useCallback((key: string, qty: number) => setLineQty(key, qty), []);

  const remove = useCallback(
    (key: string) => {
      const line = lines.find((l) => l.key === key);
      removeLine(key);
      if (line) setAnnouncement(fill(copy.liveRemoved, { name: line.name }));
    },
    [copy.liveRemoved, lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lang,
      copy,
      grindLabels,
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      open,
      openCart,
      closeCart,
      add,
      setQty,
      remove,
    }),
    [lang, copy, grindLabels, lines, count, subtotal, shipping, open, openCart, closeCart, add, setQty, remove],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </CartContext.Provider>
  );
}
