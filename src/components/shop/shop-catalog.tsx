"use client";

import { useMemo, useState } from "react";
import { Bean } from "@/components/ui/bean";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { AddButton } from "./add-button";
import { fill } from "./format";
import type { ProductView, RoastGroup } from "./views";

export type BrandView = { slug: string; name: string; place: string; color: string; count: number };

type SortKey = "featured" | "priceAsc" | "priceDesc" | "roastAsc";
type GrindFilter = "wholeBean" | "ground" | null;

const pill =
  "inline-flex min-h-11 items-center rounded-full px-[18px] py-2.5 font-label text-[15px] font-medium transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast";
const pillOff = "border border-roast-line bg-neutral text-roast-dark hover:bg-roast-card";
const pillOn = "bg-roast text-on-primary";

/** Product grid first, then the brand strip. Filters are plain client state. */
export function ShopCatalog({
  products,
  brands,
  copy,
  brandsCopy,
}: {
  products: ProductView[];
  brands: BrandView[];
  copy: Dictionary["shopPage"]["catalog"];
  brandsCopy: Dictionary["shopPage"]["brands"];
}) {
  const [roast, setRoast] = useState<RoastGroup | null>(null);
  const [grind, setGrind] = useState<GrindFilter>(null);
  const [under50, setUnder50] = useState(false);
  const [brand, setBrand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const visible = useMemo(() => {
    const list = products.filter(
      (p) =>
        (!roast || p.roastGroup === roast) &&
        (!grind || (grind === "ground" ? p.ground : !p.ground)) &&
        (!under50 || p.priceCop < 50_000) &&
        (!brand || p.brandSlug === brand),
    );
    if (sort === "priceAsc") return [...list].sort((a, b) => a.priceCop - b.priceCop);
    if (sort === "priceDesc") return [...list].sort((a, b) => b.priceCop - a.priceCop);
    if (sort === "roastAsc") return [...list].sort((a, b) => a.roast.level - b.roast.level);
    return list;
  }, [products, roast, grind, under50, brand, sort]);

  const noFilters = !roast && !grind && !under50 && !brand;
  const reset = () => {
    setRoast(null);
    setGrind(null);
    setUnder50(false);
    setBrand(null);
  };
  const activeBrand = brands.find((b) => b.slug === brand);
  const f = copy.filters;

  const toggle = (label: string, on: boolean, onClick: () => void, testId?: string) => (
    <button type="button" aria-pressed={on} onClick={onClick} data-testid={testId} className={`${pill} ${on ? pillOn : pillOff}`}>
      {label}
    </button>
  );

  return (
    <>
      <section id="catalog" className="scroll-mt-4 pb-2 pt-14">
        <SectionHeader line="roasted" title={copy.title} accent={copy.accent} />

        <FilterBar
          line="roasted"
          label={copy.filtersLabel}
          className="mt-5"
          count={fill(copy.showing, { shown: visible.length, total: products.length })}
          sort={
            <div className="relative">
              <label htmlFor="shop-sort" className="sr-only">
                {copy.sortLabel}
              </label>
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="min-h-11 appearance-none rounded-full border border-roast-line bg-neutral py-2.5 pl-[18px] pr-10 font-label text-[15px] font-medium text-roast-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast"
              >
                {(Object.keys(copy.sort) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {copy.sortLabel}: {copy.sort[key]}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </div>
          }
        >
          {toggle(f.all, noFilters, reset, "filter-all")}
          {toggle(f.light, roast === "light", () => setRoast(roast === "light" ? null : "light"), "filter-light")}
          {toggle(f.medium, roast === "medium", () => setRoast(roast === "medium" ? null : "medium"))}
          {toggle(f.dark, roast === "dark", () => setRoast(roast === "dark" ? null : "dark"))}
          {toggle(f.wholeBean, grind === "wholeBean", () => setGrind(grind === "wholeBean" ? null : "wholeBean"))}
          {toggle(f.ground, grind === "ground", () => setGrind(grind === "ground" ? null : "ground"))}
          {toggle(f.under50, under50, () => setUnder50(!under50))}
          {activeBrand ? (
            <button
              type="button"
              onClick={() => setBrand(null)}
              aria-label={copy.brandClear}
              className={`${pill} ${pillOn} gap-2`}
            >
              {fill(copy.brandChip, { brand: activeBrand.name })}
              <span aria-hidden="true">×</span>
            </button>
          ) : null}
        </FilterBar>

        {visible.length === 0 ? (
          <div className="mt-5 rounded-xl bg-roast-surface px-6 py-14 text-center" data-testid="shop-empty">
            <p className="font-display text-headline-md text-roast-dark">{copy.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-[44ch] text-body-md text-roast-body">{copy.emptyText}</p>
            <Button variant="shop" size="md" className="mt-5" onClick={reset}>
              {copy.reset}
            </Button>
          </div>
        ) : (
          <ul key={visible.map((p) => p.slug).join()} aria-label={copy.gridLabel} className="filter-fade mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <li key={p.slug} data-vt-name={`product-${p.slug}`} className="rounded-lg border border-roast-line">
                <ProductCard
                  brand={p.brand}
                  name={p.name}
                  meta={p.meta}
                  notes={p.notes}
                  tag={p.tag}
                  bag={{ ...p.bag }}
                  roast={p.roast}
                  price={p.price}
                  pricePerKg={p.pricePerKg}
                  href={p.href}
                  vtName={`product-${p.slug}`}
                  addSlot={
                    <AddButton
                      slug={p.slug}
                      grind={p.defaultGrind}
                      grams={p.grams}
                      label={copy.add}
                      ariaLabel={fill(copy.addAria, { name: `${p.brand} ${p.name}` })}
                    />
                  }
                />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-[13px] text-roast-body">{copy.note}</p>
      </section>

      <section className="pb-2 pt-14">
        <SectionHeader line="roasted" title={brandsCopy.title} accent={brandsCopy.accent} text={brandsCopy.text} />
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => {
            const on = brand === b.slug;
            return (
              <li key={b.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setBrand(on ? null : b.slug);
                    if (!on) document.getElementById("catalog")?.scrollIntoView();
                  }}
                  className={`flex h-full w-full flex-col items-center gap-2.5 rounded-lg border px-3.5 pb-[18px] pt-[22px] text-center transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-roast ${
                    on ? "border-roast bg-roast-surface" : "border-roast-line bg-neutral hover:bg-roast-card"
                  }`}
                >
                  <span aria-hidden="true" className="flex size-[72px] items-center justify-center rounded-full" style={{ background: b.color }}>
                    <Bean tone="white" size={36} />
                  </span>
                  <span className="font-display text-[17px] font-semibold leading-tight text-roast-dark">{b.name}</span>
                  <span className="text-[13px] text-roast-body">{b.place}</span>
                  <span className="rounded-full bg-roast-surface px-2.5 py-1 font-label text-xs font-medium text-roast">
                    {b.count === 1 ? brandsCopy.coffeeOne : fill(brandsCopy.coffeeMany, { count: b.count })}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
