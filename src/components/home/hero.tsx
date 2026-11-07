import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";
import bannerImage from "@/assets/home/banner-urrao-watercolor.png";
import { SiteHeader } from "./site-header";

/**
 * Hero banner with the header built into its top corners. At 1360px and up, the
 * bottom corners are cut away in white so the audience cards can tuck in,
 * leaving a center tab of the banner between them.
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section className="hero-banner relative overflow-hidden rounded-b-[32px] px-4 wide:rounded-b-none pt-[124px] text-center text-white sm:px-8 sm:pt-[144px]">
      <SiteHeader lang={lang} nav={dict.nav} />

      <h1 className="font-display text-4xl font-semibold leading-[1.1] sm:text-[56px]">
        <span className="font-normal italic">{hero.lead}</span> {hero.emphasis}
        <br />
        <span className="font-normal italic">{hero.tail}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[560px] text-base leading-normal text-mist sm:text-lg">
        {hero.subtitle}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href={href(lang, "coffees")}
          className="rounded-full bg-lime-500 px-7 py-4 text-base font-semibold text-green-900 hover:brightness-95"
        >
          {hero.primaryCta}
        </Link>
        <Link
          href={href(lang, "samples")}
          className="rounded-full border-[1.5px] border-[#9FC4AE] px-7 py-[15px] text-base font-semibold text-white hover:bg-white/10"
        >
          {hero.secondaryCta}
        </Link>
      </div>

      {/* Giant word sits behind the watercolor; its transparent sky lets the letters show */}
      <div className="relative -mx-4 sm:-mx-8 wide:mb-14">
        <p
          aria-hidden="true"
          className="-mb-[0.2em] mt-7 font-hero text-[clamp(96px,17vw,240px)] font-extrabold italic leading-[0.8] tracking-[-0.02em] text-lime-500"
        >
          {hero.giantWord}
        </p>
        <Image
          src={bannerImage}
          alt={hero.imageAlt}
          priority
          sizes="100vw"
          className="relative block h-auto w-full"
        />
      </div>

      {/* Bottom cut-outs (only when the cards sit in three columns, 1360px and up) */}
      <div aria-hidden="true" className="side-column-cut absolute bottom-0 left-0 z-20 hidden h-14 rounded-tr-[28px] bg-white wide:block">
        <span className="ear ear-tr bottom-full left-0" />
        <span className="ear ear-tr bottom-0 left-full" />
      </div>
      <div aria-hidden="true" className="side-column-cut absolute bottom-0 right-0 z-20 hidden h-14 rounded-tl-[28px] bg-white wide:block">
        <span className="ear ear-tl bottom-full right-0" />
        <span className="ear ear-tl bottom-0 right-full" />
      </div>
    </section>
  );
}
