import type { Metadata } from "next";
import { notFound } from "next/navigation";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { articleHref, articles } from "@/components/journal/articles";
import { JournalIndex } from "@/components/journal/index-page";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { absoluteUrl } from "@/lib/site";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { journal } = await getDictionary();
  return pageMeta({ lang, ...journal.meta, paths: alternates("journal"), image: hills });
}

export default async function JournalPage({ params }: PageProps<"/[lang]/journal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const data = graph(lang, [homeCrumb(lang, dict), routeCrumb(lang, "journal", dict.journal.breadcrumb.journal)], [
    {
      "@type": "ItemList",
      name: dict.journal.meta.title,
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(articleHref(lang, a.id)),
        name: dict.journal.articles[a.id].name,
      })),
    },
  ]);
  return (
    <>
      <JsonLd data={data} />
      <JournalIndex lang={lang} dict={dict} />
    </>
  );
}
