import type { Metadata } from "next";
import { notFound } from "next/navigation";
import farmers from "@/assets/home/farmers-harvest.jpg";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { StoryPage } from "@/components/story/story-page";
import { alternates } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/our-story">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { storyPage } = await getDictionary();
  return pageMeta({ lang, ...storyPage.meta, paths: alternates("ourStory"), image: farmers });
}

export default async function Page({ params }: PageProps<"/[lang]/our-story">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const data = graph(lang, [homeCrumb(lang, dict), routeCrumb(lang, "ourStory", dict.storyPage.breadcrumb)], [
    { "@type": "AboutPage", name: dict.storyPage.meta.title, description: dict.storyPage.meta.description, inLanguage: lang },
  ]);
  return (
    <>
      <JsonLd data={data} />
      <StoryPage lang={lang} dict={dict} />
    </>
  );
}
