import type { ReactNode } from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { Chip, SubpageBanner, type BannerStat, type BreadcrumbItem } from "@/components/ui";
import type { NavKey } from "@/components/home/site-header";

/** Shared shell of the three form pages: JSON-LD, sub-page banner, `<main id="main">`, footer. */
export function FormPageFrame({
  lang,
  dict,
  jsonLd,
  active,
  breadcrumb,
  banner,
  stats,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  jsonLd: unknown;
  active?: NavKey;
  breadcrumb: BreadcrumbItem[];
  banner: { chips: readonly string[]; title: string; accent: string; description: string };
  stats: readonly [BannerStat, BannerStat, BannerStat];
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen p-page-margin">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active={active}
        line="green"
        breadcrumb={breadcrumb}
        chips={banner.chips.map((label, i) => (
          <Chip key={label} tone={i === 0 ? "lime" : "white"} className={i === 0 ? undefined : "!bg-neutral/12 !text-on-primary"}>
            {label}
          </Chip>
        ))}
        title={banner.title}
        accent={banner.accent}
        description={banner.description}
        stats={stats}
      />
      <main id="main">{children}</main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}

/** Two columns: explanation on the left, the form on a parchment panel on the right. */
export function FormLayout({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-section-gap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="lg:sticky lg:top-8 lg:self-start">{aside}</div>
      <div className="rounded-xl bg-surface px-5 py-8 sm:px-10 sm:py-10">{children}</div>
    </section>
  );
}
