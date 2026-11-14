import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cx } from "./cx";

/**
 * Eyebrow, title with one italic accent, optional text and an optional action on the right.
 * `size="lg"` is the DESIGN.md section heading (44px); `size="xl"` is the larger 56px
 * heading the home page uses today. `line="roasted"` switches to the brown shop colors.
 */
export function SectionHeader({
  eyebrow,
  title,
  accent,
  titleEnd,
  text,
  action,
  line = "green",
  size = "lg",
  as: Heading = "h2",
  id,
  className,
}: {
  eyebrow?: ReactNode;
  title: string;
  accent?: string;
  titleEnd?: string;
  text?: string;
  action?: ReactNode;
  line?: "green" | "roasted";
  size?: "lg" | "xl";
  as?: "h1" | "h2";
  /** Id on the heading, for `aria-labelledby` on the section */
  id?: string;
  className?: string;
}) {
  const roasted = line === "roasted";
  const header = (
    <div className="max-w-[760px]">
      {eyebrow ? (
        <p
          className={cx(
            "font-label font-medium uppercase",
            size === "xl" ? "text-sm tracking-[0.08em]" : "text-label-caps",
            roasted ? "text-roast" : "text-success",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cx(
          "font-display font-semibold",
          eyebrow ? (roasted ? "mt-3" : "mt-2.5") : "",
          size === "xl"
            ? "text-[40px] leading-[1.05] tracking-[-0.015em] sm:text-[56px]"
            : "text-headline-lg",
          roasted ? "text-roast-dark" : "text-primary",
        )}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <span className="font-normal italic">{accent}</span>
          </>
        ) : null}
        {titleEnd ? ` ${titleEnd}` : ""}
      </Heading>
      {text ? (
        <p
          className={cx(
            "mt-4 leading-normal",
            size === "xl" ? "text-lg sm:text-xl" : "text-body-lg",
            roasted ? "text-roast-body" : "text-body",
          )}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
  if (!action) return <Reveal className={className}>{header}</Reveal>;
  return (
    <Reveal className={cx("flex flex-wrap items-end justify-between gap-x-10 gap-y-6", className)}>
      <div className="max-w-[720px]">{header}</div>
      {action}
    </Reveal>
  );
}
