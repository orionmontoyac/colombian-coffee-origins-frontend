import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteHeader, type NavKey } from "@/components/home/site-header";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { cx } from "./cx";
import { uiLabels } from "./labels";
import { StatBox } from "./stat-box";

export type BannerStat = { label: string; value: string; accent?: boolean };

export type SubpageBannerProps = {
  lang: Locale;
  nav: Dictionary["nav"];
  /** Which menu item is active in the header */
  active?: NavKey;
  /** "green" = platform banner; "roasted" = shop banner (dark roast, caramel accent, bean pattern) */
  line: "green" | "roasted";
  breadcrumb: BreadcrumbItem[];
  /** Detail pages: button on the right of the breadcrumb row ("All lots") */
  backLink?: { label: string; href: string };
  /** Chips above the title (Chip or TrustBadge elements) */
  chips?: ReactNode;
  title: string;
  /** The one italic accent phrase, rendered after the title */
  accent: string;
  description: string;
  /** Exactly three stats */
  stats: readonly [BannerStat, BannerStat, BannerStat];
  /** Shop pages: cart button in the header */
  cart?: { count: number; label?: string; onOpen?: () => void; href?: string };
};

/**
 * The identical banner on every sub-page: notched header, breadcrumb row, then chips, the
 * 64px H1 with one italic accent and one description line on the left, and exactly three
 * stat boxes aligned to the bottom on the right. Renders the page's only `<h1>`.
 */
export function SubpageBanner({
  lang,
  nav,
  active,
  line,
  breadcrumb,
  backLink,
  chips,
  title,
  accent,
  description,
  stats,
  cart,
}: SubpageBannerProps) {
  const roasted = line === "roasted";
  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-xl px-4 pb-8 pt-[84px] text-on-primary sm:px-8 lg:px-panel-padding lg:pb-10",
        roasted ? "bg-roast-dark" : "hero-banner",
      )}
    >
      {roasted ? (
        <Image
          src="/images/beans-caramel.png"
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          sizes="640px"
          className="pointer-events-none absolute -right-24 -top-20 w-[640px] max-w-none opacity-20"
        />
      ) : null}
      <SiteHeader lang={lang} nav={nav} active={active} variant={roasted ? "shop" : "default"} cart={cart} />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs items={breadcrumb} label={uiLabels[lang].breadcrumb} tone="dark" />
          {backLink ? (
            <Link
              href={backLink.href}
              className="inline-flex min-h-tap-target items-center gap-2 rounded-full bg-primary-raised px-4 font-label text-label-md text-on-primary hover:bg-primary-hover"
            >
              <span aria-hidden="true">←</span> {backLink.label}
            </Link>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0">
            {chips ? <div className="mb-4 flex flex-wrap items-center gap-2">{chips}</div> : null}
            <h1 className="font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-headline-xl">
              {title}{" "}
              <span className={cx("font-normal italic", roasted ? "text-caramel" : "text-accent")}>{accent}</span>
            </h1>
            <p
              className={cx(
                "mt-4 max-w-[640px] text-body-lg",
                roasted ? "text-on-roast-body" : "text-on-primary-body",
              )}
            >
              {description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 lg:flex-none">
            {stats.map((stat) => (
              <StatBox key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} className="min-w-0 lg:min-w-[132px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
