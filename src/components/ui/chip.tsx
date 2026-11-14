import type { ReactNode } from "react";
import { cx } from "./cx";

export type ChipTone = "neutral" | "outline" | "verified" | "white" | "co" | "lime";

const tones: Record<ChipTone, string> = {
  neutral: "bg-surface-sunken text-ink",
  outline: "border border-line bg-neutral text-primary",
  verified: "bg-roast text-on-primary",
  white: "bg-neutral text-primary",
  co: "bg-roast text-on-primary",
  lime: "bg-accent text-on-accent",
};

/** Pill label in Ubuntu 500 (`chip` in DESIGN.md). `size="sm"` is the compact legend size. */
export function Chip({
  tone = "neutral",
  size = "md",
  className,
  children,
}: {
  tone?: ChipTone;
  size?: "sm" | "md";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full font-label font-medium",
        size === "md" ? "px-3 py-[7px] text-xs" : "px-2.5 py-1 text-xs",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
