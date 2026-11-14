import { AnswerFirst } from "@/components/ai/answer-first";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CountryGate } from "@/components/shop/country-gate";
import { shopMetadata } from "@/components/shop/seo";
import { ShopContent } from "@/components/shop/shop-content";
import { ShopUnavailable } from "@/components/shop/unavailable";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary();
  return shopMetadata({
    lang,
    title: dict.shopPage.metaTitle,
    description: dict.shopPage.metaDescription,
    paths: alternates("shop"),
  });
}

export default async function ShopPage({ params }: PageProps<"/[lang]/shop">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  return (
    <div className="min-h-screen p-2">
      <Suspense fallback={<div role="status" aria-label={dict.shopPage.loading} className="min-h-[70vh] rounded-xl bg-roast-dark" />}>
        <CountryGate
          shop={<ShopContent lang={lang} dict={dict} answer={<AnswerFirst lang={lang} kind="shop" />} />}
          notice={<ShopUnavailable lang={lang} dict={dict} answer={<AnswerFirst lang={lang} kind="shop" />} />}
        />
      </Suspense>
    </div>
  );
}
