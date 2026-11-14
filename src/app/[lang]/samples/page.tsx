import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { FormLayout, FormPageFrame } from "@/components/forms/page-frame";
import { formJsonLd, formMetadata } from "@/components/forms/seo";
import { SamplesForm } from "@/components/forms/samples-form";
import { SectionHeader, WhatsAppButton } from "@/components/ui";
import { lots } from "@/data/lots";
import { stateFromSearch } from "@/lib/actions/query";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { getDictionary, hasLocale } from "../dictionaries";

// The result (`?sent=1` / `?error=`) has to be in the first HTML. A streamed hole is invisible without JS.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/samples">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { forms } = await getDictionary();
  return formMetadata(lang, "samples", forms.samples.meta, cherries.src);
}

export default async function SamplesPage({ params, searchParams }: PageProps<"/[lang]/samples">) {
  const { lang } = await params;
  const initial = stateFromSearch(await searchParams);
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.forms.samples;
  const jsonLd = formJsonLd(lang, [
    { label: t.breadcrumb.home, path: href(lang, "home") },
    { label: t.breadcrumb.current, path: href(lang, "samples") },
  ]);

  return (
    <FormPageFrame
      lang={lang}
      dict={dict}
      jsonLd={jsonLd}
      active="coffees"
      breadcrumb={[{ label: t.breadcrumb.home, href: href(lang, "home") }, { label: t.breadcrumb.current }]}
      banner={t.banner}
      stats={[
        { label: t.banner.sizeLabel, value: t.banner.sizeValue, accent: true },
        { label: t.banner.lotsLabel, value: String(lots.filter((l) => l.sampleAvailable).length) },
        { label: t.banner.costLabel, value: t.banner.costValue },
      ]}
    >
      <FormLayout
        aside={
          <>
            <SectionHeader title={t.aside.title} accent={t.aside.accent} text={t.aside.text} />
            <ol className="mt-8 border-t border-line">
              {t.aside.steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[40px_1fr] gap-x-3 border-b border-line py-5">
                  <span aria-hidden="true" className="font-display text-[36px] font-semibold leading-none text-success">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-headline-sm text-primary">{step.title}</h3>
                    <p className="mt-1.5 max-w-[48ch] text-body-md text-body">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-body-md text-body">{t.aside.orWhatsApp}</p>
            <WhatsAppButton
              number={site.contact.whatsappNumber}
              message={t.aside.whatsappMessage}
              label={t.aside.whatsappLabel}
              className="mt-3"
            />
          </>
        }
      >
        <SamplesForm lang={lang} dict={dict} initial={initial} />
      </FormLayout>
    </FormPageFrame>
  );
}
