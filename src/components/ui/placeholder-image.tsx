import { cx } from "./cx";

/**
 * The only allowed stand-in for a missing photo: a labelled drying-bed box that says which photo
 * belongs here. `assetId` must have a row in ASSETS.md (checked by tests/e2e/smoke.spec.ts, not at
 * render time, so this module stays free of node:fs and client components can import it).
 * `ratio` must match the final image (for example "4 / 3", "4 / 5", "1 / 1").
 */
export function PlaceholderImage({
  assetId,
  label,
  ratio,
  className,
}: {
  assetId: string;
  /** What photo belongs here, in plain words */
  label: string;
  ratio: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      data-asset-id={assetId}
      style={{ aspectRatio: ratio }}
      className={cx("flex w-full items-end rounded-lg bg-placeholder p-4 text-ink", className)}
    >
      <p className="font-label text-label-md">
        <span className="block text-label-caps uppercase text-ink">Photo to add</span>
        {label}
      </p>
    </div>
  );
}
