import { AnswerFirst } from "@/components/ai/answer-first";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales, type Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { DecisionPanel } from "@/components/lot/decision-panel";
import { fmt, harvestYear, list, num, score } from "@/components/lot/format";
import { LotGallery, type GallerySlide } from "@/components/lot/gallery";
import { lotJsonLd, lotMetadata } from "@/components/lot/seo";
import { CheckedAndBuying, MoreLots, ProducerBlock, SpecsAndCup } from "@/components/lot/lot-sections";
import { Chip } from "@/components/ui/chip";
import { CtaPanel } from "@/components/ui/cta-panel";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { SubpageBanner } from "@/components/ui/subpage-banner";
import { TrustBadge } from "@/components/ui/trust-badge";
import { getLot, lotParams, type Lot } from "@/data/lots";
import { href } from "@/lib/routes";
import { JsonLd } from "@/lib/seo/jsonld";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";

export function generateStaticParams() {
  return locales.flatMap((lang) => lotParams().map(({ code }) => ({ lang, code })));
}

function describe(lang: Locale, dict: Awaited<ReturnType<typeof getDictionary>>, lot: Lot) {
  const m = dict.lotPage.meta;
  const process = dict.lots.processes[lot.process];
  const priceBit =
    lot.priceUsdPerKg !== null ? fmt(m.priceFob, { price: num(lang, lot.priceUsdPerKg, 2) }) : m.priceRequest;
  return {
    process,
    title: fmt(m.title, { variety: lot.variety, process, code: lot.code }),
    description: fmt(m.description, {
      variety: lot.variety,
      process,
      scoreBit: lot.score !== null ? fmt(m.scoreBit, { score: score(lang, lot.score) }) : "",
      altitude: num(lang, lot.altitudeM),
      farm: lot.farm,
      priceBit,
      minKg: lot.minOrderKg,
    }),
  };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/coffees/[code]">): Promise<Metadata> {
  const { lang, code } = await params;
  const lot = getLot(code);
  if (!hasLocale(lang) || !lot) notFound();
  const dict = await getDictionary();
  const { title, description } = describe(lang, dict, lot);
  return lotMetadata(lang, lot, { title, description });
}

export default async function LotPage({ params }: PageProps<"/[lang]/coffees/[code]">) {
  const { lang, code } = await params;
  const lot = getLot(code);
  if (!hasLocale(lang) || !lot) notFound();
  const dict = await getDictionary();
  const t = dict.lotPage;
  const { process, description: metaDescription } = describe(lang, dict, lot);
  const variety = lot.variety;
  const notes = list(lang, lot.notes[lang].map((n, i) => (i === 0 ? n : n.toLowerCase())));

  const slides: GallerySlide[] = [
    {
      caption: t.gallery.captions[0],
      main: (
        <Image
          src={lot.image}
          alt={lot.imageAlt[lang]}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
      ),
      thumb: <Image src={lot.image} alt="" fill sizes="160px" className="object-cover" />,
    },
    ...[1, 2, 3].map((i) => ({
      caption: t.gallery.captions[i],
      main: (
        <PlaceholderImage
          assetId={`lot-${lot.slug}-gallery-${i + 1}`}
          label={t.gallery.placeholderLabels[i - 1]}
          ratio="auto"
          className="h-full rounded-none"
        />
      ),
      thumb: (
        <span aria-hidden="true" className="flex h-full w-full items-center justify-center bg-placeholder px-1 text-center font-label text-xs text-ink">
          {t.gallery.captions[i]}
        </span>
      ),
    })),
  ];

  return (
    <div className="min-h-screen p-2">
      <JsonLd
        data={lotJsonLd(lang, lot, {
          name: `${variety} ${process}`,
          description: metaDescription,
          processLabel: process,
          breadcrumb: { homeLabel: dict.nav.home, lotsLabel: t.banner.breadcrumbLots, regionLabel: t.banner.region },
        })}
      />
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="coffees"
        line="green"
        breadcrumb={[
          { label: dict.nav.home, href: href(lang, "home") },
          { label: t.banner.breadcrumbLots, href: href(lang, "coffees") },
          { label: t.banner.region, href: href(lang, "urrao") },
          { label: lot.code },
        ]}
        backLink={{ label: t.banner.allLots, href: href(lang, "coffees") }}
        chips={
          <>
            <Chip tone="white" className="uppercase tracking-[0.08em]">
              {fmt(t.banner.lotLabel, { code: lot.code })}
            </Chip>
            <TrustBadge level={lot.verification} label={dict.lots.badges[lot.verification]} />
            <span className="inline-flex items-center rounded-full bg-neutral/12 px-3 py-[7px] font-label text-xs font-medium text-on-primary">
              {t.banner.available}
            </span>
          </>
        }
        title={variety}
        accent={`· ${process}`}
        description={fmt(t.banner.description, {
          producer: lot.producerName,
          farm: lot.farm,
          region: lot.region,
          notes,
        })}
        stats={[
          { label: t.banner.scoreLabel, value: lot.score !== null ? score(lang, lot.score) : t.banner.scorePending, accent: true },
          { label: t.banner.altitudeLabel, value: `${num(lang, lot.altitudeM)} m` },
          { label: t.banner.harvestLabel, value: harvestYear(lot.harvest[lang]) },
        ]}
      />

      <main id="main">
        <AnswerFirst lang={lang} kind="lot" id={lot.code} />
        <section className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <LotGallery
            slides={slides}
            vtName={`lot-${lot.slug}`}
            label={t.gallery.label}
            counterTemplate={t.gallery.counter}
            thumbTemplate={t.gallery.thumb}
          />
          <DecisionPanel lang={lang} dict={dict} lot={lot} processLabel={process} />
        </section>

        <SpecsAndCup lang={lang} dict={dict} lot={lot} />
        <ProducerBlock lang={lang} dict={dict} lot={lot} />
        <CheckedAndBuying lang={lang} dict={dict} lot={lot} />
        <MoreLots lang={lang} dict={dict} lot={lot} />

        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={t.cta.accent}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "contact") }}
          secondary={{ label: t.cta.secondary, href: href(lang, "forBuyers") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
