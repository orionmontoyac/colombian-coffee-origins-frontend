import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { fill } from "@/components/producer/format";
import { Chip, SectionHeader, SubpageBanner } from "@/components/ui";
import { href } from "@/lib/routes";
import { articleHref, articles } from "./articles";
import { formatDate, getBlocks, readingMinutes } from "./content";

/** /journal: banner and a grid of the three starter articles. */
export function JournalIndex({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.journal;
  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[{ label: dict.nav.home, href: href(lang, "home") }, { label: t.breadcrumb.journal }]}
        chips={t.banner.chips.map((c, i) => (
          <Chip key={c} tone={i === 0 ? "lime" : "white"}>{c}</Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.stats.articles, value: String(articles.length), accent: true },
          { label: t.banner.stats.languages, value: t.banner.languagesValue },
          { label: t.banner.stats.topics, value: t.banner.topicsValue },
        ]}
      />
      <main id="main">
        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.list.title} accent={t.list.accent} text={t.list.text} />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => {
              const c = t.articles[a.id];
              const minutes = readingMinutes(getBlocks(lang, a.id));
              return (
                <article key={a.id} className="flex flex-col overflow-hidden rounded-notch bg-surface">
                  <div className="relative h-56">
                    <Image src={a.image} alt={a.imageAlt[lang]} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="flex flex-wrap items-center gap-x-3 text-body-sm text-muted">
                      <Chip size="sm">{c.topic}</Chip>
                      <time dateTime={a.datePublished}>{formatDate(lang, a.datePublished)}</time>
                      <span>{fill(t.list.minutes, { n: minutes })}</span>
                    </p>
                    <h3 className="font-display text-headline-md text-primary">
                      <Link href={articleHref(lang, a.id)} className="hover:underline">{c.name}</Link>
                    </h3>
                    <p className="text-body-md text-body">{c.excerpt}</p>
                    <Link href={articleHref(lang, a.id)} className="mt-auto inline-flex min-h-tap-target items-center gap-2 font-label text-label-md text-primary underline-offset-4 hover:underline">
                      {t.list.read} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
