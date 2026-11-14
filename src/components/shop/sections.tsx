import Image from "next/image";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import mokaPot from "@/assets/home/moka-pot-sketch.png";
import { Bean } from "@/components/ui/bean";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { href } from "@/lib/routes";
import { whatsappLink } from "@/lib/site";

/** Same shape as the shared `button-shop-on-dark` and `button-shop` variants, for links that open WhatsApp. */
const externalBase =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-label font-medium transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-3";

/** Four promises in one crema strip (benefits row of the Shop board). */
export function Perks({ copy }: { copy: Dictionary["shopPage"] }) {
  return (
    <section className="mt-2 rounded-xl bg-roast-surface px-6 py-8 sm:px-12">
      <h2 className="sr-only">{copy.perksLabel}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-roast-line">
        {copy.perks.map((perk) => (
          <li key={perk.title} className="flex gap-3.5 lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <Bean size={28} className="mt-0.5" />
            <div>
              <h3 className="font-display text-headline-sm text-roast-dark">{perk.title}</h3>
              <p className="mt-1 text-body-sm text-roast-body">{perk.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Coffee club panel (brown, bean pattern) beside the "Not sure which to pick?" card. Both end on WhatsApp. */
export function ClubAndQuiz({ copy }: { copy: Dictionary["shopPage"] }) {
  const { club, quiz } = copy;
  return (
    <section className="mt-14 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="relative flex min-h-[360px] items-center overflow-hidden rounded-xl bg-roast px-6 py-12 text-on-primary sm:px-12">
        <div aria-hidden="true" className="shop-banner-pattern pointer-events-none absolute inset-0 max-sm:hidden" />
        <div className="relative isolate max-w-[540px]">
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-lg bg-roast-dark/90" />
          <p className="inline-flex flex-wrap items-center gap-2.5 font-label text-[13px] font-medium uppercase tracking-[0.08em] text-on-roast-body">
            <span className="rounded-full bg-caramel px-2.5 py-1 tracking-[0.04em] text-roast-dark">{club.badge}</span>
            {club.name}
          </p>
          <h2 className="mt-3 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.015em] sm:text-[48px]">
            {club.title} <span className="font-normal italic text-caramel">{club.accent}</span>
          </h2>
          <p className="mt-3.5 text-lg leading-normal text-on-roast-body">{club.text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={whatsappLink(club.message)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${externalBase} min-h-[54px] bg-caramel px-7 py-4 text-base text-roast-dark hover:brightness-95 focus-visible:outline-caramel`}
            >
              {club.cta}
            </a>
            <p className="text-[15px] text-on-roast-body">
              {club.from}{" "}
              <strong className="font-display text-2xl font-semibold text-on-primary">{club.price}</strong> {club.perMonth}
            </p>
          </div>
          <p className="mt-4 text-body-sm text-on-roast-body">{club.note}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3.5 rounded-xl bg-roast-card px-8 py-8 text-center text-roast-dark">
        <Image src={mokaPot} alt={quiz.imageAlt} sizes="150px" className="h-auto w-[150px]" />
        <h2 className="font-display text-[26px] font-semibold leading-tight">{quiz.title}</h2>
        <p className="max-w-[320px] text-body-md text-roast-body">{quiz.text}</p>
        <a
          href={whatsappLink(quiz.message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${externalBase} min-h-[52px] px-6 py-3.5 text-base text-roast ring-[1.5px] ring-inset ring-roast hover:bg-roast-surface focus-visible:outline-roast`}
        >
          {quiz.cta}
        </a>
      </div>
    </section>
  );
}

/** Three delivery steps on kraft tiles, plus delivery times by city. */
export function Delivery({ copy }: { copy: Dictionary["shopPage"] }) {
  const d = copy.delivery;
  return (
    <section className="mt-14 rounded-xl bg-roast-surface px-6 py-12 sm:px-12">
      <SectionHeader line="roasted" title={d.title} accent={d.accent} />
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {d.steps.map((step, i) => (
          <li key={step.title} className="rounded-lg bg-roast-card p-7">
            <span
              aria-hidden="true"
              className="inline-flex size-11 items-center justify-center rounded-full bg-roast font-display text-xl font-semibold text-on-primary"
            >
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-headline-md text-roast-dark">{step.title}</h3>
            <p className="mt-2 text-body-md text-roast-body">{step.text}</p>
          </li>
        ))}
      </ol>
      <h3 className="mt-8 font-display text-headline-sm text-roast-dark">{d.citiesTitle}</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {d.cities.map((c) => (
          <div key={c.city} className="rounded-md border border-roast-line bg-neutral px-4 py-3">
            <dt className="text-body-sm text-roast-body">{c.city}</dt>
            <dd className="font-display text-headline-sm text-roast-dark">{c.time}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-body-sm text-roast-body">
        {d.citiesNote} {d.legal}
      </p>
    </section>
  );
}

/** "Do you roast your own coffee?" band that leads to the producer sign-up. */
export function SellBand({ lang, copy }: { lang: Locale; copy: Dictionary["shopPage"] }) {
  const s = copy.sell;
  return (
    <section className="mt-12 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-xl bg-roast-dark px-6 py-11 text-on-primary sm:px-12">
      <div className="max-w-[680px]">
        <p className="font-label text-[13px] font-medium uppercase tracking-[0.08em] text-caramel">{s.eyebrow}</p>
        <h2 className="mt-2 font-display text-[32px] font-semibold leading-[1.1] sm:text-[40px]">
          {s.title} <span className="font-normal italic text-caramel">{s.accent}</span>
        </h2>
        <p className="mt-3 text-lg leading-normal text-on-roast-body">{s.text}</p>
      </div>
      <Button href={href(lang, "sellWithUs")} variant="shop-on-dark" size="lg">
        {s.cta} <span aria-hidden="true">→</span>
      </Button>
    </section>
  );
}
