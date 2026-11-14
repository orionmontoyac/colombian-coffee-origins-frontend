import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { Faq, Logistics, Pricing, Steps, TrustLevels, fill } from "@/components/buyers/sections";
import { buyersJsonLd, buyersMetadata } from "@/components/buyers/seo";
import { SiteFooter } from "@/components/home/sections";
import { Chip, CtaPanel, SubpageBanner } from "@/components/ui";
import { lots } from "@/data/lots";
import { href } from "@/lib/routes";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/for-buyers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { buyersPage } = await getDictionary();
  return buyersMetadata(lang, buyersPage.meta, cherries.src);
}

export default async function ForBuyersPage({ params }: PageProps<"/[lang]/for-buyers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.buyersPage;
  const faq = dict.faq.buyers;
  const minKg = Math.min(...lots.map((l) => l.minOrderKg));
  const jsonLd = buyersJsonLd(lang, { homeLabel: t.breadcrumb.home, pageLabel: t.breadcrumb.current, faq });

  return (
    <div className="min-h-screen p-page-margin">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SubpageBanner
        lang={lang}
        nav={dict.nav}
        line="green"
        breadcrumb={[{ label: t.breadcrumb.home, href: href(lang, "home") }, { label: t.breadcrumb.current }]}
        chips={t.banner.chips.map((label, i) => (
          <Chip key={label} tone={i === 0 ? "lime" : "white"} className={i === 0 ? undefined : "!bg-neutral/12 !text-on-primary"}>
            {label}
          </Chip>
        ))}
        title={t.banner.title}
        accent={t.banner.accent}
        description={t.banner.description}
        stats={[
          { label: t.banner.lotsLabel, value: String(lots.length), accent: true },
          { label: t.banner.minLabel, value: fill(t.banner.minValue, { kg: minKg }) },
          { label: t.banner.sampleLabel, value: fill(t.banner.sampleValue, { g: 200 }) },
        ]}
      />
      <main id="main">
        <Steps t={t.steps} />
        <TrustLevels t={t.trust} />
        <Pricing t={t.pricing} lang={lang} lots={lots} />
        <Logistics t={t.logistics} />
        <Faq t={t.faq} items={faq} />
        <CtaPanel
          eyebrow={t.cta.eyebrow}
          title={t.cta.title}
          accent={t.cta.accent}
          text={t.cta.text}
          image={cherries}
          primary={{ label: t.cta.primary, href: href(lang, "samples") }}
          secondary={{ label: t.cta.secondary, href: href(lang, "contact") }}
        />
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
