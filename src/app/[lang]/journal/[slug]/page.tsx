import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/journal/article-page";
import { articleAlternates, articleBySlug, articleHref, articleParams } from "@/components/journal/articles";
import { getBlocks, wordCount } from "@/components/journal/content";
import { JsonLd, graph, homeCrumb, pageMeta, routeCrumb } from "@/components/journal/seo";
import { href } from "@/lib/routes";
import { absoluteUrl, site } from "@/lib/site";
import { getDictionary, hasLocale } from "../../dictionaries";

export function generateStaticParams() {
  return articleParams();
}

export async function generateMetadata({ params }: PageProps<"/[lang]/journal/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const article = articleBySlug(lang, slug);
  if (!article) notFound();
  const { journal } = await getDictionary();
  const c = journal.articles[article.id];
  return pageMeta({
    lang, title: c.metaTitle, description: c.description, paths: articleAlternates(article.id), image: article.image, type: "article",
  });
}

export default async function Page({ params }: PageProps<"/[lang]/journal/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const article = articleBySlug(lang, slug);
  if (!article) notFound();
  const dict = await getDictionary();
  const c = dict.journal.articles[article.id];
  const url = absoluteUrl(articleHref(lang, article.id));
  const data = graph(
    lang,
    [
      homeCrumb(lang, dict),
      routeCrumb(lang, "journal", dict.journal.breadcrumb.journal),
      { name: c.name, path: articleHref(lang, article.id) },
    ],
    [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: c.name,
        description: c.description,
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        wordCount: wordCount(getBlocks(lang, article.id)),
        image: [absoluteUrl(article.image.src)],
        author: { "@type": "Organization", "@id": `${site.baseUrl}/#organization`, name: dict.journal.author, url: site.baseUrl },
        publisher: { "@id": `${site.baseUrl}/#organization` },
        isPartOf: { "@type": "Blog", url: absoluteUrl(href(lang, "journal")) },
      },
    ],
  );
  return (
    <>
      <JsonLd data={data} />
      <ArticlePage lang={lang} dict={dict} id={article.id} />
    </>
  );
}
