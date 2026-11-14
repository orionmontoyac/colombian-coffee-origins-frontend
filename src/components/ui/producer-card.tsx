import Link from "next/link";
import type { ReactNode } from "react";
import { TrustBadge, type TrustLevel } from "./trust-badge";

/**
 * Producer directory card. No avatar (Producer board): name, farm and town, trust level,
 * one-line story and lot count, linking to the profile.
 */
export function ProducerCard({
  name,
  farm,
  town,
  story,
  trust,
  meta,
  href,
  ctaLabel,
}: {
  name: string;
  farm: string;
  town: string;
  story: string;
  trust: { level: TrustLevel; label: string };
  /** For example "3 lots · 14 harvests" */
  meta?: ReactNode;
  href: string;
  ctaLabel: string;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-lg bg-surface p-xl transition-transform duration-200 ease-out motion-safe:hover:-translate-y-1">
      <TrustBadge level={trust.level} label={trust.label} className="self-start" />
      <h3 className="font-display text-headline-md text-primary">{name}</h3>
      <p className="text-body-sm text-muted">
        {farm} · {town}
      </p>
      <p className="text-body-md text-body">{story}</p>
      {meta ? <p className="border-t border-line pt-3 text-body-sm text-muted">{meta}</p> : null}
      <Link href={href} className="mt-auto inline-flex min-h-tap-target items-center gap-2 font-label text-label-md text-primary underline-offset-4 hover:underline">
        {ctaLabel} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
