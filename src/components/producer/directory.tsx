import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { ProducersBand, SiteFooter } from "@/components/home/sections";
import { Chip } from "@/components/ui/chip";
import { ProducerCard } from "@/components/ui/producer-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SubpageBanner } from "@/components/ui/subpage-banner";
import { producers } from "@/data/producers";
import { lotsByProducer } from "@/data/lots";
import { href, producerHref } from "@/lib/routes";
import { fill, formatNumber, plural } from "./format";

/** /producers: banner, grid of producer cards, "Are you a producer?" band, footer. */
export function Directory({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.producersPage;
  const altitudes = producers.map((p) => p.altitudeM);
  const range = `${formatNumber(lang, Math.min(...altitudes))}–${formatNumber(lang, Math.max(...altitudes))} m`;

  return (
    <div className="min-h-screen p-2">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="producers"
        line="green"
        breadcrumb={[
          { label: dict.nav.home, href: href(lang, "home") },
          { label: t.breadcrumbList },
        ]}
        chips={t.banner.chips.map((chip, i) => (
          <Chip key={chip} tone={i === 0 ? "lime" : "white"}>
            {chip}
          </Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.stats.producers, value: String(producers.length), accent: true },
          { label: t.banner.stats.region, value: t.banner.regionValue },
          { label: t.banner.stats.altitude, value: range },
        ]}
      />

      <main id="main">
        <section className="px-4 pb-2 pt-14">
          <SectionHeader eyebrow={t.list.eyebrow} title={t.list.title} accent={t.list.accent} text={t.list.text} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {producers.map((p) => {
              const lotCount = lotsByProducer(p.slug).length;
              return (
                <ProducerCard
                  key={p.slug}
                  name={p.name}
                  farm={p.farm}
                  town={p.town}
                  story={p.tagline[lang]}
                  trust={{ level: p.verification, label: dict.lots.badges[p.verification] }}
                  meta={
                    <span className="flex flex-col gap-3">
                      <span>
                        {fill(t.list.altitudeLine, { altitude: formatNumber(lang, p.altitudeM), varieties: p.varieties.join(", ") })}
                        {lotCount > 0 ? ` · ${plural(lotCount, t.list.lotCountOne, t.list.lotCountOther)}` : ""}
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <Chip tone="lime" size="sm">
                          {t.list.greenCoffee}
                        </Chip>
                        {p.brandSlug ? (
                          <Chip tone="co" size="sm">
                            {t.list.roastedCoffee}
                          </Chip>
                        ) : null}
                      </span>
                    </span>
                  }
                  href={producerHref(lang, p.slug)}
                  ctaLabel={`${t.list.viewProfile}`}
                />
              );
            })}
          </div>
          <p className="mt-[18px] text-[13px] text-muted">{t.list.note}</p>
        </section>

        <ProducersBand lang={lang} dict={dict} />
      </main>

      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
