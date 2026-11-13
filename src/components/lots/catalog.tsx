"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { TrustBadge, type TrustLevel } from "@/components/ui/trust-badge";
import { cx } from "@/components/ui/cx";
import {
  ALTITUDE_OPTIONS,
  AVAILABILITY_OPTIONS,
  FILTER_KEYS,
  PRICE_OPTIONS,
  SCORE_OPTIONS,
  SORT_KEYS,
  applyFilters,
  emptyFilters,
  filtersToQuery,
  parseFilters,
  slugify,
  type CatalogItem,
  type FilterKey,
  type Filters,
  type SortKey,
} from "./filters";

type T = Dictionary["lotsPage"];
type Option = readonly [value: string, label: string];

/** Lots shown before "Load more". The example data has six lots, so the button appears once there are more. */
const PAGE_SIZE = 6;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
    >
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

/** Native select drawn as a pill: keyboard, screen reader and mobile pickers work for free. */
function PillSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  dark = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  /** Text of the "no filter" option; omit for selects that always have a value */
  placeholder?: string;
  dark?: boolean;
}) {
  const active = dark || value !== "";
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          "min-h-tap-target cursor-pointer appearance-none rounded-full py-2.5 pl-4 pr-10 font-label text-label-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary",
          dark
            ? "bg-primary text-on-primary"
            : cx("bg-neutral text-primary ring-[1.5px] ring-inset", active ? "ring-primary" : "ring-line"),
        )}
      >
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <span className={dark ? "text-on-primary" : "text-primary"}>
        <Chevron />
      </span>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5S4 15.6 4 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.6c0 6-8 10.9-8 10.9z" />
    </svg>
  );
}

const TRUST_LEVELS: TrustLevel[] = ["coffeeVerified", "farmVerified", "registered"];

type ViewProps = {
  items: CatalogItem[];
  t: T;
  filters: Filters;
  onChange: (next: Filters) => void;
};

function CatalogView({ items, t, filters, onChange }: ViewProps) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<ReadonlySet<string>>(new Set());
  // "Load more" state belongs to one set of filters; changing them starts again at the first page.
  const signature = filtersToQuery(filters);
  const [pageState, setPageState] = useState({ signature, size: PAGE_SIZE });
  const size = pageState.signature === signature ? pageState.size : PAGE_SIZE;

  const varieties: Option[] = [...new Set(items.map((i) => i.variety))]
    .sort((a, b) => a.localeCompare(b))
    .map((v) => [slugify(v), v] as const);
  const processes: Option[] = [...new Set(items.map((i) => i.process))].map(
    (p) => [p, t.card.processes[p as keyof T["card"]["processes"]]] as const,
  );
  const f = t.filters;
  const options: Record<FilterKey, { label: string; options: Option[] }> = {
    variety: { label: f.variety, options: varieties },
    process: { label: f.process, options: processes },
    altitude: {
      label: f.altitude,
      options: ALTITUDE_OPTIONS.map((o) => [o, f.altitudeOptions[o]] as const),
    },
    score: { label: f.score, options: SCORE_OPTIONS.map((o) => [o, fill(f.scoreOption, { n: o })] as const) },
    availability: {
      label: f.availability,
      options: AVAILABILITY_OPTIONS.map((o) => [o, f.availabilityOptions[o]] as const),
    },
    price: { label: f.price, options: PRICE_OPTIONS.map((o) => [o, f.priceOptions[o]] as const) },
  };

  const results = applyFilters(items, filters);
  const shown = results.slice(0, size);
  const activeFilters = FILTER_KEYS.filter((key) => filters[key] !== "");
  const set = (key: FilterKey | "sort", value: string) => onChange({ ...filters, [key]: value } as Filters);
  const reset = () => onChange({ ...emptyFilters, sort: filters.sort });
  const count = fill(results.length === 1 ? f.countOne : f.countOther, { n: results.length });
  const sortOptions: Option[] = SORT_KEYS.map((k: SortKey) => [k, `${f.sort}: ${f.sortOptions[k]}`] as const);

  return (
    <>
      <FilterBar
        label={f.label}
        count={count}
        className="mt-4 !items-start"
        sort={<PillSelect dark label={f.sort} value={filters.sort} onChange={(v) => set("sort", v)} options={sortOptions} />}
      >
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="lot-filters"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex min-h-tap-target items-center gap-2 self-start rounded-full bg-neutral px-4 font-label text-label-md text-primary ring-[1.5px] ring-inset ring-line focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary lg:hidden"
          >
            {f.toggle}
            {activeFilters.length ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-on-primary">{activeFilters.length}</span>
            ) : null}
            <span aria-hidden="true" className={cx("transition-transform", open && "rotate-180")}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5l3 3 3-3" />
              </svg>
            </span>
          </button>
          <div id="lot-filters" className={cx("flex-wrap gap-2 lg:flex", open ? "flex" : "hidden")}>
            {FILTER_KEYS.map((key) => (
              <PillSelect
                key={key}
                label={options[key].label}
                placeholder={options[key].label}
                value={filters[key]}
                onChange={(v) => set(key, v)}
                options={options[key].options}
              />
            ))}
          </div>
          {activeFilters.length ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-surface-sunken pt-3">
              <span className="text-body-sm text-muted">{f.active}</span>
              {activeFilters.map((key) => {
                const name = options[key].options.find(([v]) => v === filters[key])?.[1] ?? filters[key];
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={fill(f.remove, { name })}
                    onClick={() => set(key, "")}
                    className="inline-flex min-h-tap-target items-center gap-2 rounded-full bg-primary px-3.5 font-label text-sm font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
                  >
                    {name} <span aria-hidden="true">×</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={reset}
                className="min-h-tap-target px-2 text-body-sm font-semibold text-primary-hover underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
              >
                {f.clearAll}
              </button>
            </div>
          ) : null}
        </div>
      </FilterBar>

      {/* What each trust badge means */}
      <ul className="mt-5 flex flex-wrap items-center gap-x-[18px] gap-y-2.5 text-body-sm text-body">
        {TRUST_LEVELS.map((level) => (
          <li key={level} className="inline-flex items-center gap-2">
            <TrustBadge level={level} label={t.card.badges[level]} size="sm" />
            {t.legend[level]}
          </li>
        ))}
        <li className="text-[13px] text-muted">· {t.legend.note}</li>
      </ul>

      <section aria-labelledby="lot-grid-heading" className="mt-6">
        <h2 id="lot-grid-heading" className="sr-only">
          {t.gridHeading}
        </h2>
        {shown.length ? (
          <div data-testid="lot-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map(({ code, card }) => {
              const isSaved = saved.has(code);
              return (
                <div key={code} className="relative">
                  {card}
                  <button
                    type="button"
                    aria-pressed={isSaved}
                    aria-label={fill(isSaved ? t.card.saved : t.card.save, { code })}
                    onClick={() =>
                      setSaved((prev) => {
                        const next = new Set(prev);
                        if (next.has(code)) next.delete(code);
                        else next.add(code);
                        return next;
                      })
                    }
                    className={cx(
                      "absolute right-3.5 top-[182px] flex size-11 items-center justify-center rounded-full bg-neutral focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary",
                      isSaved ? "text-error" : "text-primary",
                    )}
                  >
                    <HeartIcon filled={isSaved} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div role="status" className="rounded-lg bg-surface px-6 py-16 text-center">
            <h3 className="font-display text-headline-md text-primary">{t.empty.title}</h3>
            <p className="mx-auto mt-3 max-w-[480px] text-body-md text-body">{t.empty.text}</p>
            <Button variant="on-dark" size="lg" className="mt-6" onClick={reset}>
              {t.empty.reset}
            </Button>
          </div>
        )}
      </section>

      {shown.length ? (
        <div className="mt-9 flex flex-col items-center gap-2.5">
          {results.length > shown.length ? (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setPageState({ signature, size: size + PAGE_SIZE })}
            >
              {t.loadMore.button}
            </Button>
          ) : null}
          <p aria-live="polite" className="text-body-sm text-muted">
            {fill(t.loadMore.showing, { shown: shown.length, total: results.length })}
          </p>
        </div>
      ) : null}
    </>
  );
}

/** Reads the filters from the URL and writes changes back with history.replaceState (no page reload). */
function ConnectedCatalog({ items, t }: Omit<ViewProps, "filters" | "onChange">) {
  const params = useSearchParams();
  // Next's router keeps useSearchParams in step with window.history.replaceState.
  const valid: Record<FilterKey, readonly string[]> = {
    variety: items.map((i) => slugify(i.variety)),
    process: items.map((i) => i.process),
    altitude: ALTITUDE_OPTIONS,
    score: SCORE_OPTIONS,
    availability: AVAILABILITY_OPTIONS,
    price: PRICE_OPTIONS,
  };
  const filters = parseFilters(new URLSearchParams(params.toString()), valid);
  const onChange = (next: Filters) => {
    const query = filtersToQuery(next);
    window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
  };
  return <CatalogView items={items} t={t} filters={filters} onChange={onChange} />;
}

/**
 * The catalog: filters and sort live in the URL (`?process=washed&sort=price`), so a filtered
 * view can be shared. The Suspense fallback is the full unfiltered catalog, so the server HTML
 * already lists every lot.
 */
export function LotsCatalog({ items, t }: { items: CatalogItem[]; t: T }) {
  return (
    <Suspense fallback={<CatalogView items={items} t={t} filters={emptyFilters} onChange={() => {}} />}>
      <ConnectedCatalog items={items} t={t} />
    </Suspense>
  );
}
