import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { FormLayout, FormPageFrame } from "@/components/forms/page-frame";
import { formJsonLd, formMetadata } from "@/components/forms/seo";
import { SellForm } from "@/components/forms/sell-form";
import { Ways } from "@/components/forms/sell-sections";
import { SectionHeader } from "@/components/ui";
import { lots } from "@/data/lots";
import { href } from "@/lib/routes";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/shop/sell">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { forms } = await getDictionary();
  return formMetadata(lang, "sellWithUs", forms.sell.meta, cherries.src);
}

export default async function SellPage({ params }: PageProps<"/[lang]/shop/sell">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.forms.sell;
  const jsonLd = formJsonLd(lang, [
    { label: t.breadcrumb.home, path: href(lang, "home") },
    { label: t.breadcrumb.shop, path: href(lang, "shop") },
    { label: t.breadcrumb.current, path: href(lang, "sellWithUs") },
  ]);

  return (
    <FormPageFrame
      lang={lang}
      dict={dict}
      jsonLd={jsonLd}
      active="producers"
      breadcrumb={[
        { label: t.breadcrumb.home, href: href(lang, "home") },
        { label: t.breadcrumb.shop, href: href(lang, "shop") },
        { label: t.breadcrumb.current },
      ]}
      banner={t.banner}
      stats={[
        { label: t.banner.waysLabel, value: t.banner.waysValue, accent: true },
        { label: t.banner.lotsLabel, value: String(lots.length) },
        { label: t.banner.levelsLabel, value: t.banner.levelsValue },
      ]}
    >
      <Ways t={t.ways} />
      <FormLayout
        aside={
          <SectionHeader title={t.requirements.title} accent={t.requirements.accent} text={t.requirements.text} />
        }
      >
        <ul className="mb-10 border-t border-line">
          {t.requirements.items.map((item) => (
            <li key={item.title} className="border-b border-line py-4">
              <h3 className="font-display text-headline-sm text-primary">{item.title}</h3>
              <p className="mt-1.5 max-w-[56ch] text-body-md text-body">{item.text}</p>
            </li>
          ))}
        </ul>
        <div id="apply" className="scroll-mt-8">
          <SellForm lang={lang} dict={dict} />
        </div>
      </FormLayout>
    </FormPageFrame>
  );
}
