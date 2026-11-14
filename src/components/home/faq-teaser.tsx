import Link from "next/link";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/section-header";
import { href } from "@/lib/routes";
import type { FaqItem } from "./seo";

/** Indexes into faq.buyers: how to import, minimum order, free samples. */
export const FAQ_TEASER_INDEXES = [0, 1, 3] as const;

export function faqTeaserItems(dict: Dictionary): FaqItem[] {
  return FAQ_TEASER_INDEXES.map((i) => dict.faq.buyers[i]).filter(Boolean);
}

/** Three buyer questions, each linking to the For buyers page, placed before the closing CTA. */
export function FaqTeaser({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.closing.faq;
  const items = faqTeaserItems(dict);
  return (
    <section aria-labelledby="home-faq" className="grid gap-10 px-4 pb-2 pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="flex flex-col items-start gap-7 lg:sticky lg:top-8 lg:self-start">
        <SectionHeader size="xl" id="home-faq" eyebrow={t.eyebrow} title={t.title} accent={t.accent} text={t.text} />
        <Link
          href={href(lang, "forBuyers")}
          className="inline-flex min-h-14 items-center gap-3 rounded-full bg-green-900 px-7 py-4 font-label text-[17px] font-medium text-white hover:bg-green-700"
        >
          {t.cta}
          <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-lime-500 text-[15px] text-green-900">
            →
          </span>
        </Link>
      </div>
      <ul className="border-t border-line" data-testid="home-faq">
        {items.map((item) => (
          <li key={item.q} className="border-b border-line py-6">
            <h3 className="font-display text-2xl font-semibold leading-snug text-green-900">
              <Link href={href(lang, "forBuyers")} className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-lime-500">
                {item.q}
              </Link>
            </h3>
            <p className="mt-2 max-w-[62ch] text-lg leading-normal text-sage">{item.a}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
