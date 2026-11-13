import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { OnlyInCountry } from "@/components/only-in-country";
import { href } from "@/lib/routes";
import coffeeHills from "@/assets/home/hero-coffee-hills.jpg";
import { SiteHeader } from "./site-header";

/**
 * Hero banner with the header built into its top corners. The coffee hills photo
 * sits behind a fade that is solid canopy green at the top (behind the text) and
 * transparent at the bottom. At 1360px and up, the bottom corners are cut away
 * in white so the business-line cards can tuck in.
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section className="relative overflow-hidden rounded-b-[32px] bg-green-900 px-4 pt-[124px] text-center text-white sm:px-8 sm:pt-[144px] wide:h-[710px] wide:rounded-b-none">
      <Image
        src={coffeeHills}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-bottom"
      />
      <div aria-hidden="true" className="hero-fade absolute inset-0" />

      <SiteHeader lang={lang} nav={dict.nav} />

      <div className="relative">
        <h1 className="font-display text-4xl font-semibold leading-[1.1] sm:text-[56px]">
          <span className="font-normal italic">{hero.titleEm1}</span> {hero.titleMid}
          <br />
          {hero.titleStart2} <span className="font-normal italic">{hero.titleEm2}</span> {hero.titleEnd}
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-base leading-normal text-mist sm:text-lg">{hero.subtitle}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href={href(lang, "coffees")}
            className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-lime-500 px-7 py-4 font-label text-[17px] font-medium text-green-900 hover:brightness-95"
          >
            {hero.greenCta} <span aria-hidden="true">→</span>
          </Link>
          {/* The roasted coffee shop is sold inside Colombia only */}
          <OnlyInCountry country="CO">
            <Link
              href={href(lang, "shop")}
              className="inline-flex min-h-14 items-center gap-2.5 rounded-full bg-brown px-7 py-4 font-label text-[17px] font-medium text-white hover:bg-[#5e3820]"
            >
              {hero.shopCta}
              <span className="rounded-full bg-white/20 px-2 py-[3px] text-[11px] font-bold">{hero.shopBadge}</span>
            </Link>
          </OnlyInCountry>
        </div>

        <p
          aria-hidden="true"
          className="-mx-4 mb-[-0.2em] mt-7 min-h-48 font-display text-[clamp(96px,17vw,240px)] font-extrabold italic leading-[0.8] tracking-[-0.02em] text-lime-500 sm:-mx-8 wide:mb-14"
        >
          {hero.giantWord}
        </p>
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
