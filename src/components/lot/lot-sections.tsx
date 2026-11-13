import Image from "next/image";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { LotCard } from "@/components/ui/lot-card";
import { SectionHeader } from "@/components/ui/section-header";
import { lots as allLots, relatedLots, type Lot } from "@/data/lots";
import { getProducer } from "@/data/producers";
import { href, lotHref, producerHref } from "@/lib/routes";
import farmersHarvest from "@/assets/home/farmers-harvest.jpg";
import urraoSquare from "@/assets/home/urrao-main-square.jpg";
import { attr, fmt, harvestYear, num, score } from "./format";

type Props = { lang: Locale; dict: Dictionary; lot: Lot };

const h2Small = "font-display text-[32px] font-semibold leading-[1.1] text-primary";

function Tick() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7.5l2.5 2.5L11 4.5" />
    </svg>
  );
}

/* ---------- Specs table + cup profile ---------- */

export function SpecsAndCup({ lang, dict, lot }: Props) {
  const s = dict.lotPage.specs;
  const c = dict.lotPage.cup;
  const d = lot.detail;
  const rows: Array<[string, string]> = [
    [s.variety, lot.variety],
    [s.process, d ? d.processNote[lang] : dict.lots.processes[lot.process]],
    [s.altitude, `${num(lang, lot.altitudeM)} m`],
    [s.harvest, lot.harvest[lang]],
    [s.available, fmt(s.availableNote, { kg: num(lang, lot.availableKg), bags: lot.availableBags })],
    [s.moisture, d ? `${num(lang, d.moisturePct, 1)}%` : s.onRequest],
    [s.waterActivity, d ? fmt(s.waterActivityUnit, { value: num(lang, d.waterActivity, 2) }) : s.onRequest],
    [s.packaging, d ? d.packaging[lang] : s.onRequest],
    [s.storedIn, d ? d.storedIn : s.onRequest],
  ];
  const attributes = d
    ? (["acidity", "sweetness", "body", "aftertaste"] as const).map((k) => ({
        key: k,
        label: c.attributes[k],
        value: d.attributes[k],
      }))
    : [];

  return (
    <section aria-labelledby="specs-title" className="grid gap-6 pb-2 pt-14 lg:grid-cols-2">
      <div className="rounded-xl p-6 ring-[1.5px] ring-inset ring-line sm:p-8">
        <p className="font-label text-label-caps uppercase text-success">{s.eyebrow}</p>
        <h2 id="specs-title" className="mb-5 mt-2 font-display text-[34px] font-semibold leading-[1.1] text-primary">
          {s.title} <span className="font-normal italic">{s.accent}</span>
        </h2>
        <dl>
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-t border-surface-sunken py-[13px]">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-[22px] rounded-xl bg-primary p-6 text-on-primary sm:p-8">
        <div>
          <p className="font-label text-label-caps uppercase text-accent">{c.eyebrow}</p>
          <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.1]">
            {c.title} <span className="font-normal italic">{c.accent}</span>
          </h2>
        </div>

        {lot.score !== null ? (
          <div className="flex items-center gap-5">
            <span className="font-display text-7xl font-bold leading-none text-accent">{score(lang, lot.score)}</span>
            <p className="text-[15px] leading-normal text-on-primary-body">
              {c.points}
              {d ? (
                <>
                  <br />
                  {c.cuppedBy}
                </>
              ) : null}
            </p>
          </div>
        ) : (
          <p className="text-[15px] leading-normal text-on-primary-body">{c.notCupped}</p>
        )}

        <ul aria-label={c.notesLabel} className="flex flex-wrap gap-2">
          {lot.notes[lang].map((note) => (
            <li key={note} className="rounded-full border border-on-primary-muted/40 bg-neutral/10 px-3.5 py-2 font-label text-label-md">
              {note}
            </li>
          ))}
        </ul>

        {d ? (
          <ul className="flex flex-col gap-3.5">
            {attributes.map((a) => (
              <li key={a.key}>
                <div className="flex justify-between text-[15px]">
                  <span>{a.label}</span>
                  <span className="font-semibold">{fmt(c.outOf, { value: attr(lang, a.value) })}</span>
                </div>
                <div aria-hidden="true" className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral/15">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${a.value * 10}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : lot.score !== null ? (
          <p className="text-[15px] leading-normal text-on-primary-muted">{c.attributesPending}</p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Producer ---------- */

export function ProducerBlock({ lang, dict, lot }: Props) {
  const p = dict.lotPage.producer;
  const producer = lot.producerSlug ? getProducer(lot.producerSlug) : undefined;
  const lotsListed = allLots.filter((l) => l.producerName === lot.producerName).length;
  // Stock photo of the valley: never presented as the producer's own farm.
  const usePickers = lot.image !== farmersHarvest;
  const story = producer?.story[lang] ?? p.storyStub;

  return (
    <section aria-labelledby="producer-title" className="grid items-center gap-8 pb-2 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
      <div className="relative h-[320px] overflow-hidden rounded-xl bg-placeholder sm:h-[420px] lg:h-[460px]">
        <Image
          src={usePickers ? farmersHarvest : urraoSquare}
          alt={usePickers ? p.photoAltPickers : p.photoAlt}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-label text-label-caps uppercase text-success">{p.eyebrow}</p>
        <h2 id="producer-title" className="mt-2.5 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.015em] text-primary sm:text-headline-lg">
          {lot.producerName}, <span className="font-normal italic">{lot.farm}</span>
        </h2>
        <p className="mt-4 max-w-[62ch] text-body-lg leading-relaxed text-body">{story}</p>
        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            [p.farmSize, p.farmSizeValue],
            [p.altitude, `${num(lang, producer?.altitudeM ?? lot.altitudeM)} m`],
            [p.lotsListed, String(lotsListed)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-surface px-4 py-3.5">
              <dt className="text-[13px] text-muted">{label}</dt>
              <dd className="mt-1 text-lg font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {producer ? (
            <Button href={producerHref(lang, producer.slug)} variant="on-dark" size="lg">
              {p.viewProfile}
              <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-accent text-on-accent">
                →
              </span>
            </Button>
          ) : (
            <Chip tone="neutral" className="min-h-14 px-5 text-label-md">
              {p.noProfile}
            </Chip>
          )}
          <Chip tone="neutral" className="min-h-14 px-5 text-label-md">
            {p.mapPlaceholder}
          </Chip>
        </div>
      </div>
    </section>
  );
}

/* ---------- What we checked + how buying works ---------- */

type CheckKey = "farmVisited" | "cupped" | "kilosConfirmed" | "moisture";
const CHECK_KEYS: CheckKey[] = ["farmVisited", "cupped", "kilosConfirmed", "moisture"];

export function CheckedAndBuying({ dict, lot }: Omit<Props, "lang"> & { lang?: Locale }) {
  const c = dict.lotPage.checked;
  const b = dict.lotPage.buying;
  const done: CheckKey[] =
    lot.detail?.checks ??
    (lot.verification === "coffeeVerified" ? ["farmVisited", "cupped"] : lot.verification === "farmVerified" ? ["farmVisited"] : []);

  return (
    <section className="grid gap-6 pb-2 pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-xl bg-surface p-6 sm:p-8">
        <p className="font-label text-label-caps uppercase text-roast">{c.eyebrow}</p>
        <h2 id="checked-title" className={`${h2Small} mb-[18px] mt-2`}>
          {c.title} <span className="font-normal italic">{c.accent}</span>
        </h2>
        <ul className="flex flex-col gap-3.5">
          {CHECK_KEYS.map((key) => {
            const ok = done.includes(key);
            const item = c.items[key];
            return (
              <li key={key} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`flex size-[26px] flex-none items-center justify-center rounded-full ${
                    ok ? "bg-accent text-on-accent" : "bg-neutral text-muted ring-[1.5px] ring-inset ring-line"
                  }`}
                >
                  {ok ? <Tick /> : null}
                </span>
                <div>
                  <p className="font-semibold">
                    {item.title} <span className="sr-only">: {ok ? c.done : c.pending}</span>
                  </p>
                  <p className="mt-0.5 text-body-sm text-muted">{ok ? item.note : c.pendingNote}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl p-6 ring-[1.5px] ring-inset ring-line sm:p-8">
        <p className="font-label text-label-caps uppercase text-success">{b.eyebrow}</p>
        <h2 id="buying-title" className={`${h2Small} mb-5 mt-2`}>
          {b.title} <span className="font-normal italic">{b.accent}</span>
        </h2>
        <ol className="grid gap-3.5 sm:grid-cols-3">
          {b.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 rounded-md bg-surface p-5">
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-accent"
              >
                {i + 1}
              </span>
              <h3 className="mt-1 font-display text-headline-sm text-primary">
                <span className="sr-only">{fmt(b.stepLabel, { n: i + 1 })}: </span>
                {step.title}
              </h3>
              <p className="text-body-sm leading-normal text-body">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- More from Urrao ---------- */

export function MoreLots({ lang, dict, lot }: Props) {
  const m = dict.lotPage.more;
  const l = dict.lots;
  const n = (value: number, digits = 0) => num(lang, value, digits);
  const others = relatedLots(lot.code, 3);

  return (
    <section aria-label={`${m.title} ${m.accent}`} className="px-4 pb-2 pt-14">
      <div>
        <SectionHeader
          title={m.title}
          accent={m.accent}
          text={m.text}
          action={
            <Button href={href(lang, "coffees")} variant="on-dark" size="lg">
              {m.all}
              <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-accent text-on-accent">
                →
              </span>
            </Button>
          }
        />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((o) => (
          <LotCard
            key={o.code}
            code={o.code}
            image={o.image}
            imageAlt={o.imageAlt[lang]}
            trust={{ level: o.verification, label: l.badges[o.verification] }}
            score={o.score !== null ? score(lang, o.score) : null}
            notCuppedLabel={l.notCupped}
            variety={o.variety}
            processLabel={l.processes[o.process]}
            producer={o.producerName}
            producerInitials={o.initials}
            farmLine={`${o.farm} · ${o.region}`}
            notes={o.notes[lang]}
            notesLabel={l.notesLabel}
            specs={[
              { label: l.altitude, value: `${n(o.altitudeM)} m` },
              { label: l.available, value: `${n(o.availableKg)} kg` },
              { label: l.harvest, value: harvestYear(o.harvest[lang]) },
            ]}
            price={o.priceUsdPerKg !== null ? `USD ${n(o.priceUsdPerKg, 2)} / kg` : l.priceOnRequest}
            priceNote={o.priceUsdPerKg !== null ? l.greenFob : l.sampleAvailable}
            ctaLabel={l.requestSample}
            ctaHref={`${href(lang, "samples")}?lot=${o.code}`}
            detailHref={lotHref(lang, o.code)}
          />
        ))}
      </div>
      <p className="mt-[18px] text-[13px] text-muted">{m.note}</p>
    </section>
  );
}
