import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { slugify } from "@/components/journal/content";
import { fill } from "@/components/producer/format";
import { Button, Chip, SubpageBanner } from "@/components/ui";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";

export type LegalDoc = "privacy" | "terms";

/** Replaces {entity}, {nit} and {pqrs} with the site.ts placeholders. */
export const legalVars = { entity: site.legal.entityName, nit: site.legal.nit, pqrs: site.contact.pqrsEmail };

/** Privacy and terms share one layout: banner, draft notice, table of contents, numbered sections, PQRS card. */
export function LegalPage({ lang, dict, doc }: { lang: Locale; dict: Dictionary; doc: LegalDoc }) {
  const c = dict.legal.common;
  const t = dict.legal[doc];
  const other: LegalDoc = doc === "privacy" ? "terms" : "privacy";
  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[{ label: dict.nav.home, href: href(lang, "home") }, { label: t.breadcrumb }]}
        chips={<Chip tone="lime">{c.draftChip}</Chip>}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: c.stats.status, value: c.statusValue, accent: true },
          { label: c.stats.updated, value: c.updatedValue },
          { label: c.stats.law, value: c.lawValue },
        ]}
      />
      <main id="main">
        <div className="grid gap-12 px-4 pb-2 pt-14 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <nav aria-label={c.tocLabel} className="rounded-lg bg-surface p-xl">
              <p className="font-display text-headline-sm text-primary">{c.tocLabel}</p>
              <ol className="mt-3 flex flex-col gap-1 text-body-md">
                {t.sections.map((s) => (
                  <li key={s.title}>
                    <a href={`#${slugify(s.title)}`} className="inline-flex min-h-tap-target items-center text-body underline-offset-4 hover:text-primary hover:underline">
                      {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#pqrs" className="inline-flex min-h-tap-target items-center text-body underline-offset-4 hover:text-primary hover:underline">
                    {c.pqrsTitle}
                  </a>
                </li>
              </ol>
            </nav>
          </aside>
          <article className="max-w-[68ch]">
            <p className="rounded-lg bg-surface-sunken p-5 text-body-md text-ink">{c.draftNote}</p>
            <p className="mt-4 text-body-sm text-muted">{fill(c.entityLine, legalVars)}</p>
            {t.sections.map((s) => (
              <section key={s.title} className="mt-10">
                <h2 id={slugify(s.title)} className="scroll-mt-6 font-display text-headline-md text-primary">{s.title}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-body-md text-body">{fill(p, legalVars)}</p>
                ))}
              </section>
            ))}
            <section id="pqrs" className="mt-12 scroll-mt-6 rounded-lg bg-surface p-xl">
              <h2 className="font-display text-headline-md text-primary">{c.pqrsTitle}</h2>
              <p className="mt-3 text-body-md text-body">{fill(c.pqrsText, legalVars)}</p>
              <Button href={`mailto:${site.contact.pqrsEmail}`} variant="on-dark" size="md" className="mt-4">
                {c.pqrsLink}
              </Button>
            </section>
            <p className="mt-8 text-body-md text-body">
              {c.relatedLabel}:{" "}
              <Link href={href(lang, other)} className="font-medium text-primary underline underline-offset-4">
                {c.related[other]}
              </Link>
            </p>
          </article>
        </div>
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
