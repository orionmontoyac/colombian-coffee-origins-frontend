import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";
import { href, lotHref, type RouteKey } from "@/lib/routes";
import { articleHref } from "./articles";
import type { ArticleId } from "./types";

const ROUTES: Record<string, RouteKey> = {
  lots: "coffees",
  producers: "producers",
  urrao: "urrao",
  buyers: "forBuyers",
  samples: "samples",
  regions: "regions",
  story: "ourStory",
  journal: "journal",
};

export function resolveTarget(lang: Locale, target: string): string {
  if (target.startsWith("lot:")) return lotHref(lang, target.slice(4));
  if (target.startsWith("article:")) return articleHref(lang, target.slice(8) as ArticleId);
  const key = ROUTES[target];
  if (!key) throw new Error(`Unknown link target "${target}"`);
  return href(lang, key);
}

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Plain text of a paragraph with link markup removed (word counts, JSON-LD). */
export const stripLinks = (text: string) => text.replace(LINK, "$1");

/** Renders "[text](target)" markup as internal links. */
export function RichText({ lang, text }: { lang: Locale; text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={m.index} href={resolveTarget(lang, m[2])} className="font-medium text-primary underline decoration-line decoration-2 underline-offset-4 hover:decoration-primary">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
