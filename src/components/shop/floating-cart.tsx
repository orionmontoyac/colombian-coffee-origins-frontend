"use client";

import { CartIcon } from "@/components/ui/icons";
import { useCart } from "./cart-context";
import { formatCop } from "./format";

/**
 * Small screens hide the header Cart button (it lives in the menu), so a pill at the bottom
 * shows the count and subtotal once something is in the cart.
 */
export function FloatingCart() {
  const { count, subtotal, lang, copy, open, openCart } = useCart();
  if (count === 0 || open) return null;
  return (
    <button
      type="button"
      onClick={openCart}
      data-testid="floating-cart"
      className="fixed bottom-4 left-4 right-4 z-40 inline-flex min-h-[52px] items-center justify-between gap-3 rounded-full bg-roast px-6 py-3 font-label text-base font-medium text-on-primary hover:bg-roast-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-roast min-[721px]:hidden"
    >
      <span className="inline-flex items-center gap-2">
        <CartIcon />
        {copy.floating}
        <span className="rounded-full bg-neutral px-2 py-0.5 text-xs text-roast">{count}</span>
      </span>
      <span>{formatCop(subtotal, lang)}</span>
    </button>
  );
}
