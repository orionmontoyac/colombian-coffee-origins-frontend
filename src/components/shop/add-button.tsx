"use client";

import { Button } from "@/components/ui/button";
import type { GrindOption } from "@/data/products";
import { useCart } from "./cart-context";

/** "Add +" on a product card: adds the default size and grind and opens the cart drawer. */
export function AddButton({
  slug,
  grind,
  grams,
  label,
  ariaLabel,
}: {
  slug: string;
  grind: GrindOption;
  grams: number;
  label: string;
  ariaLabel: string;
}) {
  const { add } = useCart();
  // The name has to start with the visible word ("Add"). aria-label would replace it and fail that check.
  const rest = ariaLabel.startsWith(label) ? ariaLabel.slice(label.length) : ` ${ariaLabel}`;
  return (
    <Button variant="shop" size="sm" onClick={() => add(slug, grind, grams)} data-testid="add-to-cart">
      {label}
      <span className="sr-only">{rest}</span>
      <span aria-hidden="true" className="text-lg leading-none">
        +
      </span>
    </Button>
  );
}
