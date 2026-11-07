import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { sampleLots, type SampleLot } from "@/data/sample-lots";
import { href, type RouteKey } from "@/lib/routes";
import beansPattern from "@/assets/home/coffee-beans-pattern.png";
import urraoSquare from "@/assets/home/urrao-main-square.jpg";

/* ---------- Shared pieces ---------- */

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: ReactNode;
  text: string;
}) {
  return (
    <div className="max-w-[760px]">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-green-600">{eyebrow}</p>
      <h2 className="mt-2.5 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.015em] text-green-900 sm:text-[56px]">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-normal text-sage sm:text-xl">{text}</p>
    </div>
  );
}

function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="9" ry="13" transform="rotate(35 16 16)" fill="#6FD13B" />
      <path d="M10 24 C 14 18, 18 14, 22 8" stroke="#0B3D2A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Featured lots ---------- */

const badgeTone: Record<SampleLot["verification"], string> = {
  coffeeVerified: "bg-brown text-white",
  farmVerified: "bg-green-900 text-white",
  registered: "bg-stone text-[#3B3B33]",
};

function LotCard({ lot, lang, l }: { lot: SampleLot; lang: Locale; l: Dictionary["lots"] }) {
  const n = (value: number, digits = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

  return (
    <article className="flex flex-col overflow-hidden rounded-[28px] bg-cream-100">
      <div className="relative h-60">
        <Image
          src={lot.image}
          alt={lot.imageAlt[lang]}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-[7px] text-xs font-semibold tracking-[0.08em] text-green-900">
          {lot.code}
        </span>
        <span className={`absolute right-4 top-4 rounded-full px-3 py-[7px] text-xs font-semibold ${badgeTone[lot.verification]}`}>
          {l.badges[lot.verification]}
        </span>
        {lot.score !== null ? (
          <span className="absolute bottom-4 left-4 inline-flex items-baseline gap-1.5 rounded-[14px] bg-green-900 px-3.5 py-2 text-white">
            <strong className="font-display text-2xl font-bold text-lime-500">{n(lot.score, 1)}</strong>
            <span className="text-xs font-semibold tracking-[0.06em]">SCA</span>
          </span>
        ) : (
          <span className="absolute bottom-4 left-4 rounded-[14px] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3B3B33]">
            {l.notCupped}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[18px] px-6 pb-[26px] pt-6">
        <div>
          <h3 className="font-display text-[28px] font-semibold leading-[1.15] text-green-900">
            {lot.variety} <span className="font-normal italic text-green-600">· {l.processes[lot.process]}</span>
          </h3>
          <div className="mt-3.5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 flex-none items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white"
            >
              {lot.initials}
            </span>
            <div>
              <p className="text-base font-semibold text-ink">{lot.producer}</p>
              <p className="mt-0.5 text-sm text-sage">{lot.farm} · Urrao, Antioquia</p>
            </div>
          </div>
        </div>

        <ul aria-label={l.notesLabel} className="flex flex-wrap gap-2">
          {lot.notes[lang].map((note) => (
            <li key={note} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-green-900">
              {note}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-3 gap-3 border-y border-[#E2E0D2] py-4">
          {[
            [l.altitude, `${n(lot.altitudeM)} m`],
            [l.available, `${n(lot.kg)} kg`],
            [l.harvest, "2026"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[13px] text-muted">{label}</dt>
              <dd className="mt-1 text-[17px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-[22px] font-semibold text-green-900">
              {lot.priceUsdPerKg !== null ? `USD ${n(lot.priceUsdPerKg, 2)} / kg` : l.priceOnRequest}
            </p>
            <p className="mt-0.5 text-[13px] text-muted">
              {lot.priceUsdPerKg !== null ? l.greenFob : l.sampleAvailable}
            </p>
          </div>
          <Link
            href={href(lang, "samples")}
            className="inline-flex min-h-[50px] items-center whitespace-nowrap rounded-full bg-lime-500 px-[22px] py-3.5 text-base font-semibold text-green-900 hover:brightness-95"
          >
            {l.requestSample}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FeaturedLots({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const l = dict.lots;
  return (
    <section className="px-4 pb-6 pt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-[720px]">
          <SectionHeader
            eyebrow={l.eyebrow}
            title={
              <>
                <span className="font-normal italic">{l.titleEm}</span> {l.titleRest}
              </>
            }
            text={l.text}
          />
        </div>
        <Link
          href={href(lang, "coffees")}
          className="inline-flex min-h-[60px] items-center gap-3 whitespace-nowrap rounded-full bg-green-900 px-8 py-[18px] text-lg font-semibold text-white hover:bg-green-700"
        >
          {l.exploreAll}
          <span aria-hidden="true" className="flex size-[30px] items-center justify-center rounded-full bg-lime-500 text-base text-green-900">
            →
          </span>
        </Link>
      </div>
      <p className="mt-3.5 text-[13px] text-muted">{l.note}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleLots.map((lot) => (
          <LotCard key={lot.code} lot={lot} lang={lang} l={l} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Story statement (coffee-bean pattern) ---------- */

export function Story({ dict }: { dict: Dictionary }) {
  const s = dict.story;
  return (
    <section
      className="mt-10 rounded-[32px] bg-cream-100 bg-repeat px-6 py-16 text-center sm:px-12 sm:py-[88px]"
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
    <section className="px-4 pb-6 pt-24">
      <SectionHeader
        eyebrow={f.eyebrow}
        title={
          <>
            {f.titleStart} <span className="font-normal italic">{f.titleEm}</span>
            {f.titleEnd ? ` ${f.titleEnd}` : ""}
          </>
        }
        text={f.text}
      />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
      <p className="mt-[18px] text-[13px] text-muted">{f.sources}</p>
    </section>
  );
}

/* ---------- Regions ---------- */

export function Regions({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const r = dict.regions;
  return (
    <section className="px-4 pb-6 pt-24">
      <SectionHeader
        eyebrow={r.eyebrow}
        title={
          <>
            <span className="font-normal italic">{r.titleEm}</span> {r.titleRest}
          </>
        }
        text={r.text}
      />

      <article className="mt-9 grid overflow-hidden rounded-[32px] bg-green-900 text-white lg:min-h-[520px] lg:grid-cols-2">
        <div className="relative min-h-[320px] sm:min-h-[420px]">
          <Image
            src={urraoSquare}
            alt={r.photoAlt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[center_35%]"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-green-900/80 px-3.5 py-2 text-[13px] font-semibold">
            {r.photoCaption}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-[22px] px-6 py-10 sm:px-12 sm:pb-11 sm:pt-12">
          <span className="self-start rounded-full bg-lime-500 px-3.5 py-[7px] text-[13px] font-semibold tracking-[0.04em] text-green-900">
            {r.nowSourcing}
          </span>
          <h3 className="font-display text-[40px] font-semibold leading-[1.05] sm:text-5xl">
            {r.town} <span className="font-normal italic">{r.department}</span>
          </h3>
          <p className="text-lg leading-relaxed text-mist">{r.description}</p>
          <dl className="grid grid-cols-1 gap-4 border-y border-mist/25 py-5 sm:grid-cols-3">
            {r.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[13px] text-[#9FC4AE]">{fact.label}</dt>
                <dd className="mt-1.5 font-display text-[22px] font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link
              href={href(lang, "urrao")}
              className="inline-flex min-h-14 items-center gap-3 rounded-full bg-lime-500 px-7 py-4 text-[17px] font-semibold text-green-900 hover:brightness-95"
            >
              {r.seeLots} <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={href(lang, "producers")}
              className="inline-flex min-h-14 items-center rounded-full border-[1.5px] border-[#9FC4AE] px-[26px] py-[15px] text-[17px] font-semibold hover:bg-white/10"
            >
              {r.meetProducers}
            </Link>
          </div>
        </div>
      </article>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-[26px] font-semibold text-green-900">{r.comingNext}</h3>
        <Link href={href(lang, "contact")} className="py-3 text-base font-semibold text-green-700 hover:underline">
          {r.notify} →
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {r.upcoming.map((region) => (
          <div key={region.name} className="flex min-h-[150px] flex-col gap-2.5 rounded-3xl bg-cream-100 p-6">
            <span className="self-start rounded-full bg-stone px-3 py-1.5 text-xs font-semibold text-[#3B3B33]">
              {r.comingSoon}
            </span>
            <span className="mt-auto font-display text-[26px] font-semibold text-green-900">{region.name}</span>
            <span className="text-[15px] text-sage">{region.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Closing call to action ---------- */

export function ClosingCta({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.closing;
  return (
    <section className="mt-16 rounded-[32px] bg-green-900 px-6 py-12 text-white sm:px-10 sm:py-14">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-lime-500">{c.eyebrow}</p>
      <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.1] sm:text-[44px]">
        <span className="font-normal italic">{c.titleEm}</span> {c.titleRest}
      </h2>
      <p className="mt-3.5 max-w-[520px] text-lg leading-normal text-mist">{c.text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={href(lang, "samples")}
          className="inline-flex min-h-[54px] items-center rounded-full bg-lime-500 px-7 py-4 text-base font-semibold text-green-900 hover:brightness-95"
        >
          {c.primary}
        </Link>
        <Link
          href={href(lang, "contact")}
          className="inline-flex min-h-[54px] items-center rounded-full border-[1.5px] border-[#9FC4AE] px-7 py-[15px] text-base font-semibold hover:bg-white/10"
        >
          {c.secondary}
        </Link>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

// Route for each footer link, in the same order as dict.footer.columns[].links
const FOOTER_ROUTES: RouteKey[][] = [
  ["coffees", "producers", "regions", "coffees"],
  ["forBuyers", "samples", "samples", "forBuyers"],
  ["forFarmers", "forFarmers", "forFarmers"],
  ["ourStory", "contact", "journal"],
];

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const f = dict.footer;
  const other: Locale = lang === "en" ? "es" : "en";

  return (
    <footer className="mt-16 overflow-hidden rounded-[32px] bg-green-900 px-6 pb-7 pt-14 text-white sm:px-12 sm:pt-16">
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
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-lime-500">{column.title}</h3>
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
          <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-lime-500">{f.contactTitle}</h3>
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
            className="mt-3.5 inline-flex min-h-12 items-center rounded-full border-[1.5px] border-[#9FC4AE] px-5 py-3 text-[15px] font-semibold hover:bg-white/10"
          >
            {f.contactCta}
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-mist/20 pt-6 text-sm text-[#9FC4AE]">
        <span>{f.rights}</span>
        <nav aria-label={f.legalLabel} className="flex flex-wrap items-center gap-6">
          <Link href={href(lang, "privacy")} className="py-2 hover:text-white">
            {f.privacy}
          </Link>
          <Link href={href(lang, "terms")} className="py-2 hover:text-white">
            {f.terms}
          </Link>
          {/* TODO: real social profile URLs */}
          <a href="#" className="py-2 hover:text-white">
            Instagram
          </a>
          <a href="#" className="py-2 hover:text-white">
            LinkedIn
          </a>
          <Link
            href={href(other, "home")}
            hrefLang={other}
            className="rounded-full border border-mist/35 px-3 py-1.5 font-semibold text-white"
          >
            EN · ES
          </Link>
        </nav>
      </div>
    </footer>
  );
}
