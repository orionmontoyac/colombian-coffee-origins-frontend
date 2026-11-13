"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { href } from "@/lib/routes";

// Menu order from DESIGN.md: Home · Green Coffee · Shop (CO) · Producers · Our Story
const NAV_ITEMS = ["home", "coffees", "shop", "producers", "ourStory"] as const;

/** Small "CO" pill: the roasted coffee shop sells inside Colombia only. */
function CoBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-brown px-1.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-white">
      {label}
    </span>
  );
}

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="9" ry="13" transform="rotate(35 16 16)" fill="var(--primary)" />
      <path d="M10 24 C 14 18, 18 14, 22 8" stroke="var(--accent)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9s1.3-6.3 3.8-9z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const dropdownPanel =
  "absolute right-0 top-full z-40 mt-2 min-w-48 rounded-2xl bg-white p-2 text-left shadow-[0_16px_40px_rgb(11_61_42/0.18)]";
const dropdownLink =
  "block rounded-[12px] px-4 py-3 text-sm font-medium text-green-900 hover:bg-cream-100";

function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

/**
 * Header built into the top of the hero banner: two equal-width white notches
 * (logo left, language + CTA right) with the pill menu centered between them.
 * Must be rendered inside a `relative` container (the hero banner).
 */
export function SiteHeader({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const languages = Object.entries(nav.languages) as [Locale, string][];

  return (
    <header>
      {/* Left notch: logo */}
      <div className="absolute left-0 top-0 z-20 flex h-14 items-center rounded-br-[28px] bg-white pl-1 pr-6 nav:w-[340px]">
        <Link
          href={href(lang, "home")}
          className="flex items-center gap-2.5 whitespace-nowrap font-display text-xl font-semibold text-green-900"
        >
          <LogoMark />
          <span className="max-[720px]:sr-only">Colombian Coffee Origins</span>
        </Link>
        <span className="ear ear-br left-full top-0" />
        <span className="ear ear-br left-0 top-full" />
      </div>

      {/* Centered pill menu (wide screens) */}
      <nav
        aria-label={nav.mainLabel}
        className="absolute left-1/2 top-0 z-20 hidden h-16 -translate-x-1/2 items-center gap-1.5 nav:flex"
      >
        {NAV_ITEMS.map((key) => {
          const active = key === "home";
          return (
            <Link
              key={key}
              href={href(lang, key)}
              aria-current={active ? "page" : undefined}
              title={key === "shop" ? nav.shopOnlyCo : undefined}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 font-label text-xs uppercase tracking-[0.05em] ${
                active
                  ? "bg-white font-bold text-green-900"
                  : "bg-white/12 font-medium text-white hover:bg-white/20"
              }`}
            >
              {nav[key]}
              {key === "shop" && <CoBadge label={nav.shopBadge} />}
            </Link>
          );
        })}
      </nav>

      {/* Right notch: language, call to action, and the menu on smaller screens */}
      <div className="absolute right-0 top-0 z-20 flex h-14 items-center justify-end gap-3.5 rounded-bl-[28px] bg-white pl-6 pr-1 nav:w-[340px]">
        <details className="relative max-[720px]:hidden">
          <summary
            aria-label={nav.languageLabel}
            className="inline-flex min-h-[46px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-line px-3.5 py-2.5 text-sm font-label font-medium text-green-900"
          >
            <GlobeIcon />
            {nav.currentLanguage}
            <ChevronIcon />
          </summary>
          <ul className={dropdownPanel}>
            {languages.map(([code, label]) => (
              <li key={code}>
                <Link
                  href={href(code, "home")}
                  hrefLang={code}
                  lang={code}
                  aria-current={code === lang ? "true" : undefined}
                  className={`${dropdownLink} ${code === lang ? "bg-cream-100" : ""}`}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <Link
          href={href(lang, "samples")}
          className="whitespace-nowrap rounded-full bg-lime-500 px-6 py-[15px] max-[720px]:hidden text-sm font-label font-medium text-green-900 hover:brightness-95"
        >
          {nav.cta}
        </Link>

        <details className="relative nav:hidden">
          <summary
            aria-label={nav.menu}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-green-900 text-white"
          >
            <MenuIcon />
          </summary>
          <nav aria-label={nav.mainLabel} className={dropdownPanel}>
            <ul>
              {NAV_ITEMS.map((key) => (
                <li key={key}>
                  <Link href={href(lang, key)} className={`${dropdownLink} flex items-center gap-2`}>
                    {nav[key]}
                    {key === "shop" && <CoBadge label={nav.shopBadge} />}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-1 border-t border-line pt-1">
              {languages.map(([code, label]) => (
                <li key={code}>
                  <Link
                    href={href(code, "home")}
                    hrefLang={code}
                    lang={code}
                    aria-current={code === lang ? "true" : undefined}
                    className={dropdownLink}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <span className="ear ear-bl right-full top-0" />
        <span className="ear ear-bl right-0 top-full" />
      </div>
    </header>
  );
}
