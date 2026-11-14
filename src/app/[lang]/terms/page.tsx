import type { Metadata } from "next";
import { notFound } from "next/navigation";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { LegalPage } from "@/components/legal/legal-page";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { legal } = await getDictionary();
  return pageMeta({ lang, ...legal.terms.meta, paths: alternates("terms"), image: hills });
}

export default async function Page({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const data = graph(lang, [homeCrumb(lang, dict), routeCrumb(lang, "terms", dict.legal.terms.breadcrumb)], [
    { "@type": "WebPage", name: dict.legal.terms.meta.title, description: dict.legal.terms.meta.description, inLanguage: lang },
  ]);
  return (
    <>
      <JsonLd data={data} />
      <LegalPage lang={lang} dict={dict} doc="terms" />
    </>
  );
}
