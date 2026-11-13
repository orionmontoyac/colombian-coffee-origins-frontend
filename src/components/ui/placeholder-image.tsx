import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cx } from "./cx";

let assetsDoc: string | null = null;
function assetListed(assetId: string): boolean {
  if (assetsDoc === null) {
    try {
      assetsDoc = readFileSync(join(process.cwd(), "ASSETS.md"), "utf8");
    } catch {
      return true; // cannot check (for example on a read-only runtime)
    }
  }
  if (assetsDoc.includes(assetId)) return true;
  // Rows may use wildcards such as `product-photos-*` or ranges such as `lot-urr-024-gallery-1..4`.
  return assetsDoc.split("\n").some((line) => {
    const cell = line.split("|")[2]?.trim().replace(/`/g, "");
    if (!cell) return false;
    const prefix = cell.split(/\*|\.\./)[0];
    return prefix.length > 4 && prefix !== cell && assetId.startsWith(prefix);
  });
}

/**
 * The only allowed stand-in for a missing photo: a labelled drying-bed box that says which photo
 * belongs here. `assetId` must have a row in ASSETS.md; a missing row is reported at render time.
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
  if (process.env.NODE_ENV !== "production" && !assetListed(assetId)) {
    console.error(`PlaceholderImage: assetId "${assetId}" is not listed in ASSETS.md`);
  }
  return (
    <div
      role="img"
      aria-label={label}
      data-asset-id={assetId}
      style={{ aspectRatio: ratio }}
      className={cx("flex w-full items-end rounded-lg bg-placeholder p-4 text-ink", className)}
    >
      <p className="font-label text-label-md">
        <span className="block text-label-caps uppercase text-muted">Photo to add</span>
        {label}
      </p>
    </div>
  );
}
