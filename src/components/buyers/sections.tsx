import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SectionHeader, TrustBadge } from "@/components/ui";
import type { TrustLevel } from "@/components/ui";
import type { Lot } from "@/data/lots";
import type { FaqItem } from "./seo";

type T = Dictionary["buyersPage"];

export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

const section = "mt-section-gap";
const focus = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary";

/** Sourcing steps: a numbered list, because the order is the content. */
export function Steps({ t }: { t: T["steps"] }) {
  return (
    <section aria-label={`${t.title} ${t.accent}`} className={`${section} grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
      <SectionHeader title={t.title} accent={t.accent} text={t.text} className="lg:sticky lg:top-8 lg:self-start" />
      <ol className="border-t border-line">
        {t.items.map((item, i) => (
          <li key={item.title} className="grid grid-cols-[48px_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[72px_1fr]">
            <span aria-hidden="true" className="font-display text-[40px] font-semibold leading-none text-success sm:text-[48px]">
              {i + 1}
            </span>
            <div>
              <h3 className="font-display text-headline-sm text-primary">{item.title}</h3>
              <p className="mt-2 max-w-[60ch] text-body-lg text-body">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Trust levels on a parchment panel, separated by hairlines instead of nested cards. */
export function TrustLevels({ t }: { t: T["trust"] }) {
  return (
    <section aria-label={`${t.title} ${t.accent}`} className={`${section} rounded-xl bg-surface px-6 py-12 sm:px-12`}>
      <SectionHeader title={t.title} accent={t.accent} text={t.text} />
      <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
        {t.items.map((item, i) => (
          <li key={item.level} className={`md:px-8 ${i === 0 ? "md:pl-0" : "md:border-l md:border-line"} ${i === 2 ? "md:pr-0" : ""}`}>
            <TrustBadge level={item.level as TrustLevel} label={item.label} />
            <p className="mt-4 max-w-[48ch] text-body-lg text-body">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Pricing({ t, lang, lots }: { t: T["pricing"]; lang: Locale; lots: readonly Lot[] }) {
  const n = (v: number, d = 0) =>
    new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const prices = lots.flatMap((l) => (l.priceUsdPerKg !== null ? [l.priceUsdPerKg] : []));
  const vars = {
    kg: Math.min(...lots.map((l) => l.minOrderKg)),
    g: 200,
    min: n(Math.min(...prices), 2),
    max: n(Math.max(...prices), 2),
    n: lots.length - prices.length,
    total: lots.length,
  };
  return (
    <section aria-label={`${t.title} ${t.accent}`} className={`${section} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
      <div>
        <SectionHeader title={t.title} accent={t.accent} text={t.text} />
        <h3 className="mt-10 font-display text-headline-sm text-primary">{t.fobTitle}</h3>
        <p className="mt-2 max-w-[60ch] text-body-lg text-body">{t.fobText}</p>
      </div>
      <div>
        <dl className="border-t border-line">
          {t.rows.map((row) => (
            <div key={row.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[2fr_3fr] sm:gap-6">
              <dt className="text-body-sm text-muted">{row.label}</dt>
              <dd className="font-label text-base font-medium text-primary">{fill(row.value, vars)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-body-sm text-muted">{t.exampleNote}</p>
      </div>
    </section>
  );
}

export function Logistics({ t }: { t: T["logistics"] }) {
  return (
    <section aria-label={`${t.title} ${t.accent}`} className={`${section} rounded-xl bg-primary px-6 py-12 text-on-primary sm:px-12`}>
      <h2 className="max-w-[760px] font-display text-headline-lg">
        {t.title} <span className="font-normal italic text-accent">{t.accent}</span>
      </h2>
      <p className="mt-4 max-w-[640px] text-body-lg text-on-primary-body">{t.text}</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {t.items.map((item) => (
          <li key={item.title} className="rounded-md bg-primary-raised p-6">
            <h3 className="font-display text-headline-sm">{item.title}</h3>
            <p className="mt-2 text-body-lg text-on-primary-body">{item.text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-body-sm text-on-primary-muted">{t.note}</p>
    </section>
  );
}

/** Accessible FAQ with native disclosure elements; the same items feed the FAQPage JSON-LD. */
export function Faq({ t, items }: { t: T["faq"]; items: readonly FaqItem[] }) {
  return (
    <section aria-label={`${t.title} ${t.accent}`} className={`${section} grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
      <SectionHeader title={t.title} accent={t.accent} text={t.text} className="lg:sticky lg:top-8 lg:self-start" />
      <div className="border-t border-line" data-testid="faq-list">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary
              className={`flex min-h-tap-target cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-headline-sm text-primary [&::-webkit-details-marker]:hidden ${focus}`}
            >
              <h3 className="font-[inherit] text-[length:inherit] leading-[inherit]">{item.q}</h3>
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-sunken text-xl leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-[62ch] pb-6 text-body-lg text-body">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

