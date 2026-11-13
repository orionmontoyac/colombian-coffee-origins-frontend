import type { Metadata } from "next";
import { notFound } from "next/navigation";
import cherries from "@/assets/home/lot-chiroso-cherries.jpg";
import { ContactForm } from "@/components/forms/contact-form";
import { FormLayout, FormPageFrame } from "@/components/forms/page-frame";
import { formJsonLd, formMetadata } from "@/components/forms/seo";
import { OnlyInCountry } from "@/components/only-in-country";
import { SectionHeader, WhatsAppButton } from "@/components/ui";
import { href } from "@/lib/routes";
import { site } from "@/lib/site";
import { getDictionary, hasLocale } from "../dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { forms } = await getDictionary();
  return formMetadata(lang, "contact", forms.contact.meta, cherries.src);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  const t = dict.forms.contact;
  const c = site.contact;
  const jsonLd = formJsonLd(lang, [
    { label: t.breadcrumb.home, path: href(lang, "home") },
    { label: t.breadcrumb.current, path: href(lang, "contact") },
  ]);
  const link = "text-primary underline underline-offset-4 hover:text-primary-hover";

  return (
    <FormPageFrame
      lang={lang}
      dict={dict}
      jsonLd={jsonLd}
      breadcrumb={[{ label: t.breadcrumb.home, href: href(lang, "home") }, { label: t.breadcrumb.current }]}
      banner={t.banner}
      stats={[
        { label: t.banner.langLabel, value: t.banner.langValue },
        { label: t.banner.baseLabel, value: t.banner.baseValue },
        { label: t.banner.channelLabel, value: t.banner.channelValue, accent: true },
      ]}
    >
      <FormLayout
        aside={
          <>
            <SectionHeader title={t.channels.title} accent={t.channels.accent} text={t.channels.text} />
            <dl className="mt-8 grid gap-6 border-t border-line pt-6">
              <div>
                <dt className="font-display text-headline-sm text-primary">{t.channels.whatsappTitle}</dt>
                <dd className="mt-1.5 text-body-md text-body">
                  <span className="tabular-nums">{c.whatsappDisplay}</span>
                  <WhatsAppButton
                    number={c.whatsappNumber}
                    message={t.channels.whatsappMessage}
                    label={t.channels.whatsappLabel}
                    className="mt-3 flex w-fit"
                  />
                </dd>
              </div>
              <div>
                <dt className="font-display text-headline-sm text-primary">{t.channels.emailTitle}</dt>
                <dd className="mt-1.5 text-body-md text-body">
                  <a className={link} href={`mailto:${c.email}`}>
                    {c.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-display text-headline-sm text-primary">{t.channels.addressTitle}</dt>
                <dd className="mt-1.5 text-body-md text-body">{t.channels.address}</dd>
              </div>
              <OnlyInCountry country="CO">
                <div>
                  <dt className="font-display text-headline-sm text-primary">{t.channels.pqrsTitle}</dt>
                  <dd className="mt-1.5 max-w-[48ch] text-body-md text-body">
                    {t.channels.pqrsText}{" "}
                    <a className={link} href={`mailto:${c.pqrsEmail}`}>
                      {c.pqrsEmail}
                    </a>
                  </dd>
                </div>
              </OnlyInCountry>
            </dl>
          </>
        }
      >
        <ContactForm lang={lang} dict={dict} />
      </FormLayout>
    </FormPageFrame>
  );
}
