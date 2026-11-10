import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { sampleRoastedProducts, type SampleRoastedProduct } from "@/data/sample-roasted";
import { href } from "@/lib/routes";

const tagTone: Record<SampleRoastedProduct["tag"], string> = {
  producerBrand: "bg-green-900 text-white",
  bestValue: "bg-lime-500 text-green-900",
  limited: "bg-white text-brown",
  ground: "bg-white text-green-900",
};

/** Simple drawn coffee bag in the brand's color (until real product photos exist). */
function BagMockup({ product, roastLabel, size }: { product: SampleRoastedProduct; roastLabel: string; size: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[200px] w-[140px] flex-col items-center overflow-hidden rounded-b-[10px] rounded-t-[14px] shadow-[0_18px_30px_rgb(14_42_31/0.18)]"
      style={{ background: product.bag }}
    >
      <div className="h-6 w-full bg-black/20" />
      <div className="mt-2.5 size-2.5 rounded-full bg-white/35" />
      <div className="mt-4 w-[104px] rounded-[10px] bg-white px-2 py-3 text-center">
        <p className="font-display text-[13px] font-bold leading-[1.1] text-green-900">{product.labelBrand}</p>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-brown">{roastLabel}</p>
        <p className="mt-1 text-[10px] text-muted">{size}</p>
      </div>
    </div>
  );
}

/**
 * Multi-brand shop of roasted coffee sold by producers who roast their own.
 * Shown to visitors in Colombia only (see <OnlyInCountry> in the page).
 */
export function RoastedShop({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const s = dict.shop;
  const n = (value: number, digits = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

  return (
    <section className="mt-2 rounded-[32px] bg-cream-100 px-6 pb-12 pt-14 sm:px-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-[720px]">
          <p className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-green-600">
            <span className="rounded-full bg-lime-500 px-2.5 py-1 tracking-[0.04em] text-green-900">{s.badge}</span>
            {s.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.015em] text-green-900 sm:text-[56px]">
            {s.titleStart} <span className="font-normal italic">{s.titleEm}</span>
          </h2>
          <p className="mt-4 text-lg leading-normal text-sage sm:text-xl">{s.text}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <Link
            href={href(lang, "shop")}
            className="inline-flex min-h-[60px] items-center gap-3 whitespace-nowrap rounded-full bg-green-900 px-8 py-[18px] text-lg font-semibold text-white hover:bg-green-700"
          >
            {s.cta}
            <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-full bg-lime-500 text-base text-green-900">
              →
            </span>
          </Link>
          <Link href={href(lang, "sellWithUs")} className="px-1 py-2 text-base font-semibold text-brown hover:underline">
            {s.sellCta} →
          </Link>
        </div>
      </div>

      {/* Filters are links for now; they become real filters on the shop page */}
      <nav aria-label={s.filtersLabel} className="mt-8 flex flex-wrap gap-2.5">
        {s.filters.map((filter, i) => (
          <Link
            key={filter}
            href={href(lang, "shop")}
            aria-current={i === 0 ? "true" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-[18px] py-2.5 text-[15px] font-semibold ${
              i === 0 ? "bg-green-900 text-white" : "border border-line bg-white text-green-900 hover:bg-cream-100"
            }`}
          >
            {filter}
          </Link>
        ))}
      </nav>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sampleRoastedProducts.map((p) => {
          const size = `${n(p.grams)} g`;
          return (
            <article key={p.id} className="flex flex-col overflow-hidden rounded-3xl bg-white">
              <div className="relative flex h-[280px] items-center justify-center" style={{ background: p.stage }}>
                <span className={`absolute left-3.5 top-3.5 rounded-full px-[11px] py-1.5 text-xs font-semibold ${tagTone[p.tag]}`}>
                  {s.tags[p.tag]}
                </span>
                <BagMockup product={p} roastLabel={s.roast[p.roast]} size={size} />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 px-5 pb-[22px] pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-green-600">{p.brand}</p>
                <h3 className="font-display text-[22px] font-semibold leading-[1.2] text-green-900">{p.name[lang]}</h3>
                <p className="text-sm text-sage">
                  Urrao · {s.grind[p.grind]} · {size}
                </p>
                <p className="text-sm italic text-muted">{p.notes[lang]}</p>
                <div className="mt-auto flex items-center justify-between gap-2.5 pt-2.5">
                  <p className="font-display text-[22px] font-semibold text-green-900">USD {n(p.priceUsd, 2)}</p>
                  <Link
                    href={href(lang, "shop")}
                    className="inline-flex min-h-[46px] items-center whitespace-nowrap rounded-full bg-lime-500 px-[18px] py-3 text-[15px] font-semibold text-green-900 hover:brightness-95"
                  >
                    {s.addToCart}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-[18px] text-[13px] text-muted">{s.note}</p>
    </section>
  );
}
