import type { Metadata } from "next";
import Link from "next/link";
import { lang as getLang } from "next/root-params";
import { SiteFooter } from "@/components/home/sections";
import { SiteHeader } from "@/components/home/site-header";
import { href, type RouteKey } from "@/lib/routes";
import { getDictionary, hasLocale } from "./dictionaries";

const TARGETS: Record<string, RouteKey> = { lots: "coffees", shop: "shop", home: "home" };

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.notFound.meta.title, robots: { index: false, follow: true } };
}

/** Branded 404: green banner with the page-not-found message and three ways back to the coffee. */
export default async function NotFound() {
  const current = await getLang();
  const lang = typeof current === "string" && hasLocale(current) ? current : "en";
  const dict = await getDictionary();
  const t = dict.notFound;
  return (
    <div className="min-h-screen p-page-margin">
      <section className="hero-banner relative overflow-hidden rounded-xl px-4 pb-12 pt-[84px] text-on-primary sm:px-8 lg:px-panel-padding lg:pb-16">
        <SiteHeader lang={lang} nav={dict.nav} />
        <div className="relative mt-12 max-w-[760px]">
          <p aria-hidden="true" className="font-display text-[96px] font-semibold leading-[0.9] tracking-[-0.03em] text-accent sm:text-[160px]">
            {t.code}
          </p>
          <h1 className="mt-4 font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-headline-xl">
            {t.title} <span className="font-normal italic text-accent">{t.accent}</span>
          </h1>
          <p className="mt-4 max-w-[640px] text-body-lg text-on-primary-body">{t.description}</p>
        </div>
      </section>
      <main id="main" className="px-4 pt-10">
        <ul className="grid gap-4 md:grid-cols-3">
          {t.links.map((l) => (
            <li key={l.key}>
              <Link
                href={href(lang, TARGETS[l.key])}
                className="flex h-full flex-col gap-2 rounded-lg bg-surface p-xl transition-colors hover:bg-surface-sunken"
              >
                <span className="font-display text-headline-md text-primary">{l.title}</span>
                <span className="text-body-md text-body">{l.text}</span>
                <span className="mt-auto pt-2 font-label text-label-md text-primary">
                  {t.open} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </div>
  );
}
