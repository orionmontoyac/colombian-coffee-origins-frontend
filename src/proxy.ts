import { NextResponse, type NextRequest } from "next/server";
import { toInternalPath, toPublicPath } from "@/lib/routes";
import { isJournalSlug } from "@/lib/journal-slugs";
import { getLot } from "@/data/lots";
import { getProducer } from "@/data/producers";
import { getProduct } from "@/data/products";

const locales = ["en", "es"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().split(";")[0].slice(0, 2).toLowerCase();
    if (locales.includes(code)) return code;
  }
  return defaultLocale;
}

/**
 * partialPrefetching serves 200 + noindex on the first hit of an unknown dynamic slug, so the
 * proxy checks the data helpers and answers 404 itself. `internal` is the English-folder path.
 */
function isUnknownDetail(internal: string): boolean {
  const [, , section, slug, ...more] = internal.split("/");
  if (!slug) return false;
  if (section === "journal") {
    const lang = internal.split("/")[1] as "en" | "es";
    return more.length > 0 || !isJournalSlug(lang, slug);
  }
  if (section !== "coffees" && section !== "producers" && section !== "shop") return false;
  if (section === "shop" && slug === "sell") return false;
  if (more.length > 0) return true;
  const known = section === "coffees" ? getLot(slug) : section === "producers" ? getProducer(slug) : getProduct(slug);
  return !known;
}

function notFound(request: NextRequest, internal: string) {
  const lang = internal.split("/")[1];
  request.nextUrl.pathname = `/${lang}/page-not-found`;
  return NextResponse.rewrite(request.nextUrl, { status: 404 });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) {
    // Spanish URLs use localized segments (/es/cafes) but the page folders are
    // English (src/app/[lang]/coffees): rewrite inward, redirect English
    // segments under /es to the localized URL so each page has one address.
    if (!pathname.startsWith("/es")) {
      const enClean = pathname.replace(/\/$/, "");
      return isUnknownDetail(enClean) ? notFound(request, enClean) : undefined;
    }
    const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const internal = toInternalPath(clean);
    if (internal !== clean) {
      if (isUnknownDetail(internal)) return notFound(request, internal);
      request.nextUrl.pathname = internal;
      return NextResponse.rewrite(request.nextUrl);
    }
    const publicPath = toPublicPath(clean);
    if (publicPath !== clean) {
      request.nextUrl.pathname = publicPath;
      return NextResponse.redirect(request.nextUrl, 308);
    }
    return;
  }

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals and files with an extension (images, favicon, etc.)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
