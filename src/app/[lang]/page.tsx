import { notFound } from "next/navigation";
import { AudienceCards } from "@/components/home/audience-cards";
import { Hero } from "@/components/home/hero";
import {
  ClosingCta,
  FeaturedLots,
  HowItWorks,
  Regions,
  SiteFooter,
  Story,
  Trust,
} from "@/components/home/sections";
import { getDictionary, hasLocale } from "./dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();

  return (
    <div className="min-h-screen p-4">
      <Hero lang={lang} dict={dict} />
      <main>
        <AudienceCards lang={lang} dict={dict} />
        <FeaturedLots lang={lang} dict={dict} />
        <Story dict={dict} />
        <HowItWorks dict={dict} />
        <Trust dict={dict} />
        <Regions lang={lang} dict={dict} />
        <ClosingCta lang={lang} dict={dict} />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
