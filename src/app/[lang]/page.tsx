import { AnswerFirst } from "@/components/ai/answer-first";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import coffeeHills from "@/assets/home/hero-coffee-hills.jpg";
import { BusinessLines } from "@/components/home/business-lines";
import { Hero } from "@/components/home/hero";
import { RoastedShop } from "@/components/home/roasted-shop";
import { FaqTeaser, faqTeaserItems } from "@/components/home/faq-teaser";
import { homeJsonLd, homeMetadata } from "@/components/home/seo";
import { OnlyInCountry } from "@/components/only-in-country";
import {
  ClosingCta,
  Farmers,
  FeaturedLots,
  ProducersBand,
  SiteFooter,
} from "@/components/home/sections";
import { getDictionary, hasLocale } from "./dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { hero } = await getDictionary();
  return homeMetadata(lang, hero.meta, coffeeHills.src);
}

// Section order follows the "Home — Desktop" board in Claude Design.
// <Story />, <Facts /> and <Regions /> stay in sections.tsx but are hidden in the current design.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const jsonLd = homeJsonLd(lang, faqTeaserItems(dict));

  return (
    <div className="min-h-screen p-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero lang={lang} dict={dict} />
      <main id="main">
        {/* Business lines tuck under the hero (wide:-mt-14), so the answer block goes after them */}
        <BusinessLines lang={lang} dict={dict} />
        <AnswerFirst lang={lang} kind="home" />
        <Farmers lang={lang} dict={dict} />
        <FeaturedLots lang={lang} dict={dict} />
        {/* Roasted coffee is sold inside Colombia only for now */}
        <OnlyInCountry country="CO">
          <RoastedShop lang={lang} dict={dict} />
        </OnlyInCountry>
        <ProducersBand lang={lang} dict={dict} />
        <FaqTeaser lang={lang} dict={dict} />
        <ClosingCta lang={lang} dict={dict} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
