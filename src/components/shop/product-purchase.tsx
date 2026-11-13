"use client";

import { useState } from "react";
import { Bean } from "@/components/ui/bean";
import { Button } from "@/components/ui/button";
import type { GrindOption } from "@/data/products";
import { useCart } from "./cart-context";

export type PurchaseSize = { grams: number; price: string; perKg: string };
export type PurchaseCopy = {
  heading: string;
  size: string;
  grind: string;
  preGroundNote: string;
  add: string;
  roastedTitle: string;
  roastedText: string;
  storage: string;
};

const choice =
  "inline-flex min-h-11 items-center rounded-full border border-roast-line bg-neutral px-[18px] py-2.5 font-label text-[15px] font-medium text-roast-dark transition-colors duration-200 hover:bg-roast-card peer-checked:border-roast peer-checked:bg-roast peer-checked:text-on-primary peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-roast";

/** Size and grind selectors, live price and Add to cart. Whole bean is the default grind. */
export function ProductPurchase({
  slug,
  sizes,
  grinds,
  copy,
}: {
  slug: string;
  sizes: PurchaseSize[];
  grinds: { value: GrindOption; label: string }[];
  copy: PurchaseCopy;
}) {
  const { add } = useCart();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [grind, setGrind] = useState<GrindOption>(grinds[0].value);
  const size = sizes[sizeIndex];

  return (
    <div>
      <h2 className="sr-only">{copy.heading}</h2>
      <p className="font-display text-[44px] font-semibold leading-none text-roast-dark" data-testid="product-price">
        {size.price}
      </p>
      <p className="mt-1.5 text-body-md text-roast-body" data-testid="product-per-kg">
        {size.perKg}
      </p>

      <fieldset className="mt-6">
        <legend className="font-label text-label-md text-roast-dark">{copy.size}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s, i) => (
            <label key={s.grams}>
              <input type="radio" name="size" className="peer sr-only" checked={i === sizeIndex} onChange={() => setSizeIndex(i)} />
              <span className={choice}>{s.grams} g</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="font-label text-label-md text-roast-dark">{copy.grind}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {grinds.map((g) => (
            <label key={g.value}>
              <input type="radio" name="grind" className="peer sr-only" checked={g.value === grind} onChange={() => setGrind(g.value)} />
              <span className={choice}>{g.label}</span>
            </label>
          ))}
        </div>
        {grinds.length === 1 ? <p className="mt-2 text-body-sm text-roast-body">{copy.preGroundNote}</p> : null}
      </fieldset>

      <Button
        variant="shop"
        size="lg"
        className="mt-6 w-full"
        onClick={() => add(slug, grind, size.grams)}
        data-testid="product-add"
      >
        {copy.add}
      </Button>

      <div className="mt-6 flex gap-3.5 rounded-lg bg-roast-card p-5">
        <Bean size={28} className="mt-0.5" />
        <div>
          <p className="font-display text-headline-sm text-roast-dark">{copy.roastedTitle}</p>
          <p className="mt-1 text-body-sm text-roast-body">{copy.roastedText}</p>
          <p className="mt-2 text-body-sm text-roast-body">{copy.storage}</p>
        </div>
      </div>
    </div>
  );
}
