import { cx } from "./cx";

/**
 * Stat on a dark banner: muted label over a Vollkorn value. Only one per row should be `accent`.
 * `line="roasted"` is the shop version: translucent white on dark roast with a kraft border.
 * Values never wrap mid-value: pass non-breaking spaces or let the box shrink the type on mobile.
 */
export function StatBox({
  label,
  value,
  accent = false,
  line = "green",
  className,
}: {
  label: string;
  value: string;
  accent?: boolean;
  line?: "green" | "roasted";
  className?: string;
}) {
  const roasted = line === "roasted";
  return (
    <div
      className={cx(
        "rounded-md p-3 text-left sm:p-4",
        roasted ? "border border-on-roast-body/20 bg-white/8" : "bg-primary-raised",
        className,
      )}
    >
      <p className={cx("font-sans text-body-sm", roasted ? "text-on-roast-body" : "text-on-primary-muted")}>{label}</p>
      <p
        className={cx(
          "mt-1 whitespace-nowrap font-display text-[22px] font-semibold leading-[1.1] sm:text-stat-value",
          accent ? (roasted ? "text-caramel" : "text-accent") : "text-on-primary",
        )}
      >
        {value.replace(/ /g, "\u00a0")}
      </p>
    </div>
  );
}
