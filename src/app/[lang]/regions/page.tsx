import type { Metadata } from "next";
import { notFound } from "next/navigation";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { RegionsIndex } from "@/components/regions/index-page";
import { absoluteUrl } from "@/lib/site";
import { alternates, href } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/regions">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { regionsPage } = await getDictionary();
  return pageMeta({ lang, ...regionsPage.meta, paths: alternates("regions"), image: hills });
}

export default async function RegionsPage({ params }: PageProps<"/[lang]/regions">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const items = dict.regionsPage.index.list.items;
  const data = graph(lang, [homeCrumb(lang, dict), routeCrumb(lang, "regions", dict.regionsPage.breadcrumb.regions)], [
    {
      "@type": "ItemList",
      name: dict.regionsPage.meta.title,
      numberOfItems: items.length,
      itemListElement: items.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.name,
        ...(r.id === "urrao" ? { url: absoluteUrl(href(lang, "urrao")) } : {}),
      })),
    },
  ]);
  return (
    <>
      <JsonLd data={data} />
      <RegionsIndex lang={lang} dict={dict} />
    </>
  );
}
