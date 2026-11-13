import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Button } from "./button";

/**
 * Closing call to action: canopy green fading over a photo (coffee cherries) on the right,
 * lime primary plus outline secondary. Pass `children` for extra content under the buttons.
 */
export function CtaPanel({
  eyebrow,
  title,
  accent,
  text,
  image,
  primary,
  secondary,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  image: StaticImageData;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative mt-10 overflow-hidden rounded-xl bg-primary px-6 py-12 text-on-primary sm:px-12 sm:py-14">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover object-right" />
      <div aria-hidden="true" className="cta-fade absolute inset-0" />
      <div className="relative">
        <p className="font-label text-[13px] font-medium uppercase tracking-[0.08em] text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-display text-[34px] font-semibold leading-[1.1] sm:text-[44px]">
          {title} <span className="font-normal italic">{accent}</span>
        </h2>
        <p className="mt-3.5 max-w-[520px] text-lg leading-normal text-on-primary-body">{text}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={primary.href} variant="primary" size="lg">
            {primary.label}
          </Button>
          {secondary ? (
            <Button href={secondary.href} variant="outline-on-dark" size="lg">
              {secondary.label}
            </Button>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}
