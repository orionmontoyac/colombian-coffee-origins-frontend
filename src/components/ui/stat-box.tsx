import { cx } from "./cx";

/** Stat on a dark banner: muted label over a Vollkorn value. Only one per row should be `accent`. */
export function StatBox({
  label,
  value,
  accent = false,
  className,
}: {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("rounded-md bg-primary-raised p-4 text-left", className)}>
      <p className="font-sans text-body-sm text-on-primary-muted">{label}</p>
      <p
        className={cx(
          "mt-1 font-display text-stat-value",
          accent ? "text-accent" : "text-on-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}
