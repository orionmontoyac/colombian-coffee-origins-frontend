import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";
import mokaPot from "@/assets/home/moka-pot-sketch.png";
import coffeeBranch from "@/assets/home/coffee-branch-sketch.png";

type Side = "left" | "right";

/**
 * Cream card with a full-height illustration on one side and its call to action
 * in a white notch cut from the opposite bottom corner. `side` is where the
 * notch (and the text) sit; the image takes the other side.
 */
function AudienceCard({
  side,
  title,
  text,
  cta,
  ctaHref,
  image,
}: {
  side: Side;
  title: ReactNode;
  text: string;
  cta: string;
  ctaHref: string;
  image: StaticImageData;
}) {
  const left = side === "left";

  return (
    <article className="relative min-h-[320px] min-w-0 rounded-[28px] bg-cream-100 px-7 pb-[120px] pt-[34px]">
      <div className={left ? "pr-[110px] sm:pr-[180px]" : "pl-[110px] sm:pl-[180px]"}>
        <h2 className="break-words font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-green-900 sm:text-[34px] wide:text-[clamp(28px,2.35vw,34px)]">
          {title}
        </h2>
        <p className="mt-3.5 max-w-[250px] text-base leading-normal text-sage sm:text-lg">{text}</p>
      </div>

      <div
        className={`absolute bottom-[18px] top-[18px] w-[90px] sm:w-[146px] ${
          left ? "right-[18px]" : "left-[18px]"
        }`}
      >
        <Image src={image} alt="" fill sizes="146px" className="object-contain" />
      </div>

      <div
        className={`absolute bottom-0 bg-white pb-1 pt-[18px] ${
          left ? "left-0 rounded-tr-[28px] pr-[26px]" : "right-0 rounded-tl-[28px] pl-[26px]"
        }`}
      >
        <Link
          href={ctaHref}
          className="inline-flex min-h-[52px] items-center gap-2.5 whitespace-nowrap rounded-full bg-green-900 px-7 py-4 text-lg font-semibold text-white hover:bg-green-700 sm:text-xl"
        >
          {cta} <span aria-hidden="true">↗</span>
        </Link>
        {left ? (
          <>
            <span className="ear ear-tr bottom-full left-0" />
            <span className="ear ear-tr bottom-0 left-full" />
          </>
        ) : (
          <>
            <span className="ear ear-tl bottom-full right-0" />
            <span className="ear ear-tl bottom-0 right-full" />
          </>
        )}
      </div>
    </article>
  );
}

/** Cards that tuck into the hero's bottom cut-outs, with the statement under the center tab. */
export function AudienceCards({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { audience: a, statement: s } = dict;

  return (
    <section className="relative z-30 mt-4 grid gap-6 md:grid-cols-2 wide:-mt-9 wide:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
      <AudienceCard
        side="left"
        title={
          <>
            {a.buyersTitleStart} <span className="font-normal italic">{a.buyersTitleJoin}</span>{" "}
            {a.buyersTitleEnd}
          </>
        }
        text={a.buyersText}
        cta={a.buyersCta}
        ctaHref={href(lang, "forBuyers")}
        image={mokaPot}
      />

      <p className="self-center px-2 py-6 text-center font-display text-[30px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink sm:text-[43px] md:order-first md:col-span-2 wide:order-none wide:col-span-1 wide:pb-0 wide:pt-[52px]">
        {s.start} <span className="font-medium italic text-green-900">{s.em}</span> {s.mid}{" "}
        <span className="font-medium italic text-green-600">{s.accent}</span>{" "}
        <span className="text-green-600">{s.end}</span>
      </p>

      <AudienceCard
        side="right"
        title={a.farmersTitle}
        text={a.farmersText}
        cta={a.farmersCta}
        ctaHref={href(lang, "producers")}
        image={coffeeBranch}
      />
    </section>
  );
}
