import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CountryGate } from "@/components/shop/country-gate";
import { fill, formatCop } from "@/components/shop/format";
import { ProductDetail } from "@/components/shop/product-detail";
import { shopMetadata } from "@/components/shop/seo";
import { ShopUnavailable } from "@/components/shop/unavailable";
import { brandName, defaultSize, getProduct, productParams, roastLabels } from "@/data/products";
import { productAlternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../../dictionaries";

export const generateStaticParams = productParams;

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) return {};
  const dict = await getDictionary();
  const size = defaultSize(product);
  const vars = {
    brand: brandName(product.brand, lang),
    name: product.name[lang],
    roast: roastLabels[product.roastLevel][lang].toLowerCase(),
    grams: size.grams,
    town: "Urrao",
    price: formatCop(size.priceCop, lang).replace(/^COP /, "").replace(/^\$/, ""),
  };
  return shopMetadata({
    lang,
    title: fill(dict.productPage.metaTitle, vars),
    description: fill(dict.productPage.metaDescription, vars),
    paths: productAlternates(product.slug),
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/shop/[slug]">) {
  const { lang, slug } = await params;
  const product = getProduct(slug);
  if (!hasLocale(lang) || !product) notFound();
  const dict = await getDictionary();
  return (
    <div className="min-h-screen p-2">
      <Suspense fallback={<div role="status" aria-label={dict.shopPage.loading} className="min-h-[70vh] rounded-xl bg-roast-dark" />}>
        <CountryGate
          shop={<ProductDetail lang={lang} dict={dict} product={product} />}
          notice={<ShopUnavailable lang={lang} dict={dict} />}
        />
      </Suspense>
    </div>
  );
}
