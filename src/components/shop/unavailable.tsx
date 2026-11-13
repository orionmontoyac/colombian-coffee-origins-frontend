import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SiteFooter } from "@/components/home/sections";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { SubpageBanner } from "@/components/ui/subpage-banner";
import { href } from "@/lib/routes";
import { breadcrumbLd, JsonLd, organizationLd, websiteLd } from "./seo";

/**
 * What visitors outside Colombia see on every /shop URL: a friendly notice (HTTP 200, noindex)
 * that points to green coffee. It belongs to the green line, so it uses the green banner.
 */
export function ShopUnavailable({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const n = dict.shopPage.notice;
  const home = { label: dict.shopPage.breadcrumbHome, href: href(lang, "home") };
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            websiteLd(lang),
            breadcrumbLd([
              { name: home.label, path: home.href },
              { name: n.breadcrumbShop },
            ]),
          ],
        }}
      />
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="shop"
        line="green"
        breadcrumb={[home, { label: n.breadcrumbShop }]}
        chips={
          <>
            <Chip tone="co">{n.chips.only}</Chip>
            <Chip tone="white">{n.chips.green}</Chip>
          </>
        }
        title={n.title}
        accent={n.accent}
        description={n.description}
        stats={[
          { label: n.stats.roasted.label, value: n.stats.roasted.value },
          { label: n.stats.green.label, value: n.stats.green.value },
          { label: n.stats.sample.label, value: n.stats.sample.value, accent: true },
        ]}
      />
      <main id="main" data-shop-unavailable>
        <section className="rounded-xl bg-surface px-6 py-12 sm:px-12 mt-2">
          <SectionHeader title={n.panelTitle} accent={n.panelAccent} text={n.panelText} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={href(lang, "coffees")} variant="primary" size="lg">
              {n.cta}
            </Button>
            <Button href={href(lang, "samples")} variant="secondary" size="lg">
              {n.secondary}
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </>
  );
}
