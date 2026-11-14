import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { sampleRoastedProducts, type SampleRoastedProduct } from "@/data/sample-roasted";
import { ProductCard } from "@/components/ui/product-card";
import { href, productHref } from "@/lib/routes";

const tagTone: Record<SampleRoastedProduct["tag"], string> = {
  producerBrand: "bg-brown text-white",
  bestValue: "bg-roast-dark text-white",
  limited: "bg-white text-brown",
  ground: "bg-white text-green-900",
};

/** Shop prices: "COP 68,000" in English, "$68.000" in Spanish (Colombian format). */
function formatCop(value: number, lang: Locale) {
  if (lang === "es") return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value)}`;
  return `COP ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}

/**
 * Multi-brand shop of roasted coffee sold by producers who roast their own.
 * Brown identity (the roasted line), prices in COP. Shown to every
 * visitor; it ships inside Colombia only (the cart says so).
 */
export function RoastedShop({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const s = dict.shop;
  const grams = (value: number) => `${new Intl.NumberFormat(lang).format(value)} g`;

  return (
    <section className="mt-2 rounded-[32px] bg-roast-surface px-6 pb-12 pt-14 sm:px-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-[720px]">
          <p className="inline-flex flex-wrap items-center gap-2.5 font-label text-sm font-medium uppercase tracking-[0.08em] text-brown">
            <span className="rounded-full bg-brown px-2.5 py-1 tracking-[0.04em] text-white">{s.badge}</span>
            {s.eyebrow}
            <span className="rounded-full border border-roast-line bg-white px-2.5 py-1 normal-case tracking-normal text-roast-dark">
              {s.ships}
            </span>
          </p>
          <h2 className="mt-3 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.015em] text-roast-dark sm:text-[56px]">
            {s.titleStart} <span className="font-normal italic">{s.titleEm}</span>
          </h2>
          <p className="mt-4 text-lg leading-normal text-sage sm:text-xl">{s.text}</p>
        </div>
        <Link
          href={href(lang, "shop")}
          className="inline-flex min-h-[60px] items-center gap-3 whitespace-nowrap rounded-full bg-brown px-8 py-[18px] font-label text-lg font-medium text-white hover:bg-roast-hover"
        >
          {s.cta}
          <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-full bg-roast-surface text-base text-brown">
            →
          </span>
        </Link>
      </div>

      {/* Filters are links for now; they become real filters on the shop page */}
      <nav aria-label={s.filtersLabel} className="mt-8 flex flex-wrap gap-2.5">
        {s.filters.map((filter, i) => (
          <Link
            key={filter}
            href={href(lang, "shop")}
            aria-current={i === 0 ? "true" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-[18px] py-2.5 font-label text-[15px] font-medium ${
              i === 0 ? "bg-brown text-white" : "border border-roast-line bg-white text-roast-dark hover:bg-roast-surface"
            }`}
          >
            {filter}
          </Link>
        ))}
      </nav>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {sampleRoastedProducts.map((p) => {
          const size = grams(p.grams);
          return (
            <ProductCard
              key={p.id}
              brand={p.brand}
              name={p.name[lang]}
              meta={`Urrao · ${s.grind[p.grind]} · ${size}`}
              notes={p.notes[lang]}
              tag={{ label: s.tags[p.tag], className: tagTone[p.tag] }}
              // Bean icon on the bag label is off here to keep the home page unchanged; shop pages turn it on.
              bag={{ color: p.bag, stage: p.stage, label: p.labelBrand, roastLabel: s.roast[p.roast], size, beanIcon: false }}
              price={formatCop(p.priceCop, lang)}
              addLabel={s.addToCart}
              href={productHref(lang, p.id)}
              addHref={productHref(lang, p.id)}
            />
          );
        })}
      </div>
      <p className="mt-[18px] text-[13px] text-muted">{s.note}</p>
    </section>
  );
}
