import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "@/components/ui/trust-badge";
import type { Lot } from "@/data/lots";
import { href } from "@/lib/routes";
import { fmt, num, score } from "./format";
import { SaveLotButton } from "./save-button";

/** Sticky buying panel: price (USD per kg FOB or "price on request"), minimum order, free sample, actions. */
export function DecisionPanel({ lang, dict, lot, processLabel }: { lang: Locale; dict: Dictionary; lot: Lot; processLabel: string }) {
  const p = dict.lotPage.panel;
  const sampleHref = `${href(lang, "samples")}?lot=${lot.code}`;
  const askHref = `${href(lang, "contact")}?lot=${lot.code}`;
  const title = lot.name[lang].split(" · ")[0];

  return (
    <aside aria-label={p.label} className="flex flex-col gap-5 rounded-xl bg-surface p-6 sm:p-8 lg:sticky lg:top-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-neutral px-3 py-[7px] font-label text-label-caps uppercase text-primary">{lot.code}</span>
        <TrustBadge level={lot.verification} label={dict.lots.badges[lot.verification]} />
      </div>

      <div>
        <p className="font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] text-primary">
          {title} <span className="font-normal italic text-success">· {processLabel}</span>
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 flex-none items-center justify-center rounded-full bg-primary-hover font-label text-label-md text-on-primary"
          >
            {lot.initials}
          </span>
          <div>
            <p className="text-[17px] font-semibold text-ink">{lot.producerName}</p>
            <p className="mt-0.5 text-[15px] text-body">
              {lot.farm} · {lot.region}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-stretch gap-3">
        {lot.score !== null ? (
          <div className="flex flex-col justify-center rounded-md bg-primary px-[18px] py-3.5 text-on-primary">
            <span className="font-display text-4xl font-bold leading-none text-accent">{score(lang, lot.score)}</span>
            <span className="mt-1 font-label text-xs font-medium uppercase tracking-[0.06em]">{p.scoreCaption}</span>
          </div>
        ) : (
          <div className="flex flex-col justify-center rounded-md bg-surface-sunken px-[18px] py-3.5 text-ink">
            <span className="font-label text-label-md">{p.notCupped}</span>
          </div>
        )}
        <div className="min-w-0 flex-1 rounded-md bg-neutral px-[18px] py-3.5">
          {lot.priceUsdPerKg !== null ? (
            <>
              <p className="font-display text-[32px] font-semibold leading-[1.1] text-primary">
                USD {num(lang, lot.priceUsdPerKg, 2)}{" "}
                <span className="text-lg font-medium text-body">{p.pricePerKg}</span>
              </p>
              <p className="mt-1 text-body-sm text-muted">{p.priceNote}</p>
            </>
          ) : (
            <>
              <p className="font-display text-[28px] font-semibold leading-[1.1] text-primary">{p.priceOnRequest}</p>
              <p className="mt-1 text-body-sm text-muted">{p.priceOnRequestNote}</p>
            </>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3 border-y border-line-soft py-[18px]">
        <div>
          <dt className="text-[13px] text-muted">{p.available}</dt>
          <dd className="mt-1 text-lg font-semibold">{fmt(p.availableValue, { kg: num(lang, lot.availableKg) })}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">{p.minOrder}</dt>
          <dd className="mt-1 text-lg font-semibold">{fmt(p.minOrderValue, { kg: num(lang, lot.minOrderKg) })}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">{p.sample}</dt>
          <dd className="mt-1 text-lg font-semibold">{lot.sampleAvailable ? p.sampleFree : p.sampleOnRequest}</dd>
        </div>
      </dl>

      <Button href={sampleHref} variant="primary" size="lg" className="w-full">
        {p.requestSample} <span aria-hidden="true">→</span>
      </Button>
      <div className="flex gap-2.5">
        <Button href={askHref} variant="secondary" size="md" className="min-h-[52px] flex-1 ring-primary">
          {p.ask}
        </Button>
        <SaveLotButton code={lot.code} label={p.save} savedLabel={p.saved} />
      </div>
      <p className="text-[13px] leading-normal text-muted">{p.note}</p>
    </aside>
  );
}
