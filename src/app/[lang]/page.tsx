import { notFound } from "next/navigation";
import { BusinessLines } from "@/components/home/business-lines";
import { Hero } from "@/components/home/hero";
import { RoastedShop } from "@/components/home/roasted-shop";
import { OnlyInCountry } from "@/components/only-in-country";
import {
  ClosingCta,
  Farmers,
  FeaturedLots,
  ProducersBand,
  SiteFooter,
} from "@/components/home/sections";
import { getDictionary, hasLocale } from "./dictionaries";

// Section order follows the "Home — Desktop" board in Claude Design.
// <Story />, <Facts /> and <Regions /> stay in sections.tsx but are hidden in the current design.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="min-h-screen p-2">
      <Hero lang={lang} dict={dict} />
      <main id="main">
        <BusinessLines lang={lang} dict={dict} />
        <Farmers lang={lang} dict={dict} />
        <FeaturedLots lang={lang} dict={dict} />
        {/* Roasted coffee is sold inside Colombia only for now */}
        <OnlyInCountry country="CO">
          <RoastedShop lang={lang} dict={dict} />
        </OnlyInCountry>
        <ProducersBand lang={lang} dict={dict} />
        <ClosingCta lang={lang} dict={dict} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
