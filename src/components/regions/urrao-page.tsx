import type { ReactNode } from "react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { articleHref } from "@/components/journal/articles";
import { Button, Chip, CtaPanel, LotCard, PlaceholderImage, ProducerCard, SectionHeader, SubpageBanner } from "@/components/ui";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { lots, lotsByProducer } from "@/data/lots";
import { producers } from "@/data/producers";
import { fill, formatNumber, plural } from "@/components/producer/format";
import { href, lotHref, producerHref } from "@/lib/routes";
import { harvestCalendar } from "./data";

/** /regions/urrao: facts table, varieties, harvest calendar, producers, lots, map placeholder. */
export function UrraoPage({ lang, dict, answer }: { lang: Locale; dict: Dictionary; answer?: ReactNode }) {
  const t = dict.regionsPage.urrao;
  const card = dict.lotsPage.card;
  const urraoLots = lots.filter((l) => l.region.startsWith("Urrao"));
  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(lang, { month: "short" }).format(new Date(2026, i, 1)),
  );

  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[
          { label: dict.nav.home, href: href(lang, "home") },
          { label: dict.regionsPage.breadcrumb.regions, href: href(lang, "regions") },
          { label: dict.regionsPage.breadcrumb.urrao },
        ]}
        backLink={{ label: dict.regionsPage.breadcrumb.regions, href: href(lang, "regions") }}
        chips={t.banner.chips.map((c, i) => (
          <Chip key={c} tone={i === 0 ? "lime" : "white"}>{c}</Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.stats.altitude, value: t.banner.altitudeValue, accent: true },
          { label: t.banner.stats.varieties, value: t.banner.varietiesValue },
          { label: t.banner.stats.lots, value: String(urraoLots.length) },
        ]}
      />

      <main id="main">
        {answer}
        <section className="grid gap-10 px-4 pb-2 pt-14 lg:grid-cols-2">
          <div>
            <SectionHeader title={t.facts.title} accent={t.facts.accent} text={t.facts.text} />
            <table className="mt-6 w-full border-collapse text-left">
              <caption className="sr-only">{t.facts.caption}</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">{t.facts.property}</th>
                  <th scope="col">{t.facts.value}</th>
                </tr>
              </thead>
              <tbody>
                {t.facts.rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className="w-2/5 py-3 pr-4 align-top font-sans text-body-sm font-semibold text-muted">{r.label}</th>
                    <td className="py-3 font-display text-headline-sm text-primary">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-body-sm text-muted">{t.facts.note}</p>
          </div>
          <div>
            <SectionHeader title={t.geography.title} accent={t.geography.accent} />
            <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-body-md text-body">
              {t.geography.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.varieties.title} accent={t.varieties.accent} />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {t.varieties.items.map((v) => (
              <li key={v.name} className="rounded-lg bg-surface p-xl">
                <h3 className="font-display text-headline-md text-primary">{v.name}</h3>
                <p className="mt-2 max-w-[48ch] text-body-md text-body">{v.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-body-sm text-muted">
            <Link className="font-label text-label-md text-primary underline underline-offset-4" href={articleHref(lang, "chiroso")}>
              {t.varieties.read}
            </Link>{" "}
            · {t.varieties.note}
          </p>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.calendar.title} accent={t.calendar.accent} text={t.calendar.text} />
          <div role="region" aria-label={t.calendar.caption} tabIndex={0} className="relative mt-8 overflow-x-auto rounded-lg bg-surface p-4 focus-visible:outline-3 focus-visible:outline-primary sm:p-6">
            <table className="w-full min-w-[640px] border-collapse text-center">
              <caption className="sr-only">{t.calendar.caption}</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-48 pb-3 text-left font-label text-label-caps uppercase text-muted">{t.calendar.season}</th>
                  {months.map((m) => (
                    <th key={m} scope="col" className="pb-3 font-label text-label-caps uppercase text-muted">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.calendar.rows.map((label, r) => (
                  <tr key={label} className="border-t border-line">
                    <th scope="row" className="py-3 pr-3 text-left font-sans text-body-md font-semibold text-primary">{label}</th>
                    {months.map((m, i) => {
                      const on = harvestCalendar[r].includes(i + 1);
                      return (
                        <td key={m} className="p-1">
                          <span className={on ? "block h-8 rounded-sm bg-primary" : "block h-8 rounded-sm bg-surface-sunken/60"}>
                            {on ? <span className="sr-only">{t.calendar.harvesting}</span> : null}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-body-sm text-muted">{t.calendar.note}</p>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader
            title={t.producers.title}
            accent={t.producers.accent}
            text={t.producers.text}
            action={
              <Button href={href(lang, "producers")} variant="secondary" size="md">
                {t.producers.all} <span aria-hidden="true">→</span>
              </Button>
            }
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {producers.map((p) => {
              const count = lotsByProducer(p.slug).length;
              return (
                <ProducerCard
                  key={p.slug}
                  name={p.name}
                  farm={p.farm}
                  town={p.town}
                  story={p.tagline[lang]}
                  trust={{ level: p.verification, label: card.badges[p.verification] }}
                  meta={`${fill(t.producers.altitudeLine, { altitude: formatNumber(lang, p.altitudeM), varieties: p.varieties.join(", ") })}${
                    count > 0 ? ` · ${plural(count, t.producers.lotCountOne, t.producers.lotCountOther)}` : ""
                  }`}
                  href={producerHref(lang, p.slug)}
                  ctaLabel={t.producers.viewProfile}
                />
              );
            })}
          </div>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader
            title={t.lots.title}
            accent={t.lots.accent}
            text={t.lots.text}
            action={
              <Button href={href(lang, "coffees")} variant="secondary" size="md">
                {t.lots.all} <span aria-hidden="true">→</span>
              </Button>
            }
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {urraoLots.slice(0, 3).map((lot) => (
              <LotCard
                key={lot.code}
                code={lot.code}
                image={lot.image}
                imageAlt={lot.imageAlt[lang]}
                trust={{ level: lot.verification, label: card.badges[lot.verification] }}
                score={lot.score !== null ? formatNumber(lang, lot.score, 1) : null}
                notCuppedLabel={card.notCupped}
                variety={lot.variety}
                processLabel={card.processes[lot.process]}
                producer={lot.producerName}
                producerInitials={lot.initials}
                farmLine={`${lot.farm} · ${lot.region}`}
                notes={lot.notes[lang]}
                notesLabel={card.notesLabel}
                specs={[
                  { label: card.altitude, value: `${formatNumber(lang, lot.altitudeM)} m` },
                  { label: card.available, value: `${formatNumber(lang, lot.availableKg)} kg` },
                  { label: card.harvest, value: lot.harvest[lang] },
                ]}
                price={lot.priceUsdPerKg !== null ? `USD ${formatNumber(lang, lot.priceUsdPerKg, 2)} / kg` : card.priceOnRequest}
                priceNote={lot.priceUsdPerKg !== null ? card.greenFob : card.sampleAvailable}
                ctaLabel={t.lots.viewLot}
                ctaHref={lotHref(lang, lot.code)}
                detailHref={lotHref(lang, lot.code)}
              />
            ))}
          </div>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.map.title} accent={t.map.accent} text={t.map.text} />
          <PlaceholderImage assetId="urrao-region-map" label={t.map.label} ratio="4 / 1" className="mt-8 min-h-[220px] [&_span]:text-ink" />
          <p className="mt-3 text-body-sm text-muted">{t.map.coords}</p>
        </section>

        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={t.cta.accent}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "samples") }}
          secondary={{ label: t.cta.secondary, href: articleHref(lang, "urrao") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
