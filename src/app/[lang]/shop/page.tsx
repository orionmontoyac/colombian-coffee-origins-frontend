import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shopMetadata } from "@/components/shop/seo";
import { ShopContent } from "@/components/shop/shop-content";
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
      <ShopContent lang={lang} dict={dict} />
    </div>
  );
}
