import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { BagMockup } from "@/components/ui/bag-mockup";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { ProductCard } from "@/components/ui/product-card";
import { RoastMeter } from "@/components/ui/roast-meter";
import { SectionHeader } from "@/components/ui/section-header";
import { uiLabels } from "@/components/ui/labels";
import { getProducer } from "@/data/producers";
import { defaultSize, pricePerKgCop, products, roastLabels, type Product } from "@/data/products";
import { href, productHref, producerHref } from "@/lib/routes";
import { roastedProduct } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/site";
import { AddButton } from "./add-button";
import { CartDrawer } from "./cart-drawer";
import { CartProvider } from "./cart-context";
import { FloatingCart } from "./floating-cart";
import { fill, formatCop, formatPerKg } from "./format";
import { ProductPurchase } from "./product-purchase";
import { breadcrumbLd, JsonLd, organizationLd, websiteLd } from "./seo";
import { ShopBanner } from "./shop-banner";
import { BannerChip, cartGrindLabels } from "./shop-content";
import { FREE_SHIPPING_COP, SHIPPING_COP } from "./constants";
import { toProductView, roastGroup } from "./views";

/** Roasted Product + Offer with Colombian shipping details and a return policy (SPEC section 6). */
function productLd(lang: Locale, dict: Dictionary, p: Product) {
  const size = defaultSize(p);
  const roast = roastLabels[p.roastLevel][lang];
  const description = fill(dict.productPage.jsonLdDescription, {
    name: p.name[lang],
    brand: p.brand,
    roast: roast.toLowerCase(),
    town: "Urrao",
    notes: p.notes[lang],
    grams: size.grams,
  });
  return roastedProduct({
    url: absoluteUrl(productHref(lang, p.slug)),
    sku: p.slug,
    name: `${p.brand} ${p.name[lang]}`,
    brand: p.brand,
    description,
    // TODO(owner): add `image` when real bag photos exist (ASSETS.md, product-photos-*)
    grams: size.grams,
    priceCop: size.priceCop,
    roast,
    roastLevel: p.roastLevel,
    shippingCop: SHIPPING_COP,
    returnDays: 5,
    handlingDays: { min: 0, max: 3 },
    transitDays: { min: 1, max: 5 },
  });
}

/** Roasted product page (Colombia only). */
export function ProductDetail({ lang, dict, product: p }: { lang: Locale; dict: Dictionary; product: Product }) {
  const t = dict.productPage;
  const size = defaultSize(p);
  const name = p.name[lang];
  const roast = roastLabels[p.roastLevel][lang];
  const producer = p.producerSlug ? getProducer(p.producerSlug) : undefined;
  const town = producer?.town ?? "Urrao, Antioquia";
  const notes = p.notes[lang];
  const group = roastGroup(p.roastLevel);
  const home = { label: t.breadcrumbHome, href: href(lang, "home") };
  const shop = { label: t.breadcrumbShop, href: href(lang, "shop") };
  const grindLabels = t.purchase.grinds;

  const description = producer
    ? fill(t.descriptionProducer, { producer: producer.name, farm: producer.farm, town, notes })
    : fill(t.description, { brand: p.brand, town: "Urrao", notes });

  const facts: [string, React.ReactNode][] = [
    [t.about.facts.brand, p.brand],
    [
      t.about.facts.producer,
      producer ? (
        <Link href={producerHref(lang, producer.slug)} className="text-roast underline underline-offset-4 hover:text-roast-hover">
          {producer.name}
        </Link>
      ) : (
        t.about.producerPending
      ),
    ],
    ...(producer ? ([[t.about.facts.farm, producer.farm]] as [string, React.ReactNode][]) : []),
    [t.about.facts.town, town],
    [t.about.facts.roast, roast],
    [t.about.facts.size, `${size.grams} g`],
    [t.about.facts.perKg, formatPerKg(pricePerKgCop(size), lang)],
    [t.about.facts.roasted, t.about.roastedValue],
  ];

  const related = [
    ...products.filter((o) => o.slug !== p.slug && o.brandSlug && o.brandSlug === p.brandSlug),
    ...products.filter((o) => o.slug !== p.slug && !(o.brandSlug && o.brandSlug === p.brandSlug)),
  ].slice(0, 4);

  return (
    <CartProvider lang={lang} copy={dict.cart} grindLabels={cartGrindLabels(dict)}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            websiteLd(lang),
            breadcrumbLd([
              { name: home.label, path: home.href },
              { name: shop.label, path: shop.href },
              { name: `${p.brand} ${name}` },
            ]),
            productLd(lang, dict, p),
          ],
        }}
      />
      <ShopBanner
        lang={lang}
        nav={dict.nav}
        active="shop"
        breadcrumb={[home, shop, { label: name }]}
        backLink={{ label: t.allCoffees, href: shop.href }}
        chips={
          <>
            <BannerChip lead>{t.chipCo}</BannerChip>
            <BannerChip>{roast}</BannerChip>
          </>
        }
        title={p.brand}
        accent={name}
        description={description}
        stats={[
          { label: t.stats.roast, value: roast },
          { label: t.stats.size, value: `${size.grams} g` },
          { label: t.stats.perKg, value: formatPerKg(pricePerKgCop(size), lang), accent: true },
        ]}
      />

      <main id="main">
        <section className="mt-2 grid gap-6 pt-6 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div
              data-vt-name={`product-${p.slug}`}
              className="flex min-h-[420px] items-center justify-center rounded-xl py-16"
              style={{ background: p.stage }}
            >
              <div className="scale-[1.6]">
                <BagMockup color={p.bag} brand={p.labelBrand} roastLabel={roast} size={`${size.grams} g`} />
              </div>
            </div>
            <ul aria-label={t.galleryLabel} className="mt-4 grid grid-cols-3 gap-4">
              {t.photoViews.map((view, i) => (
                <li key={view}>
                  <PlaceholderImage
                    assetId={`product-photos-${p.slug}-${i + 1}`}
                    label={fill(t.photoLabel, { name: `${p.brand} ${name}`, view })}
                    ratio="1 / 1"
                    className="!p-3"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="self-start rounded-xl bg-roast-surface p-6 sm:p-8 lg:sticky lg:top-4">
            <p className="font-label text-xs font-medium uppercase tracking-[0.08em] text-roast">{p.brand}</p>
            <p className="mt-1 mb-5 text-body-md text-roast-body">
              {producer ? `${producer.name} · ${producer.farm} · ${town}` : town}
            </p>
            <ProductPurchase
              slug={p.slug}
              sizes={p.sizes.map((s) => ({
                grams: s.grams,
                price: formatCop(s.priceCop, lang),
                perKg: formatPerKg(pricePerKgCop(s), lang),
              }))}
              grinds={p.grindOptions.map((value) => ({ value, label: grindLabels[value] }))}
              copy={{
                heading: t.purchase.heading,
                size: t.purchase.size,
                grind: t.purchase.grind,
                preGroundNote: t.purchase.preGroundNote,
                add: t.purchase.add,
                roastedTitle: t.purchase.roastedTitle,
                roastedText: t.purchase.roastedText,
                storage: t.purchase.storage,
              }}
            />
          </div>
        </section>

        <section className="grid gap-10 px-6 pb-2 pt-14 sm:px-12 lg:grid-cols-2">
          <div>
            <SectionHeader line="roasted" title={t.about.title} accent={t.about.accent} />
            <h3 className="mt-6 font-display text-headline-sm text-roast-dark">{t.about.notesTitle}</h3>
            <p className="mt-1 font-display text-headline-md italic text-roast">{notes}</p>
            <h3 className="mt-6 font-display text-headline-sm text-roast-dark">{t.about.roastTitle}</h3>
            <p className="mt-2 inline-flex items-center gap-3 text-body-md text-roast-body">
              <RoastMeter
                level={p.roastLevel}
                label={fill(t.about.roastMeter, { label: roast, level: p.roastLevel })}
                hint={fill(uiLabels[lang].roastHint, { label: roast, level: p.roastLevel })}
                size={20}
              />
              {roast}
            </p>
            <h3 className="mt-6 font-display text-headline-sm text-roast-dark">{t.about.brewingTitle}</h3>
            <p className="mt-1 max-w-[62ch] text-body-md text-roast-body">{t.about.brewing[group]}</p>
          </div>
          <div>
            <h3 className="font-display text-headline-md text-roast-dark">{t.about.factsTitle}</h3>
            <dl className="mt-3 divide-y divide-roast-line border-y border-roast-line">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3 text-body-md">
                  <dt className="text-roast-body">{label}</dt>
                  <dd className="text-right font-semibold text-roast-dark">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mt-12 rounded-xl bg-roast-surface px-6 py-12 sm:px-12">
          <SectionHeader line="roasted" title={t.shipping.title} accent={t.shipping.accent} />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(
              [
                [t.shipping.shippingTitle, t.shipping.shipping],
                [t.shipping.returnsTitle, t.shipping.returns],
                [t.shipping.paymentTitle, t.shipping.payment],
              ] as const
            ).map(([title, text]) => (
              <div key={title} className="rounded-lg bg-roast-card p-6">
                <h3 className="font-display text-headline-md text-roast-dark">{title}</h3>
                <p className="mt-2 text-body-md text-roast-body">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-body-sm text-roast-body">
            {formatCop(SHIPPING_COP, lang)} · {formatCop(FREE_SHIPPING_COP, lang)}. {t.note}
          </p>
        </section>

        <section className="pb-2 pt-14">
          <SectionHeader line="roasted" title={t.related.title} accent={t.related.accent} />
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((o) => {
              const v = toProductView(o, lang, dict);
              return (
                <li key={o.slug} className="rounded-lg border border-roast-line">
                  <ProductCard
                    brand={v.brand}
                    name={v.name}
                    meta={v.meta}
                    notes={v.notes}
                    tag={v.tag}
                    bag={{ ...v.bag }}
                    roast={v.roast}
                    price={v.price}
                    pricePerKg={v.pricePerKg}
                    href={v.href}
                    addSlot={
                      <AddButton
                        slug={v.slug}
                        grind={v.defaultGrind}
                        grams={v.grams}
                        label={dict.shopPage.catalog.add}
                        ariaLabel={fill(dict.shopPage.catalog.addAria, { name: `${v.brand} ${v.name}` })}
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <SiteFooter lang={lang} dict={dict} />
      <CartDrawer />
      <FloatingCart />
    </CartProvider>
  );
}
