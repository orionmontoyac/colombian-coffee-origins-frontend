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
 * transparent at the bottom. The banner fills the first screen (the page's top
 * padding sits above it). At 1360px and up, the bottom corners are cut away
 * in white so the business-line cards can tuck in.
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { hero } = dict;

  return (
    <section className="relative flex min-h-[calc(105dvh-0.5rem)] flex-col overflow-hidden rounded-b-[32px] bg-green-900 px-4 pt-[124px] text-center text-white sm:px-8 sm:pt-[144px] wide:rounded-b-none">
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

      <div className="relative flex flex-1 flex-col">
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
          className="-mx-4 mb-[-0.2em] mt-auto min-h-48 font-display text-[clamp(96px,17vw,240px)] font-extrabold italic leading-[0.8] tracking-[-0.02em] text-lime-500 sm:-mx-8 wide:mb-14"
        >
          {hero.giantWord}
        </p>
      </div>

      {/* Bottom cut-outs (only when the cards sit in three columns, 1360px and up).
          They leave an even 16px white gap around each card, like puzzle pieces:
          - the cards overlap the banner by 56px of the 72px cut (16px gap above), and
            the cut is 16px wider than the card (16px gap beside it);
          - the cut's inner corner is the card's 28px radius plus the 16px gap = 44px,
            so both curves run parallel;
          - 44px corner + the tab's 28px rounded corner below it = the 72px height,
            so the two curves join in one smooth S with no spike. */}
      <div aria-hidden="true" className="side-column-cut absolute bottom-0 left-0 z-20 hidden h-[72px] rounded-tr-[44px] bg-white wide:block">
        <span className="ear ear-tr bottom-full left-0" />
        <span className="ear ear-tr bottom-0 left-full" />
      </div>
      <div aria-hidden="true" className="side-column-cut absolute bottom-0 right-0 z-20 hidden h-[72px] rounded-tl-[44px] bg-white wide:block">
        <span className="ear ear-tl bottom-full right-0" />
        <span className="ear ear-tl bottom-0 right-full" />
      </div>
    </section>
  );
}
