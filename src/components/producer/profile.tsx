import Image from "next/image";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import farmersHarvest from "@/assets/home/farmers-harvest.jpg";
import heroHills from "@/assets/home/hero-coffee-hills.jpg";
import urraoSquare from "@/assets/home/urrao-main-square.jpg";
import { SiteFooter } from "@/components/home/sections";
import { OnlyInCountry } from "@/components/only-in-country";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CtaPanel } from "@/components/ui/cta-panel";
import { LotCard } from "@/components/ui/lot-card";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SubpageBanner } from "@/components/ui/subpage-banner";
import { TrustBadge } from "@/components/ui/trust-badge";
import { lotsByProducer, type Lot } from "@/data/lots";
import type { Producer } from "@/data/producers";
import { pricePerKgCop, productsByProducer, roastLabels, tagLabels, defaultSize } from "@/data/products";
import { href, lotHref, productHref } from "@/lib/routes";
import { fill, formatCop, formatNumber, plural, splitName } from "./format";

const navLink =
  "inline-flex min-h-tap-target items-center gap-2 whitespace-nowrap rounded-full border px-[18px] py-2.5 font-label text-label-md transition-colors";

function NavCount({ tone, children }: { tone: "lime" | "roast"; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${tone === "lime" ? "bg-accent text-on-accent" : "bg-roast text-on-primary"}`}
    >
      {children}
    </span>
  );
}

/** Producer profile (Producer board): banner, in-page nav, story, green lots, roasted panel (CO), farm, CTA. */
export function Profile({ lang, dict, producer }: { lang: Locale; dict: Dictionary; producer: Producer }) {
  const t = dict.producerPage;
  const l = dict.lots;
  const lots = lotsByProducer(producer.slug);
  const products = productsByProducer(producer.slug);
  const [givenNames, surname] = splitName(producer.name);
  const processes = [...new Set(lots.map((lot) => l.processes[lot.process]))];

  return (
    <div className="min-h-screen p-2">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="producers"
        line="green"
        breadcrumb={[
          { label: dict.nav.home, href: href(lang, "home") },
          { label: dict.producersPage.breadcrumbList, href: href(lang, "producers") },
          { label: producer.name },
        ]}
        backLink={{ label: t.banner.allProducers, href: href(lang, "producers") }}
        chips={
          <>
            <TrustBadge level={producer.verification} label={l.badges[producer.verification]} />
            <Chip tone="lime">{t.banner.greenCoffee}</Chip>
            {products.length > 0 ? <Chip tone="co">{t.banner.roastedCoffee}</Chip> : null}
          </>
        }
        title={givenNames}
        accent={surname}
        description={`${fill(t.banner.descriptionPrefix, { farm: producer.farm, town: producer.town })} ${producer.tagline[lang]}`}
        stats={[
          { label: t.banner.stats.altitude, value: `${formatNumber(lang, producer.altitudeM)} m` },
          { label: t.banner.stats.greenLots, value: String(lots.length), accent: true },
          { label: t.banner.stats.roasted, value: plural(products.length, t.banner.bagOne, t.banner.bagOther) },
        ]}
      />

      <main id="main">
        {/* Jump links. The roasted link only exists where the roasted panel does (Colombia). */}
        <nav
          aria-label={t.nav.label}
          className="sticky top-4 z-10 mt-4 flex gap-2 overflow-x-auto rounded-lg bg-surface p-3 sm:flex-wrap sm:overflow-visible"
        >
          <a href="#story" className={`${navLink} border-line bg-neutral text-primary hover:bg-primary hover:text-on-primary`}>
            {t.nav.story}
          </a>
          <a href="#lots" className={`${navLink} border-line bg-neutral text-primary hover:bg-primary hover:text-on-primary`}>
            {t.nav.lots} <NavCount tone="lime">{lots.length}</NavCount>
          </a>
          {products.length > 0 ? (
            <OnlyInCountry country="CO">
              <a href="#roasted" className={`${navLink} border-roast-line bg-neutral text-roast-dark hover:bg-roast-surface`}>
                {t.nav.roasted} <NavCount tone="roast">{products.length}</NavCount>
              </a>
            </OnlyInCountry>
          ) : null}
          <a href="#farm" className={`${navLink} border-line bg-neutral text-primary hover:bg-primary hover:text-on-primary`}>
            {t.nav.farm}
          </a>
        </nav>

        <Story lang={lang} dict={dict} producer={producer} processes={processes} />
        <GreenLots lang={lang} dict={dict} lots={lots} />
        {products.length > 0 ? (
          <OnlyInCountry country="CO">
            <Roasted lang={lang} dict={dict} producer={producer} />
          </OnlyInCountry>
        ) : null}
        <Farm dict={dict} producer={producer} />

        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={fill(t.cta.accent, { farm: producer.farm })}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "samples") }}
          secondary={{ label: t.cta.secondary, href: href(lang, "contact") }}
        />
      </main>

      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}

function Story({
  lang,
  dict,
  producer,
  processes,
}: {
  lang: Locale;
  dict: Dictionary;
  producer: Producer;
  processes: string[];
}) {
  const t = dict.producerPage.story;
  const facts = [
    { label: t.facts.varieties, value: producer.varieties.join(", ") },
    { label: t.facts.processes, value: processes.length ? processes.join(", ") : t.facts.none },
    { label: t.facts.since, value: producer.coffeeSince === null ? t.facts.yearPlaceholder : String(producer.coffeeSince) },
  ];
  return (
    <section id="story" className="scroll-mt-24 px-4 pb-2 pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="relative h-[360px] overflow-hidden rounded-xl sm:h-[460px] lg:h-[520px]">
          <Image
            src={farmersHarvest}
            alt={t.imageAlt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[40%_center]"
          />
        </div>
        <div>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} accent={t.accent} />
          <p className="mt-5 max-w-[65ch] text-lg leading-[1.6] text-body">{producer.story[lang]}</p>
          <blockquote className="mt-6 rounded-lg bg-surface px-[26px] py-[22px]">
            <p className="font-display text-2xl italic leading-[1.35] text-primary">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-2.5 text-[15px] text-muted">{producer.name}</footer>
          </blockquote>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-md bg-surface px-4 py-3.5">
                <dt className="text-[13px] text-muted">{fact.label}</dt>
                <dd className="mt-1 text-[17px] font-semibold text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function GreenLots({ lang, dict, lots }: { lang: Locale; dict: Dictionary; lots: Lot[] }) {
  const t = dict.producerPage.lots;
  const l = dict.lots;
  return (
    <section id="lots" className="scroll-mt-24 px-4 pb-2 pt-14">
      <SectionHeader
        eyebrow={t.eyebrow}
        title={t.title}
        accent={t.accent}
        action={
          <Button href={href(lang, "coffees")} variant="secondary" size="md">
            {t.all} <span aria-hidden="true">→</span>
          </Button>
        }
      />
      {lots.length > 0 ? (
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          {lots.map((lot) => (
            <LotCard
              key={lot.code}
              code={lot.code}
              image={lot.image}
              imageAlt={lot.imageAlt[lang]}
              trust={{ level: lot.verification, label: l.badges[lot.verification] }}
              score={lot.score !== null ? formatNumber(lang, lot.score, 1) : null}
              notCuppedLabel={l.notCupped}
              variety={lot.variety}
              processLabel={l.processes[lot.process]}
              producer={lot.producerName}
              producerInitials={lot.initials}
              farmLine={`${lot.farm} · ${lot.region}`}
              notes={lot.notes[lang]}
              notesLabel={l.notesLabel}
              specs={[
                { label: l.altitude, value: `${formatNumber(lang, lot.altitudeM)} m` },
                { label: l.available, value: `${formatNumber(lang, lot.availableKg)} kg` },
                { label: l.harvest, value: lot.harvest[lang] },
              ]}
              price={lot.priceUsdPerKg !== null ? `USD ${formatNumber(lang, lot.priceUsdPerKg, 2)} / kg` : l.priceOnRequest}
              priceNote={lot.priceUsdPerKg !== null ? l.greenFob : l.sampleAvailable}
              ctaLabel={t.viewLot}
              ctaHref={lotHref(lang, lot.code)}
              detailHref={lotHref(lang, lot.code)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-7 max-w-[65ch] rounded-lg bg-surface p-6 text-body-md text-body">{t.empty}</p>
      )}
      <p className="mt-[18px] text-[13px] text-muted">{t.note}</p>
    </section>
  );
}

function Roasted({ lang, dict, producer }: { lang: Locale; dict: Dictionary; producer: Producer }) {
  const t = dict.producerPage.roasted;
  const products = productsByProducer(producer.slug);
  const brand = products[0]?.brand ?? producer.farm;
  return (
    <section id="roasted" className="mt-14 scroll-mt-24 rounded-xl bg-roast-surface px-6 py-12 sm:px-12">
      <SectionHeader
        line="roasted"
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-2.5">
            {t.eyebrow}
            <span className="rounded-full border border-roast-line bg-neutral px-2.5 py-1 font-label text-xs normal-case tracking-normal text-roast-dark">
              {t.ships}
            </span>
          </span>
        }
        title={fill(t.title, { brand })}
        accent={t.accent}
        action={
          <Button href={href(lang, "shop")} variant="shop" size="md">
            {t.visitShop} <span aria-hidden="true">→</span>
          </Button>
        }
      />
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const size = defaultSize(p);
          const grams = `${formatNumber(lang, size.grams)} g`;
          const link = productHref(lang, p.slug);
          return (
            <ProductCard
              key={p.slug}
              brand={p.brand}
              name={p.name[lang]}
              meta={`Urrao · ${t.grind} · ${grams}`}
              notes={p.notes[lang]}
              tag={{ label: tagLabels[p.tag][lang], className: "bg-roast text-on-primary" }}
              bag={{ color: p.bag, stage: p.stage, label: p.labelBrand, roastLabel: roastLabels[p.roastLevel][lang], size: grams }}
              roast={{ level: p.roastLevel, label: roastLabels[p.roastLevel][lang] }}
              price={formatCop(size.priceCop, lang)}
              pricePerKg={`${formatCop(pricePerKgCop(size), lang)} / kg`}
              href={link}
              addLabel={t.viewCoffee}
              addHref={link}
            />
          );
        })}
      </div>
    </section>
  );
}

function Farm({ dict, producer }: { dict: Dictionary; producer: Producer }) {
  const t = dict.producerPage.farm;
  const tile = "overflow-hidden rounded-notch";
  // "Finca El Mirador" -> "Finca" + italic "El Mirador"
  const [farmTitle, ...rest] = producer.farm.split(" ");
  const farmAccent = rest.join(" ") || undefined;
  return (
    <section id="farm" className="scroll-mt-24 px-4 pb-2 pt-14">
      <SectionHeader eyebrow={t.eyebrow} title={farmTitle} accent={farmAccent} />
      <p className="mt-3 text-body-md text-muted">{t.location}</p>
      <div className="mt-6 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className={`${tile} relative sm:col-span-2 lg:col-span-1 lg:row-span-2`}>
          <Image src={heroHills} alt={t.altHills} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className={`${tile} relative`}>
          <Image src={cherries} alt={t.altCherries} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
        </div>
        <div className={`${tile} relative`}>
          <Image src={urraoSquare} alt={t.altSquare} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover object-[center_40%]" />
        </div>
        <PlaceholderImage
          assetId={`farm-drying-beds-${producer.slug}`}
          label={t.dryingLabel}
          ratio="auto"
          className="h-full rounded-notch"
        />
        <PlaceholderImage
          assetId={`farm-map-${producer.slug}`}
          label={t.mapLabel}
          ratio="auto"
          className="h-full rounded-notch"
        />
      </div>
      <p className="mt-[18px] text-[13px] text-muted">{t.note}</p>
    </section>
  );
}
