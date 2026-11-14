import { AnswerFirst } from "@/components/ai/answer-first";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { SiteFooter } from "@/components/home/sections";
import { LotsCatalog } from "@/components/lots/catalog";
import type { CatalogItem } from "@/components/lots/filters";
import { lotsJsonLd, lotsMetadata } from "@/components/lots/seo";
import { Chip, CtaPanel, LotCard, SubpageBanner } from "@/components/ui";
import { lots, type Lot } from "@/data/lots";
import { href, lotHref, producerHref } from "@/lib/routes";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/coffees">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { lotsPage } = await getDictionary();
  return lotsMetadata(lang, lotsPage.meta, cherries.src);
}

function toItem(lot: Lot, lang: Locale, t: Awaited<ReturnType<typeof getDictionary>>["lotsPage"]): CatalogItem {
  const n = (value: number, digits = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  const c = t.card;
  return {
    code: lot.code,
    variety: lot.variety,
    process: lot.process,
    altitudeM: lot.altitudeM,
    score: lot.score,
    availableKg: lot.availableKg,
    price: lot.priceUsdPerKg,
    order: Number(lot.code.split("-")[1]),
    card: (
      <LotCard
        code={lot.code}
        image={lot.image}
        imageAlt={lot.imageAlt[lang]}
        trust={{ level: lot.verification, label: c.badges[lot.verification] }}
        score={lot.score !== null ? n(lot.score, 1) : null}
        notCuppedLabel={c.notCupped}
        variety={lot.variety}
        processLabel={c.processes[lot.process]}
        producer={lot.producerName}
        producerInitials={lot.initials}
        farmLine={`${lot.farm} · ${lot.region}`}
        notes={lot.notes[lang]}
        notesLabel={c.notesLabel}
        specs={[
          { label: c.altitude, value: `${n(lot.altitudeM)} m` },
          { label: c.available, value: `${n(lot.availableKg)} kg` },
          { label: c.harvest, value: c.harvestValue },
        ]}
        price={lot.priceUsdPerKg !== null ? `USD ${n(lot.priceUsdPerKg, 2)} / kg` : c.priceOnRequest}
        priceNote={lot.priceUsdPerKg !== null ? c.greenFob : c.sampleAvailable}
        ctaLabel={c.viewLot}
        ctaHref={lotHref(lang, lot.code)}
        detailHref={lotHref(lang, lot.code)}
        producerHref={lot.producerSlug ? producerHref(lang, lot.producerSlug) : undefined}
      />
    ),
  };
}

export default async function CoffeesPage({ params }: PageProps<"/[lang]/coffees">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.lotsPage;
  const items = lots.map((lot) => toItem(lot, lang, t));
  const jsonLd = lotsJsonLd(lang, { homeLabel: t.breadcrumb.home, pageLabel: t.breadcrumb.current, lots });

  return (
    <div className="min-h-screen p-page-margin">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="coffees"
        line="green"
        breadcrumb={[{ label: t.breadcrumb.home, href: href(lang, "home") }, { label: t.breadcrumb.current }]}
        chips={t.banner.chips.map((label, i) => (
          <Chip key={label} tone={i === 0 ? "lime" : "white"} className={i === 0 ? undefined : "!bg-neutral/12 !text-on-primary"}>
            {label}
          </Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.lotsLabel, value: String(lots.length), accent: true },
          { label: t.banner.harvestLabel, value: t.banner.harvestValue },
          { label: t.banner.regionLabel, value: t.banner.regionValue },
        ]}
      />
      <main id="main">
        <AnswerFirst lang={lang} kind="lots" />
        <LotsCatalog items={items} t={t} />
        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={t.cta.accent}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "contact") }}
          secondary={{ label: t.cta.secondary, href: href(lang, "samples") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
