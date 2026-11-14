import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { sampleLots, type SampleLot } from "@/data/sample-lots";
import { CtaPanel } from "@/components/ui/cta-panel";
import { LotCard } from "@/components/ui/lot-card";
import { SectionHeader } from "@/components/ui/section-header";
import { TrustBadge } from "@/components/ui/trust-badge";
import { getLot } from "@/data/lots";
import { href, lotHref, producerHref, type RouteKey } from "@/lib/routes";
import { site } from "@/lib/site";
import beansPattern from "@/assets/home/coffee-beans-pattern.png";
import urraoSquare from "@/assets/home/urrao-main-square.jpg";
import farmersHarvest from "@/assets/home/farmers-harvest.jpg";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";

/* ---------- Shared pieces ---------- */

function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="9" ry="13" transform="rotate(35 16 16)" fill="var(--accent)" />
      <path d="M10 24 C 14 18, 18 14, 22 8" stroke="var(--primary)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Our farmers ---------- */

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7.5l2.5 2.5L11 4.5" />
    </svg>
  );
}

export function Farmers({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const f = dict.farmers;
  return (
    <section className="px-4 pb-2 pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        <div>
          <SectionHeader size="xl" eyebrow={f.eyebrow} title={f.titleStart} accent={f.titleEm} text={f.text} />
          <ul className="mt-7 flex flex-col gap-[18px]">
            {f.points.map((point) => (
              <li key={point.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-7 flex-none items-center justify-center rounded-full bg-lime-500 text-green-900">
                  <CheckIcon />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold text-green-900">{point.title}</p>
                  <p className="mt-0.5 text-base leading-normal text-sage">{point.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href={href(lang, "producers")}
            className="mt-8 inline-flex min-h-14 items-center gap-3 rounded-full bg-green-900 px-7 py-4 text-[17px] font-label font-medium text-white hover:bg-green-700"
          >
            {f.cta}
            <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-lime-500 text-[15px] text-green-900">
              →
            </span>
          </Link>
        </div>
        <div className="relative h-[360px] overflow-hidden rounded-[32px] sm:h-[460px] lg:h-[560px]">
          <Image
            src={farmersHarvest}
            alt={f.imageAlt}
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-[40%_center]"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Featured lots ---------- */

const LEVELS: SampleLot["verification"][] = ["coffeeVerified", "farmVerified", "registered"];

export function FeaturedLots({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const l = dict.lots;
  const n = (value: number, digits = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  return (
    <section className="px-4 pb-2 pt-14">
      <SectionHeader
        size="xl"
        eyebrow={l.eyebrow}
        title={l.titleStart}
        accent={l.titleEm}
        text={l.text}
        action={
          <Link
            href={href(lang, "coffees")}
            className="inline-flex min-h-[60px] items-center gap-3 whitespace-nowrap rounded-full bg-green-900 px-8 py-[18px] text-lg font-label font-medium text-white hover:bg-green-700"
          >
            {l.exploreAll}
            <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-full bg-lime-500 text-base text-green-900">
              →
            </span>
          </Link>
        }
      />
      {/* What each trust badge means */}
      <ul className="mt-[18px] flex flex-wrap items-center gap-x-[18px] gap-y-2.5 text-sm text-sage">
        {LEVELS.map((level) => (
          <li key={level} className="inline-flex items-center gap-2">
            <TrustBadge level={level} label={l.badges[level]} size="sm" />
            {l.legend[level]}
          </li>
        ))}
      </ul>

      <Reveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleLots.map((lot) => {
          const fullLot = getLot(lot.code);
          return (
          <LotCard
            key={lot.code}
            code={lot.code}
            image={lot.image}
            imageAlt={lot.imageAlt[lang]}
            trust={{ level: lot.verification, label: l.badges[lot.verification] }}
            score={lot.score !== null ? n(lot.score, 1) : null}
            notCuppedLabel={l.notCupped}
            variety={lot.variety}
            processLabel={l.processes[lot.process]}
            producer={lot.producer}
            producerInitials={lot.initials}
            farmLine={`${lot.farm} · Urrao, Antioquia`}
            notes={lot.notes[lang]}
            notesLabel={l.notesLabel}
            specs={[
              { label: l.altitude, value: `${n(lot.altitudeM)} m` },
              { label: l.available, value: `${n(lot.kg)} kg` },
              { label: l.harvest, value: "2026" },
            ]}
            price={lot.priceUsdPerKg !== null ? `USD ${n(lot.priceUsdPerKg, 2)} / kg` : l.priceOnRequest}
            priceNote={lot.priceUsdPerKg !== null ? l.greenFob : l.sampleAvailable}
            ctaLabel={l.requestSample}
            ctaHref={`${href(lang, "samples")}?lot=${lot.code}`}
            detailHref={lotHref(lang, lot.code)}
            producerHref={fullLot?.producerSlug ? producerHref(lang, fullLot.producerSlug) : undefined}
          />
          );
        })}
      </Reveal>
      <p className="mt-[18px] text-[13px] text-muted">{l.note}</p>
    </section>
  );
}

/* ---------- Story statement (coffee-bean pattern) ---------- */

export function Story({ dict }: { dict: Dictionary }) {
  const s = dict.story;
  return (
    <section
      className="mt-8 rounded-[32px] bg-cream-100 bg-repeat px-6 py-14 text-center sm:px-12 sm:py-[72px]"
      style={{ backgroundImage: `url(${beansPattern.src})`, backgroundSize: "384px 384px", backgroundPosition: "center" }}
    >
      <p className="mx-auto max-w-[980px] font-display text-[28px] leading-[1.25] text-green-900 sm:text-[44px]">
        <span className="italic text-green-700">{s.em1}</span> {s.mid}{" "}
        <span className="italic text-brown">{s.em2}</span> {s.end}
      </p>
    </section>
  );
}

/* ---------- Colombian coffee in numbers ---------- */

export function Facts({ dict }: { dict: Dictionary }) {
  const f = dict.facts;
  return (
    <section className="px-4 pb-2 pt-14">
      <SectionHeader size="xl" eyebrow={f.eyebrow} title={f.titleStart} accent={f.titleEm} titleEnd={f.titleEnd || undefined} text={f.text} />
      <Reveal className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {f.items.map((item, i) => {
          const highlight = i === 0;
          return (
            <div
              key={item.label}
              className={`flex flex-col gap-2 rounded-[28px] px-[30px] pb-8 pt-[30px] ${highlight ? "bg-green-900" : "bg-cream-100"}`}
            >
              <span
                className={`font-display text-[44px] font-bold leading-none tracking-[-0.02em] sm:text-[52px] ${
                  highlight ? "text-lime-500" : "text-green-900"
                }`}
              >
                {item.value}
              </span>
              <span className={`font-display text-[22px] font-semibold ${highlight ? "text-white" : "text-green-900"}`}>
                {item.label}
              </span>
              <p className={`mt-1.5 text-base leading-[1.55] ${highlight ? "text-mist" : "text-sage"}`}>{item.text}</p>
            </div>
          );
        })}
      </Reveal>
      <p className="mt-[18px] text-[13px] text-muted">{f.sources}</p>
    </section>
  );
}

/* ---------- Regions (compact horizontal band) ---------- */

export function Regions({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const r = dict.regions;
  return (
    <section className="px-4 pb-2 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <p className="text-sm font-label font-medium uppercase tracking-[0.08em] text-green-600">{r.eyebrow}</p>
          <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.015em] text-green-900 sm:text-[44px]">
            <span className="font-normal italic">{r.titleEm}</span> {r.titleRest}
          </h2>
        </div>
        <p className="max-w-[520px] text-[17px] leading-normal text-sage">{r.text}</p>
      </div>

      <article className="mt-7 grid overflow-hidden rounded-[28px] bg-green-900 text-white lg:h-[280px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="relative h-56 lg:h-auto">
          <Image
            src={urraoSquare}
            alt={r.photoAlt}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 px-6 pt-7 sm:px-9 lg:py-8 lg:pl-9 lg:pr-8">
          <span className="self-start rounded-full bg-lime-500 px-3 py-1.5 text-xs font-label font-medium tracking-[0.04em] text-green-900">
            {r.nowSourcing}
          </span>
          <h3 className="font-display text-[34px] font-semibold leading-[1.05] sm:text-[38px]">
            {r.town} <span className="font-normal italic">{r.department}</span>
          </h3>
          <p className="text-base leading-[1.55] text-mist">{r.description}</p>
        </div>
        <div className="flex flex-col justify-center gap-[18px] px-6 pb-7 pt-5 sm:px-9 lg:border-l lg:border-mist/20 lg:py-8 lg:pl-7 lg:pr-9">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
            {r.facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-sage-mist">{fact.label}</dt>
                <dd className="font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={href(lang, "urrao")}
              className="inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-lime-500 px-[22px] py-3.5 text-base font-label font-medium text-green-900 hover:brightness-95"
            >
              {r.seeLots} <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={href(lang, "producers")}
              className="inline-flex min-h-[50px] items-center rounded-full border-[1.5px] border-sage-mist px-5 py-[13px] text-base font-label font-medium hover:bg-white/10"
            >
              {r.meetProducers}
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

/* ---------- For producers: two ways to sell ---------- */

export function ProducersBand({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const p = dict.producersBand;
  return (
    <section className="px-4 pb-2 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div>
          <p className="font-label text-sm font-medium uppercase tracking-[0.08em] text-green-600">{p.eyebrow}</p>
          <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.015em] text-green-900 sm:text-[44px]">
            {p.titleStart} <span className="font-normal italic">{p.titleEm}</span>
          </h2>
        </div>
        <p className="max-w-[480px] text-[17px] leading-normal text-sage">{p.text}</p>
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <article className="flex flex-col gap-3.5 rounded-[28px] bg-green-900 p-8 text-white">
          <span className="self-start rounded-full bg-lime-500 px-3 py-1.5 font-label text-xs font-medium text-green-900">
            {p.green.badge}
          </span>
          <h3 className="font-display text-[30px] font-semibold leading-[1.15]">{p.green.title}</h3>
          <p className="text-base leading-[1.55] text-mist">{p.green.text}</p>
          <Link
            href={href(lang, "producers")}
            className="mt-1.5 inline-flex min-h-[52px] items-center gap-2.5 self-start rounded-full bg-lime-500 px-6 py-[15px] font-label text-base font-medium text-green-900 hover:brightness-95"
          >
            {p.green.cta} <span aria-hidden="true">→</span>
          </Link>
        </article>
        <article className="flex flex-col gap-3.5 rounded-[28px] bg-roast-card p-8 text-roast-dark">
          <span className="self-start rounded-full bg-brown px-3 py-1.5 font-label text-xs font-medium text-white">
            {p.roasted.badge}
          </span>
          <h3 className="font-display text-[30px] font-semibold leading-[1.15]">{p.roasted.title}</h3>
          <p className="text-base leading-[1.55] text-roast-body">{p.roasted.text}</p>
          <Link
            href={href(lang, "sellWithUs")}
            className="mt-1.5 inline-flex min-h-[52px] items-center gap-2.5 self-start rounded-full bg-brown px-6 py-[15px] font-label text-base font-medium text-white hover:bg-roast-hover"
          >
            {p.roasted.cta} <span aria-hidden="true">→</span>
          </Link>
        </article>
      </div>
    </section>
  );
}

/* ---------- Closing call to action ---------- */

export function ClosingCta({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.closing;
  return (
    <CtaPanel
      eyebrow={c.eyebrow}
      title={c.titleStart}
      accent={c.titleEm}
      text={c.text}
      image={cherries}
      primary={{ label: c.primary, href: href(lang, "samples") }}
      secondary={{ label: c.secondary, href: href(lang, "contact") }}
    />
  );
}

/* ---------- Footer ---------- */

// Route for each footer link, in the same order as dict.footer.columns[].links
const FOOTER_ROUTES: RouteKey[][] = [
  ["coffees", "producers", "regions", "shop"],
  ["forBuyers", "samples", "samples", "forBuyers"],
  ["producers", "producers", "sellWithUs"],
  ["ourStory", "contact", "journal"],
];

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const f = dict.footer;
  const other: Locale = lang === "en" ? "es" : "en";

  return (
    <footer className="mt-6 overflow-hidden rounded-[32px] bg-green-900 px-6 pb-7 pt-14 text-white sm:px-12 sm:pt-16">
      <div className="border-b border-mist/20 pb-12">
        <div className="max-w-[560px]">
          <Link
            href={href(lang, "home")}
            className="inline-flex items-center gap-3.5 font-display text-2xl font-semibold sm:text-[30px]"
          >
            <LogoMark />
            Colombian Coffee Origins
          </Link>
          <p className="mt-[18px] text-lg leading-relaxed text-mist">{f.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.2fr)]">
        {f.columns.map((column, ci) => (
          <nav key={column.title} aria-label={column.title} className="min-w-0">
            <h3 className="mb-3 text-[13px] font-label font-medium uppercase tracking-[0.08em] text-lime-500">{column.title}</h3>
            <ul className="flex flex-col gap-1">
              {column.links.map((label, li) => (
                <li key={label}>
                  <Link
                    href={href(lang, FOOTER_ROUTES[ci]?.[li] ?? "home")}
                    className="inline-block py-1.5 text-base text-mist hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h3 className="mb-3 text-[13px] font-label font-medium uppercase tracking-[0.08em] text-lime-500">{f.contactTitle}</h3>
          <p className="text-base leading-[1.7] text-mist">
            {f.location}
            <br />
            {f.country}
          </p>
          {/* TODO: real contact email */}
          <Link href={href(lang, "contact")} className="mt-2.5 inline-block py-1 text-base font-semibold">
            {f.email}
          </Link>
          <br />
          <Link
            href={href(lang, "samples")}
            className="mt-3.5 inline-flex min-h-12 items-center rounded-full border-[1.5px] border-sage-mist px-5 py-3 text-[15px] font-label font-medium hover:bg-white/10"
          >
            {f.contactCta}
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mist/20 pt-6 text-sm text-sage-mist">
        <span>{f.rights}</span>
        <nav aria-label={f.legalLabel} className="flex flex-wrap items-center gap-6">
          <Link href={href(lang, "privacy")} className="py-2 hover:text-white">
            {f.privacy}
          </Link>
          <Link href={href(lang, "terms")} className="py-2 hover:text-white">
            {f.terms}
          </Link>
          {site.social.instagram ? (
            <a href={site.social.instagram} className="py-2 hover:text-white">
              Instagram
            </a>
          ) : null}
          {site.social.linkedin ? (
            <a href={site.social.linkedin} className="py-2 hover:text-white">
              LinkedIn
            </a>
          ) : null}
          <Link
            href={href(other, "home")}
            hrefLang={other}
            className="rounded-full border border-mist/35 px-3 py-1.5 font-label font-medium text-white"
          >
            EN · ES
          </Link>
        </nav>
      </div>
    </footer>
  );
}
