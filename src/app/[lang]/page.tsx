import { notFound } from "next/navigation";
import { AudienceCards } from "@/components/home/audience-cards";
import { Hero } from "@/components/home/hero";
import { RoastedShop } from "@/components/home/roasted-shop";
import { OnlyInCountry } from "@/components/only-in-country";
import {
  ClosingCta,
  Farmers,
  FeaturedLots,
  Regions,
  SiteFooter,
  Story,
} from "@/components/home/sections";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="min-h-screen p-2">
      <Hero lang={lang} dict={dict} />
      <main>
        <AudienceCards lang={lang} dict={dict} />
        <Farmers lang={lang} dict={dict} />
        <FeaturedLots lang={lang} dict={dict} />
        {/* Roasted coffee is sold inside Colombia only for now */}
        <OnlyInCountry country="CO">
          <RoastedShop lang={lang} dict={dict} />
        </OnlyInCountry>
        <Story dict={dict} />
        {/* "Why Colombian specialty" (<Facts />) is hidden in the current design */}
        <Regions lang={lang} dict={dict} />
        <ClosingCta lang={lang} dict={dict} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
