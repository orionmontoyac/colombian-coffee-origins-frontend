import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";
import coffeeBranch from "@/assets/home/coffee-branch-sketch.png";
import mokaPot from "@/assets/home/moka-pot-sketch.png";

type Line = "green" | "roasted";

const tone: Record<Line, { card: string; title: string; button: string }> = {
  green: {
    card: "bg-cream-100",
    title: "text-green-900",
    button: "bg-green-900 hover:bg-green-700",
  },
  roasted: {
    card: "bg-roast-card",
    title: "text-roast-dark",
    button: "bg-brown hover:bg-[#5e3820]",
  },
};

/**
 * Card for one business line: a full-height sketch on one side and the call to
 * action in a white notch cut from the opposite bottom corner. The green card
 * keeps its text on the left; the roasted card mirrors it.
 */
function LineCard({
  line,
  title,
  text,
  cta,
  ctaHref,
  image,
}: {
  line: Line;
  title: ReactNode;
  text: string;
  cta: string;
  ctaHref: string;
  image: StaticImageData;
}) {
  const left = line === "green";
  const t = tone[line];

  return (
    <article className={`relative min-h-[320px] min-w-0 rounded-[28px] px-7 pb-[120px] pt-[34px] ${t.card}`}>
      <div className={left ? "pr-[110px] sm:pr-[180px]" : "pl-[110px] sm:pl-[180px]"}>
        <h2 className={`font-display text-[44px] font-semibold leading-[1.05] tracking-[-0.015em] sm:text-[56px] ${t.title}`}>
          {title}
        </h2>
        <p className="mt-3.5 max-w-[250px] text-base leading-normal text-sage sm:text-lg">{text}</p>
      </div>

      <div className={`absolute bottom-[18px] top-[18px] w-[90px] sm:w-[150px] ${left ? "right-[18px]" : "left-[18px]"}`}>
        <Image src={image} alt="" fill sizes="150px" className="object-contain" />
      </div>

      <div
        className={`absolute bottom-0 bg-white pb-1 pt-[18px] ${
          left ? "left-0 rounded-tr-[28px] pr-[26px]" : "right-0 rounded-tl-[28px] pl-[26px]"
        }`}
      >
        <Link
          href={ctaHref}
          className={`inline-flex min-h-[52px] items-center gap-2.5 whitespace-nowrap rounded-full px-7 py-4 font-label text-lg font-medium text-white sm:text-xl ${t.button}`}
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

/** The two ways to buy, tucked into the hero's bottom cut-outs, with the statement between them. */
export function BusinessLines({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { lines: l, statement: s } = dict;

  return (
    <section className="relative z-30 mt-4 grid gap-6 md:grid-cols-2 wide:-mt-9 wide:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
      <LineCard
        line="green"
        title={
          <>
            {l.greenTitle}
            <br />
            <span className="font-normal italic">{l.greenTitleEm}</span>
          </>
        }
        text={l.greenText}
        cta={l.greenCta}
        ctaHref={href(lang, "coffees")}
        image={coffeeBranch}
      />

      <p className="self-center px-2 py-6 text-center font-display text-[32px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink sm:text-[48px] md:order-first md:col-span-2 wide:order-none wide:col-span-1 wide:pb-0 wide:pt-[52px]">
        {s.start} <span className="font-medium italic text-green-900">{s.em}</span> {s.mid}{" "}
        <span className="font-medium italic text-green-600">{s.green}</span> {s.or}{" "}
        <span className="font-medium italic text-brown">{s.roasted}</span>
      </p>

      <LineCard
        line="roasted"
        title={
          <>
            {l.roastedTitle} <span className="font-normal italic">{l.roastedTitleEm}</span>
          </>
        }
        text={l.roastedText}
        cta={l.roastedCta}
        ctaHref={href(lang, "shop")}
        image={mokaPot}
      />
    </section>
  );
}
