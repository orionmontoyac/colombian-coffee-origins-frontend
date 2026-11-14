import { AnswerFirst } from "@/components/ai/answer-first";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fill } from "@/components/producer/format";
import { Profile } from "@/components/producer/profile";
import { JsonLd, pageMetadata, profileJsonLd } from "@/components/producer/seo";
import { getProducer, producerParams } from "@/data/producers";
import { producerAlternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../../dictionaries";

export const generateStaticParams = producerParams;

export async function generateMetadata({ params }: PageProps<"/[lang]/producers/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const producer = getProducer(slug);
  // The page itself calls notFound(); metadata for an unknown slug stays empty.
  if (!hasLocale(lang) || !producer) return {};
  const dict = await getDictionary();
  const vars = {
    name: producer.name,
    farm: producer.farm,
    altitude: new Intl.NumberFormat(lang).format(producer.altitudeM),
  };
  return pageMetadata({
    lang,
    title: fill(dict.producerPage.meta.title, vars),
    description: fill(dict.producerPage.meta.description, vars),
    paths: producerAlternates(producer.slug),
  });
}

export default async function ProducerPage({ params }: PageProps<"/[lang]/producers/[slug]">) {
  const { lang, slug } = await params;
  const producer = getProducer(slug);
  if (!hasLocale(lang) || !producer) notFound();
  const dict = await getDictionary();
  return (
    <>
      <JsonLd data={profileJsonLd(lang, dict, producer)} />
      <Profile lang={lang} dict={dict} producer={producer} answer={<AnswerFirst lang={lang} kind="producer" id={producer.slug} />} />
    </>
  );
}
