import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Directory } from "@/components/producer/directory";
import { directoryJsonLd, JsonLd, pageMetadata } from "@/components/producer/seo";
import { producers } from "@/data/producers";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/producers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const { title, description } = dict.producersPage.meta;
  return pageMetadata({ lang, title, description, paths: alternates("producers") });
}

export default async function ProducersPage({ params }: PageProps<"/[lang]/producers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  return (
    <>
      <JsonLd data={directoryJsonLd(lang, dict, producers)} />
      <Directory lang={lang} dict={dict} />
    </>
  );
}
