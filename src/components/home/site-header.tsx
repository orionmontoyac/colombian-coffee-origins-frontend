"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { CartIcon } from "@/components/ui/icons";
import { SkipLink } from "@/components/ui/skip-link";
import { uiLabels } from "@/components/ui/labels";
import { href } from "@/lib/routes";

// Menu order from DESIGN.md: Home · Green Coffee · Shop (CO) · Producers · Our Story
const NAV_ITEMS = ["home", "coffees", "shop", "producers", "ourStory"] as const;
export type NavKey = (typeof NAV_ITEMS)[number];

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
 * Header built into the top of a banner: two equal-width white notches
 * (logo left, language + CTA right) with the pill menu centered between them.
 * Must be rendered inside a `relative` container (the banner).
 *
 * - `active`: which menu item is the current page (default "home").
 * - `variant="shop"`: the right notch shows a brown Cart button instead of Request Samples.
 *   Cart state lives elsewhere (T2.4): pass `cart.count` and `cart.onOpen` (or `cart.href`).
 * - A skip link to `#main` is the first focusable element (`skipLabel` overrides the text).
 */
export function SiteHeader({
  lang,
  nav,
  active = "home",
  variant = "default",
  cart,
  skipLabel,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
  active?: NavKey;
  variant?: "default" | "shop";
  cart?: { count: number; label?: string; onOpen?: () => void; href?: string };
  skipLabel?: string;
}) {
  const languages = Object.entries(nav.languages) as [Locale, string][];
  const labels = uiLabels[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const cartLabel = cart?.label ?? labels.cart;
  const cartClasses =
    "inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-full bg-roast px-5 py-[13px] font-label text-sm font-medium text-on-primary hover:bg-roast-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary";
  const cartContent = (
    <>
      <CartIcon />
      {cartLabel}
      <span className="rounded-full bg-neutral px-2 py-0.5 text-xs font-medium text-roast">
        <span className="sr-only">: </span>
        {cart?.count ?? 0}
      </span>
    </>
  );

  return (
    <header>
      <SkipLink label={skipLabel ?? labels.skipToContent} />
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
          const isActive = key === active;
          return (
            <Link
              key={key}
              href={href(lang, key)}
              aria-current={isActive ? "page" : undefined}
              title={key === "shop" ? nav.shopOnlyCo : undefined}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 font-label text-xs uppercase tracking-[0.05em] ${
                isActive
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

        {variant === "shop" ? (
          cart?.onOpen ? (
            <button type="button" onClick={cart.onOpen} className={`${cartClasses} max-[720px]:hidden`}>
              {cartContent}
            </button>
          ) : (
            <Link href={cart?.href ?? href(lang, "shop")} className={`${cartClasses} max-[720px]:hidden`}>
              {cartContent}
            </Link>
          )
        ) : (
          <Link
            href={href(lang, "samples")}
            className="whitespace-nowrap rounded-full bg-lime-500 px-6 py-[15px] max-[720px]:hidden text-sm font-label font-medium text-green-900 hover:brightness-95"
          >
            {nav.cta}
          </Link>
        )}

        <div className="relative nav:hidden">
          <button
            ref={buttonRef}
            type="button"
            aria-label={menuOpen ? labels.closeMenu : nav.menu}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-green-900 text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary"
          >
            <MenuIcon />
          </button>
          <nav
            ref={panelRef}
            id={menuId}
            aria-label={nav.mainLabel}
            hidden={!menuOpen}
            className={dropdownPanel}
          >
            <ul>
              {NAV_ITEMS.map((key) => (
                <li key={key}>
                  <Link
                    href={href(lang, key)}
                    aria-current={key === active ? "page" : undefined}
                    className={`${dropdownLink} flex items-center gap-2 ${key === active ? "bg-cream-100" : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {nav[key]}
                    {key === "shop" && <CoBadge label={nav.shopBadge} />}
                  </Link>
                </li>
              ))}
            </ul>
            {variant === "shop" ? (
              <div className="mt-1 border-t border-line pt-1">
                {cart?.onOpen ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      cart.onOpen?.();
                    }}
                    className={`${dropdownLink} flex w-full items-center gap-2 text-left`}
                  >
                    {cartLabel} ({cart.count})
                  </button>
                ) : (
                  <Link href={cart?.href ?? href(lang, "shop")} className={dropdownLink} onClick={() => setMenuOpen(false)}>
                    {cartLabel} ({cart?.count ?? 0})
                  </Link>
                )}
              </div>
            ) : null}
            <ul className="mt-1 border-t border-line pt-1">
              {languages.map(([code, label]) => (
                <li key={code}>
                  <Link
                    href={href(code, "home")}
                    hrefLang={code}
                    lang={code}
                    aria-current={code === lang ? "true" : undefined}
                    className={dropdownLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <span className="ear ear-bl right-full top-0" />
        <span className="ear ear-bl right-0 top-full" />
      </div>
    </header>
  );
}
