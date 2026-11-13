import type { ReactNode } from "react";
import { cx } from "./cx";

/**
 * Sticky filter bar shell (layout only): parchment on the green line, crema on the shop.
 * Pages supply the filters (`children`), a result `count` and the `sort` control.
 */
export function FilterBar({
  line = "green",
  label,
  children,
  count,
  sort,
  className,
}: {
  line?: "green" | "roasted";
  /** Accessible name for the region */
  label: string;
  children: ReactNode;
  count?: ReactNode;
  sort?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cx(
        "sticky top-2 z-30 flex flex-wrap items-center gap-3 rounded-lg p-md",
        line === "roasted" ? "bg-roast-surface text-roast-dark" : "bg-surface text-primary",
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {count ? <p className="font-label text-label-md" aria-live="polite">{count}</p> : null}
      {sort ? <div className="flex items-center gap-2">{sort}</div> : null}
    </div>
  );
}
