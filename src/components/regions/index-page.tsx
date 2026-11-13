import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import urraoSquare from "@/assets/home/urrao-main-square.jpg";
import { SiteFooter } from "@/components/home/sections";
import { Chip, CtaPanel, SectionHeader, SubpageBanner } from "@/components/ui";
import { href } from "@/lib/routes";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";

/** /regions: banner, Urrao live card, four "coming soon" regions, CTA. */
export function RegionsIndex({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.regionsPage;
  const l = t.index.list;
  const [live, ...coming] = l.items;
  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[{ label: dict.nav.home, href: href(lang, "home") }, { label: t.breadcrumb.regions }]}
        chips={t.index.banner.chips.map((c, i) => (
          <Chip key={c} tone={i === 0 ? "lime" : "white"}>{c}</Chip>
        ))}
        title={t.index.banner.title}
        accent={t.index.banner.accent}
        description={t.index.banner.description}
        stats={[
          { label: t.index.banner.stats.live, value: t.index.banner.liveValue, accent: true },
          { label: t.index.banner.stats.coming, value: t.index.banner.comingValue },
          { label: t.index.banner.stats.altitude, value: t.index.banner.altitudeValue },
        ]}
      />
      <main id="main">
        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={l.title} accent={l.accent} text={l.text} />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <article className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-notch bg-primary text-on-primary">
              <Image src={urraoSquare} alt={l.photoAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              <div aria-hidden="true" className="cta-fade absolute inset-0" />
              <div className="relative flex flex-col gap-3 p-8">
                <Chip tone="lime" className="self-start">{l.live}</Chip>
                <h3 className="font-display text-headline-lg">
                  {live.name}, <span className="font-normal italic">{live.area}</span>
                </h3>
                <p className="max-w-[48ch] text-body-lg text-on-primary-body">{live.text}</p>
                <Link
                  href={href(lang, "urrao")}
                  className="mt-2 inline-flex min-h-[52px] items-center gap-2 self-start rounded-full bg-accent px-6 font-label text-label-md text-on-accent hover:bg-accent-hover"
                >
                  {l.explore} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {coming.map((r) => (
                <li key={r.id} className="flex flex-col gap-2 rounded-lg bg-surface p-xl">
                  <Chip className="self-start">{l.comingSoon}</Chip>
                  <h3 className="font-display text-headline-md text-primary">{r.name}</h3>
                  <p className="text-body-sm text-muted">{r.area}</p>
                  <p className="text-body-md text-body">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <CtaPanel
          eyebrow={t.index.cta.eyebrow}
          title={t.index.cta.title}
          accent={t.index.cta.accent}
          text={t.index.cta.text}
          image={cherries}
          primary={{ label: t.index.cta.primary, href: href(lang, "contact") }}
          secondary={{ label: t.index.cta.secondary, href: href(lang, "forBuyers") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
