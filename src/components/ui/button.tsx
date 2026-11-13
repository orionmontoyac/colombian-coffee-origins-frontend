import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "on-dark" | "outline-on-dark" | "shop" | "shop-on-dark";
export type ButtonSize = "sm" | "md" | "lg";

// Outline variants draw their 1.5px border as an inset ring so every variant has the same height.
const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-label font-medium transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  secondary: "ring-[1.5px] ring-inset ring-line bg-neutral text-primary hover:bg-surface",
  "on-dark": "bg-primary text-on-primary hover:bg-primary-hover",
  "outline-on-dark": "ring-[1.5px] ring-inset ring-on-primary-muted text-on-primary hover:bg-neutral/10",
  shop: "bg-roast text-on-primary hover:bg-roast-hover",
  "shop-on-dark": "bg-caramel text-roast-dark hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[46px] px-[18px] py-3 text-[15px]",
  md: "min-h-[50px] px-[22px] py-3.5 text-base",
  lg: "min-h-[54px] px-7 py-4 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string; hrefLang?: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;
type NativeProps = CommonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Five variants: primary (lime), secondary (outline), on-dark, shop (brown) and
 * shop-on-dark (caramel). `outline-on-dark` is the outline CTA used on green panels.
 * Renders a link when `href` is set, otherwise a button.
 */
export function Button(props: LinkProps | NativeProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cx(base, variants[variant], sizes[size], className);
  if (typeof props.href === "string") {
    const { href, hrefLang } = props as LinkProps;
    return (
      <Link href={href} hrefLang={hrefLang} className={classes}>
        {children}
      </Link>
    );
  }
  const { href: _unused, type = "button", ...buttonRest } = rest as NativeProps;
  void _unused;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
