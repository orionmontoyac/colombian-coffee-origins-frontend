import Image from "next/image";
import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import farmers from "@/assets/home/farmers-harvest.jpg";
import { SiteFooter } from "@/components/home/sections";
import { Chip, CtaPanel, PlaceholderImage, SectionHeader, SubpageBanner } from "@/components/ui";
import { producers } from "@/data/producers";
import { href } from "@/lib/routes";

/** /our-story: why we exist, how we work with producers, team placeholder. */
export function StoryPage({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.storyPage;
  return (
    <div className="min-h-screen p-page-margin">
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        active="ourStory"
        line="green"
        breadcrumb={[{ label: dict.nav.home, href: href(lang, "home") }, { label: t.breadcrumb }]}
        chips={t.banner.chips.map((c, i) => (
          <Chip key={c} tone={i === 0 ? "lime" : "white"}>{c}</Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.stats.origin, value: t.banner.originValue, accent: true },
          { label: t.banner.stats.lines, value: t.banner.linesValue },
          { label: t.banner.stats.producers, value: String(producers.length) },
        ]}
      />
      <main id="main">
        <section className="grid items-center gap-10 px-4 pb-2 pt-14 lg:grid-cols-2">
          <div>
            <SectionHeader title={t.why.title} accent={t.why.accent} />
            <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-body-lg text-body">
              {t.why.paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-notch">
            <Image src={farmers} alt={t.why.photoAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.how.title} accent={t.how.accent} text={t.how.text} />
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {t.how.items.map((item) => (
              <li key={item.title} className="rounded-lg bg-surface p-xl">
                <h3 className="font-display text-headline-md text-primary">{item.title}</h3>
                <p className="mt-2 max-w-[48ch] text-body-md text-body">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            <Link href={href(lang, "forBuyers")} className="inline-flex min-h-tap-target items-center gap-2 font-label text-label-md text-primary underline underline-offset-4">
              {t.how.linesLink} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </section>

        <section className="px-4 pb-2 pt-14">
          <SectionHeader title={t.team.title} accent={t.team.accent} text={t.team.text} />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: t.team.count }, (_, i) => (
              <li key={i} className="flex flex-col gap-3 rounded-lg bg-surface p-4">
                <PlaceholderImage assetId="team-portraits" label={t.team.photoLabel} ratio="4 / 5" className="[&_span]:text-ink" />
                <p className="font-display text-headline-sm text-primary">{t.team.nameLabel}</p>
                <p className="text-body-sm text-muted">{t.team.roleLabel}</p>
                <p className="text-body-md text-body">{t.team.bioLabel}</p>
              </li>
            ))}
          </ul>
        </section>

        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={t.cta.accent}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "producers") }}
          secondary={{ label: t.cta.secondary, href: href(lang, "contact") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
