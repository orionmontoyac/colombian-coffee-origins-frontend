import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { TrustBadge, type TrustLevel } from "./trust-badge";
import { PlaceholderImage } from "./placeholder-image";

export type LotCardProps = {
  code: string;
  /** Photo; omit to show a labelled placeholder (then pass `placeholderAssetId`) */
  image?: StaticImageData;
  imageAlt?: string;
  placeholderAssetId?: string;
  trust: { level: TrustLevel; label: string };
  /** SCA score, already formatted ("87.5"); null when the lot has not been cupped */
  score: string | null;
  notCuppedLabel: string;
  variety: string;
  processLabel: string;
  producer: string;
  producerInitials: string;
  /** For example "Finca El Mirador · Urrao, Antioquia" */
  farmLine: string;
  notes: string[];
  notesLabel: string;
  /** Altitude, Available, Harvest: label and formatted value */
  specs: Array<{ label: string; value: string }>;
  price: string;
  priceNote: string;
  ctaLabel: string;
  ctaHref: string;
  /** Optional link on the lot title (lot detail page) */
  detailHref?: string;
};

/** Green-line lot card: photo with code, trust and score chips, notes, specs table, USD price, CTA. */
export function LotCard(p: LotCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-notch bg-surface">
      <div className="relative h-60">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage
            assetId={p.placeholderAssetId ?? `lot-card-photo-${p.code.toLowerCase()}`}
            label={`${p.variety}, lot ${p.code}`}
            ratio="auto"
            className="h-full rounded-none"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-neutral px-3 py-[7px] font-label text-xs font-medium tracking-[0.08em] text-primary">
          {p.code}
        </span>
        <TrustBadge level={p.trust.level} label={p.trust.label} className="absolute right-4 top-4" />
        {p.score !== null ? (
          <span className="absolute bottom-4 left-4 inline-flex items-baseline gap-1.5 rounded-[14px] bg-primary px-3.5 py-2 text-on-primary">
            <strong className="font-display text-2xl font-bold text-accent">{p.score}</strong>
            <span className="text-xs font-semibold tracking-[0.06em]">SCA</span>
          </span>
        ) : (
          <span className="absolute bottom-4 left-4 rounded-[14px] bg-neutral px-3.5 py-2 text-[13px] font-semibold text-ink-soft">
            {p.notCuppedLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[18px] px-6 pb-[26px] pt-6">
        <div>
          <h3 className="font-display text-headline-md text-primary">
            {p.detailHref ? <Link href={p.detailHref}>{p.variety}</Link> : p.variety}{" "}
            <span className="font-normal italic text-success">· {p.processLabel}</span>
          </h3>
          <div className="mt-3.5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 flex-none items-center justify-center rounded-full bg-primary-hover font-label text-sm font-medium text-on-primary"
            >
              {p.producerInitials}
            </span>
            <div>
              <p className="text-base font-semibold text-ink">{p.producer}</p>
              <p className="mt-0.5 text-sm text-body">{p.farmLine}</p>
            </div>
          </div>
        </div>

        <ul aria-label={p.notesLabel} className="flex flex-wrap gap-2">
          {p.notes.map((note) => (
            <li key={note} className="rounded-full border border-line bg-neutral px-3 py-1.5 font-label text-sm font-medium text-primary">
              {note}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-3 gap-3 border-y border-line-soft py-4">
          {p.specs.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[13px] text-muted">{label}</dt>
              <dd className="mt-1 text-[17px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-[22px] font-semibold text-primary">{p.price}</p>
            <p className="mt-0.5 text-[13px] text-muted">{p.priceNote}</p>
          </div>
          <Button href={p.ctaHref} variant="primary" size="md">
            {p.ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
