import type { Metadata } from "next";
import { notFound } from "next/navigation";
import hills from "@/assets/home/hero-coffee-hills.jpg";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { URRAO_GEO } from "@/components/regions/data";
import { UrraoPage } from "@/components/regions/urrao-page";
import { alternates, href } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/regions/urrao">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { regionsPage } = await getDictionary();
  return pageMeta({ lang, ...regionsPage.urraoMeta, paths: alternates("urrao"), image: hills });
}

export default async function Page({ params }: PageProps<"/[lang]/regions/urrao">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.regionsPage;
  const url = absoluteUrl(href(lang, "urrao"));
  const data = graph(
    lang,
    [
      homeCrumb(lang, dict),
      routeCrumb(lang, "regions", t.breadcrumb.regions),
      routeCrumb(lang, "urrao", t.breadcrumb.urrao),
    ],
    [
      {
        "@type": "Place",
        "@id": `${url}#place`,
        name: "Urrao",
        description: t.urraoMeta.description,
        url,
        geo: URRAO_GEO,
        address: { "@type": "PostalAddress", addressLocality: "Urrao", addressRegion: "Antioquia", addressCountry: "CO" },
        containedInPlace: { "@type": "AdministrativeArea", name: "Antioquia, Colombia" },
        image: absoluteUrl(hills.src),
      },
    ],
  );
  return (
    <>
      <JsonLd data={data} />
      <UrraoPage lang={lang} dict={dict} />
    </>
  );
}
