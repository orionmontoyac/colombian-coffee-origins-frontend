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
  return (
    <Button variant="shop" size="sm" aria-label={ariaLabel} onClick={() => add(slug, grind, grams)} data-testid="add-to-cart">
      {label}
      <span aria-hidden="true" className="text-lg leading-none">
        +
      </span>
    </Button>
  );
}
