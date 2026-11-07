import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";

function SectionTitle({ em, rest, light = false }: { em: string; rest: string; light?: boolean }) {
  return (
    <h2
      className={`font-display text-[34px] font-semibold leading-[1.1] sm:text-[44px] ${
        light ? "text-white" : "text-green-900"
      }`}
    >
      <span className="font-normal italic">{em}</span> {rest}
    </h2>
  );
}

const badgeTone = {
  coffeeVerified: "bg-brown text-white",
  farmVerified: "bg-green-900 text-white",
  registered: "bg-stone text-[#3B3B33]",
} as const;

export function FeaturedLots({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const l = dict.lots;
  // Placeholder lots until real producers are onboarded (see the manifest: no fake data).
  const lots = (["coffeeVerified", "farmVerified", "registered"] as const).map((badge) => ({ badge }));
  const specs = [
    [l.altitude, "[masl]"],
    [l.available, "[kg]"],
    [l.harvest, "[year]"],
    [l.cupProfile, "[notes]"],
  ];

  return (
    <section className="px-4 pb-6 pt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle em={l.titleEm} rest={l.titleRest} />
        <Link href={href(lang, "coffees")} className="py-3 text-sm font-semibold text-green-700 hover:underline">
          {l.exploreAll} ↗
        </Link>
      </div>
      <p className="mt-2 text-[15px] text-sage">{l.note}</p>

      <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5">
        {lots.map(({ badge }) => (
          <article key={badge} className="flex flex-col overflow-hidden rounded-[28px] bg-cream-100">
            <div className="flex h-[200px] items-start justify-between bg-tan p-4">
              <span className="rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold tracking-[0.06em] text-green-900">
                {l.code}
              </span>
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${badgeTone[badge]}`}>
                {l.badges[badge]}
              </span>
            </div>
            <div className="flex flex-col gap-3.5 px-6 pb-[26px] pt-[22px]">
              <div>
                <h3 className="font-display text-2xl font-semibold text-green-900">{l.name}</h3>
                <p className="mt-1 text-sm text-sage">{l.farm}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="mt-0.5 font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={href(lang, "samples")}
                className="mt-1 rounded-full bg-green-900 px-5 py-3.5 text-center text-sm font-semibold text-white hover:bg-green-700"
              >
                {l.requestSample}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Story({ dict }: { dict: Dictionary }) {
  const s = dict.story;
  return (
    <section className="mt-10 rounded-[32px] bg-cream-100 px-6 py-16 text-center sm:px-12 sm:py-[88px]">
      <p className="mx-auto max-w-[980px] font-display text-[28px] leading-[1.25] text-green-900 sm:text-[44px]">
        <span className="italic text-green-700">{s.em1}</span> {s.mid}{" "}
        <span className="italic text-brown">{s.em2}</span> {s.end}
      </p>
    </section>
  );
}

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.how;
  return (
    <section className="px-4 pb-6 pt-[88px]">
      <SectionTitle em={h.titleEm} rest={h.titleRest} />
      <ol className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
        {h.steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-[28px] border-[1.5px] border-line p-[26px]">
            <span className="flex size-10 items-center justify-center rounded-full bg-brown font-semibold text-white">
              {i + 1}
            </span>
            <h3 className="font-display text-[22px] font-semibold text-green-900">{step.title}</h3>
            <p className="text-[15px] leading-normal text-sage">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const levelTone = ["bg-stone text-[#3B3B33]", "bg-lime-500 text-green-900", "bg-white text-green-900"];

export function Trust({ dict }: { dict: Dictionary }) {
  const t = dict.trust;
  return (
    <section className="mt-16 rounded-[32px] bg-green-900 px-6 py-14 text-white sm:px-10 sm:py-16">
      <SectionTitle em={t.titleEm} rest={t.titleRest} light />
      <p className="mt-3 max-w-[620px] text-[17px] leading-normal text-mist">{t.text}</p>
      <div className="mt-9 grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
        {t.levels.map((level, i) => (
          <div key={level.name} className="flex flex-col gap-2.5 rounded-3xl bg-green-700 p-[26px]">
            <span
              className={`self-start rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] ${levelTone[i]}`}
            >
              {level.name}
            </span>
            <p className="text-base leading-normal text-[#E8F1EB]">{level.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Regions({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const r = dict.regions;
  return (
    <section className="px-4 pb-6 pt-[88px]">
      <SectionTitle em={r.titleEm} rest={r.titleRest} />
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
        <Link
          href={href(lang, "urrao")}
          className="flex min-h-[260px] flex-col justify-end gap-1.5 rounded-[28px] bg-forest p-7 text-white sm:col-span-2"
        >
          <span className="self-start rounded-full bg-lime-500 px-3 py-1.5 text-xs font-semibold text-green-900">
            {r.nowSourcing}
          </span>
          <span className="font-display text-[34px] font-semibold">{r.urrao}</span>
          <span className="text-[15px] text-mist">{r.urraoText}</span>
        </Link>
        {r.upcoming.map((name) => (
          <div
            key={name}
            className="flex min-h-[260px] flex-col justify-end gap-1.5 rounded-[28px] bg-cream-100 p-7"
          >
            <span className="self-start rounded-full bg-stone px-3 py-1.5 text-xs font-semibold text-[#3B3B33]">
              {r.comingSoon}
            </span>
            <span className="font-display text-[28px] font-semibold text-green-900">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ClosingCta({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.closing;
  return (
    <section className="mt-16 flex flex-wrap items-center justify-between gap-8 rounded-[32px] bg-green-900 px-6 py-12 text-white sm:px-10 sm:py-14">
      <div className="flex-[1_1_420px]">
        <SectionTitle em={c.titleEm} rest={c.titleRest} light />
        <p className="mt-3.5 max-w-[520px] text-[17px] leading-normal text-mist">{c.text}</p>
        <div className="mt-[26px] flex flex-wrap gap-3">
          <Link
            href={href(lang, "samples")}
            className="rounded-full bg-lime-500 px-7 py-4 text-base font-semibold text-green-900 hover:brightness-95"
          >
            {c.primary}
          </Link>
          <Link
            href={href(lang, "contact")}
            className="rounded-full border-[1.5px] border-[#9FC4AE] px-7 py-[15px] text-base font-semibold hover:bg-white/10"
          >
            {c.secondary}
          </Link>
        </div>
      </div>
      {/* TODO: real photography of Urrao producers */}
      <div aria-hidden="true" className="min-h-[240px] flex-[1_1_320px] rounded-[28px] bg-forest" />
    </section>
  );
}

const FOOTER_LINKS = ["coffees", "producers", "forBuyers", "forFarmers", "contact"] as const;

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 px-4 pb-3 pt-7 text-sm text-sage">
      <span>{dict.footer.rights}</span>
      <nav aria-label={dict.nav.footerLabel} className="flex flex-wrap gap-5">
        {FOOTER_LINKS.map((key) => (
          <Link key={key} href={href(lang, key)} className="py-2.5 hover:text-green-900">
            {dict.nav[key]}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
