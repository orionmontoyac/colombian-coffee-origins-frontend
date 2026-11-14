import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { Bean } from "@/components/ui/bean";
import { brands, products, productsByBrand } from "@/data/products";
import { href, productHref } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";
import { CartDrawer } from "./cart-drawer";
import { CartProvider } from "./cart-context";
import { FloatingCart } from "./floating-cart";
import { formatCop } from "./format";
import { breadcrumbLd, JsonLd, organizationLd, websiteLd } from "./seo";
import { ShopBanner } from "./shop-banner";
import { ShopCatalog } from "./shop-catalog";
import { ClubAndQuiz, Delivery, Perks, SellBand } from "./sections";
import { toProductView } from "./views";

/** Dark-banner chip on the shop (Shop board): caramel with a bean for the lead chip, outlined for the rest. */
export function BannerChip({ lead = false, children }: { lead?: boolean; children: React.ReactNode }) {
  return lead ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-caramel px-3 py-[7px] font-label text-[13px] font-medium text-roast-dark">
      <Bean size={14} />
      {children}
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-on-roast-body/35 bg-neutral/10 px-3 py-[7px] font-label text-[13px] font-medium text-on-primary">
      {children}
    </span>
  );
}

export function cartGrindLabels(dict: Dictionary) {
  return dict.productPage.purchase.grinds;
}

/** The Colombia-only shop page: banner, perks, filtered grid, brands, club, delivery, sell band. */
export function ShopContent({ lang, dict, answer }: { lang: Locale; dict: Dictionary; answer?: ReactNode }) {
  const t = dict.shopPage;
  const views = products.map((p) => toProductView(p, lang, dict));
  const brandViews = brands.map((b) => ({
    slug: b.slug,
    name: b.name,
    place: b.place,
    color: b.color,
    count: productsByBrand(b.slug).length,
  }));
  const cheapest = Math.min(...products.map((p) => p.sizes[0].priceCop));
  const home = { label: t.breadcrumbHome, href: href(lang, "home") };

  return (
    <CartProvider lang={lang} copy={dict.cart} grindLabels={cartGrindLabels(dict)}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            websiteLd(),
            breadcrumbLd([{ name: home.label, path: home.href }, { name: t.breadcrumbShop }]),
            {
              "@type": "ItemList",
              name: t.breadcrumbShop,
              numberOfItems: views.length,
              itemListElement: views.map((v, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${v.brand} ${v.name}`,
                url: absoluteUrl(productHref(lang, v.slug)),
              })),
            },
          ],
        }}
      />
      <ShopBanner
        lang={lang}
        nav={dict.nav}
        active="shop"
        breadcrumb={[home, { label: t.breadcrumbShop }]}
        chips={
          <>
            <BannerChip lead>{t.chips.roastedBy}</BannerChip>
            <BannerChip>{t.chips.ships}</BannerChip>
            <BannerChip>{t.chips.prices}</BannerChip>
          </>
        }
        title={t.title}
        accent={t.accent}
        description={t.description}
        stats={[
          { label: t.stats.coffees, value: String(views.length), accent: true },
          { label: t.stats.brands, value: String(brands.length) },
          { label: t.stats.from, value: formatCop(cheapest, lang) },
        ]}
      />
      <main id="main">
        {answer}
        <Perks copy={t} />
        <ShopCatalog products={views} brands={brandViews} copy={t.catalog} brandsCopy={t.brands} />
        <ClubAndQuiz copy={t} />
        <Delivery copy={t} />
        <SellBand lang={lang} copy={t} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
      <CartDrawer />
      <FloatingCart />
    </CartProvider>
  );
}
