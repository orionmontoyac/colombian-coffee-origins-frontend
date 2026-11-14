import Link from "next/link";
import type { ReactNode } from "react";
import { BagMockup } from "./bag-mockup";
import { Button } from "./button";
import { RoastMeter } from "./roast-meter";

/**
 * Shop product card (Colombia only, brown line). Bag mockup on a stage tinted with the bag color,
 * brand eyebrow, name, meta, italic notes, optional roast meter, price in COP and Add.
 * Pass `addHref` for a link, or `addSlot` to supply your own client-side add button.
 */
export function ProductCard({
  brand,
  name,
  meta,
  notes,
  tag,
  bag,
  roast,
  price,
  pricePerKg,
  href,
  addLabel,
  addHref,
  addSlot,
  headingAs: Heading = "h3",
  vtName,
  bordered = false,
}: ProductCardProps) {
  const stageClass = "relative flex h-[280px] items-center justify-center";
  const stage = (
    <>
      {tag ? (
        <span className={`absolute left-3.5 top-3.5 rounded-full px-[11px] py-1.5 font-label text-xs font-medium ${tag.className}`}>
          {tag.label}
        </span>
      ) : null}
      <BagMockup color={bag.color} brand={bag.label} roastLabel={bag.roastLabel} size={bag.size} beanIcon={bag.beanIcon} />
    </>
  );

  return (
    <article
      data-vt-name={vtName}
      className={`flex flex-col overflow-hidden rounded-lg bg-neutral${bordered ? " border border-surface-sunken" : ""}`}
    >
      {href ? (
        <Link
          href={href}
          aria-label={name}
          className={`${stageClass} focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-roast`}
          style={{ background: bag.stage }}
        >
          {stage}
        </Link>
      ) : (
        <div className={stageClass} style={{ background: bag.stage }}>
          {stage}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-[22px] pt-5">
        <p className="font-display text-headline-sm text-roast-dark">{brand}</p>
        <Heading className="text-body-md font-medium text-roast">
          {href ? <Link href={href}>{name}</Link> : name}
        </Heading>
        <p className="text-sm text-body">{meta}</p>
        <p className="text-sm italic text-muted">{notes}</p>
        {roast ? <RoastMeter level={roast.level} label={roast.label} hint={roast.hint} /> : null}
        <div className="mt-auto flex items-center justify-between gap-2.5 pt-2.5">
          <div>
            <p className="font-display text-[20px] font-semibold text-roast-dark">{price}</p>
            {pricePerKg ? <p className="text-sm text-muted">{pricePerKg}</p> : null}
          </div>
          {addSlot ??
            (addHref ? (
              <Button href={addHref} variant="shop" size="sm">
                {addLabel}
              </Button>
            ) : null)}
        </div>
      </div>
    </article>
  );
}

export type ProductCardProps = {
  brand: string;
  name: string;
  /** For example "Urrao · Whole bean · 340 g" */
  meta: string;
  notes: string;
  tag?: { label: string; className: string };
  bag: {
    /** Bag color (content, from the producer brand) */
    color: string;
    /** Soft stage tint behind the bag */
    stage: string;
    /** Short brand name printed on the bag label */
    label: string;
    roastLabel: string;
    size: string;
    beanIcon?: boolean;
  };
  roast?: { level: 1 | 2 | 3 | 4 | 5; label: string; /** Hover text explaining the bean rank */ hint?: string };
  price: string;
  /** Shop rule: always show the price per kg where space allows */
  pricePerKg?: string;
  href?: string;
  addLabel?: string;
  addHref?: string;
  addSlot?: ReactNode;
  headingAs?: "h2" | "h3";
  /** Renders `data-vt-name` so a view transition can name this card */
  vtName?: string;
  /** Adds a 1px soft border (for cards on a neutral background) */
  bordered?: boolean;
};
