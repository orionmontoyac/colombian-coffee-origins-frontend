import { cx } from "./cx";

export type TrustLevel = "registered" | "farmVerified" | "coffeeVerified";

const tones: Record<TrustLevel, string> = {
  coffeeVerified: "bg-roast text-on-primary",
  farmVerified: "bg-primary text-on-primary",
  registered: "bg-surface-sunken text-ink-soft",
};

/** Trust level chip: Registered, Farm verified, Coffee verified (brown). Label comes from the dictionary. */
export function TrustBadge({
  level,
  label,
  size = "md",
  className,
}: {
  level: TrustLevel;
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full font-label text-xs font-medium",
        size === "md" ? "px-3 py-[7px]" : "px-2.5 py-1",
        tones[level],
        className,
      )}
    >
      {label}
    </span>
  );
}
