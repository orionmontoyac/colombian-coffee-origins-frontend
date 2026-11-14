import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { fill } from "@/components/producer/format";
import { Chip, CtaPanel, SectionHeader, SubpageBanner } from "@/components/ui";
import { href } from "@/lib/routes";
import { articleHref, articles, getArticle } from "./articles";
import { formatDate, getBlocks, readingMinutes, slugify } from "./content";
import { RichText, resolveTarget } from "./rich-text";
import type { ArticleId } from "./types";

const RELATED = ["lots", "producers", "urrao", "buyers", "samples"] as const;

/** One journal article: banner with published date, reading time and topic, body, related links, CTA. */
export function ArticlePage({ lang, dict, id }: { lang: Locale; dict: Dictionary; id: ArticleId }) {
  const t = dict.journal;
  const meta = getArticle(id);
  const c = t.articles[id];
  const blocks = getBlocks(lang, id);
  const minutes = readingMinutes(blocks);
  const sections = blocks.filter((b) => b.h2);
  const others = articles.filter((a) => a.id !== id);

  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[
          { label: dict.nav.home, href: href(lang, "home") },
          { label: t.breadcrumb.journal, href: href(lang, "journal") },
          { label: c.name },
        ]}
        backLink={{ label: t.article.back, href: href(lang, "journal") }}
        chips={<Chip tone="lime">{c.topic}</Chip>}
        title={c.title}
        accent={c.accent}
        description={c.excerpt}
        stats={[
          { label: t.article.published, value: formatDate(lang, meta.datePublished), accent: true },
          { label: t.article.reading, value: fill(t.article.minutes, { n: minutes }) },
          { label: t.article.topic, value: c.topic },
        ]}
      />
      <main id="main">
        <div className="grid gap-12 px-4 pb-2 pt-14 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image src={meta.image} alt={meta.imageAlt[lang]} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
            <div className="mt-8 max-w-[68ch] text-body-lg text-body">
              {blocks.map((b, i) => (
                <section key={b.h2 ?? i} className={i === 0 ? "" : "mt-10"}>
                  {b.h2 ? (
                    <h2 id={slugify(b.h2)} className="scroll-mt-6 font-display text-headline-md text-primary">{b.h2}</h2>
                  ) : null}
                  {b.p.map((p) => (
                    <p key={p.slice(0, 40)} className={b.h2 ? "mt-4" : i === 0 ? "" : "mt-4"}>
                      <RichText lang={lang} text={p} />
                    </p>
                  ))}
                </section>
              ))}
            </div>
            <p className="mt-10 max-w-[68ch] rounded-lg bg-surface p-5 text-body-sm text-muted">{t.article.draft}</p>
          </article>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <nav aria-label={t.article.tocLabel} className="rounded-lg bg-surface p-xl">
              <p className="font-display text-headline-sm text-primary">{t.article.tocLabel}</p>
              <ol className="mt-3 flex flex-col gap-1 text-body-md">
                {sections.map((b) => (
                  <li key={b.h2}>
                    <a href={`#${slugify(b.h2!)}`} className="inline-flex min-h-tap-target items-center text-body underline-offset-4 hover:text-primary hover:underline">
                      {b.h2}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="rounded-lg bg-surface p-xl">
              <p className="font-display text-headline-sm text-primary">
                {t.article.related.title} <span className="font-normal italic">{t.article.related.accent}</span>
              </p>
              <ul className="mt-3 flex flex-col gap-1">
                {RELATED.map((k) => (
                  <li key={k}>
                    <Link href={resolveTarget(lang, k)} className="inline-flex min-h-tap-target items-center gap-2 font-label text-label-md text-primary underline-offset-4 hover:underline">
                      {t.article.related.links[k]} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.article.more.title} accent={t.article.more.accent} />
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((a) => (
              <li key={a.id} className="rounded-lg bg-surface p-xl">
                <p className="text-body-sm text-muted">{t.articles[a.id].topic}</p>
                <h3 className="mt-1 font-display text-headline-md text-primary">
                  <Link href={articleHref(lang, a.id)} className="hover:underline">{t.articles[a.id].name}</Link>
                </h3>
                <p className="mt-2 text-body-md text-body">{t.articles[a.id].excerpt}</p>
              </li>
            ))}
          </ul>
        </section>

        <CtaPanel
          eyebrow={t.article.cta.eyebrow}
          title={t.article.cta.title}
          accent={t.article.cta.accent}
          text={t.article.cta.text}
          image={meta.image}
          primary={{ label: t.article.cta.primary, href: href(lang, "samples") }}
          secondary={{ label: t.article.cta.secondary, href: href(lang, "coffees") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
