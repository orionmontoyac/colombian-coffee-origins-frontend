import type { Metadata } from "next";
import { notFound } from "next/navigation";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { legal } = await getDictionary();
  return pageMeta({ lang, ...legal.privacy.meta, paths: alternates("privacy"), image: hills });
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const data = graph(lang, [homeCrumb(lang, dict), routeCrumb(lang, "privacy", dict.legal.privacy.breadcrumb)], [
    { "@type": "WebPage", name: dict.legal.privacy.meta.title, description: dict.legal.privacy.meta.description, inLanguage: lang },
  ]);
  return (
    <>
      <JsonLd data={data} />
      <LegalPage lang={lang} dict={dict} doc="privacy" />
    </>
  );
}
