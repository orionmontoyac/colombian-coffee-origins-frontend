import { NextResponse, type NextRequest } from "next/server";
import { toInternalPath, toPublicPath } from "@/lib/routes";

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) {
    // Spanish URLs use localized segments (/es/cafes) but the page folders are
    // English (src/app/[lang]/coffees): rewrite inward, redirect English
    // segments under /es to the localized URL so each page has one address.
    if (!pathname.startsWith("/es")) return;
    const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const internal = toInternalPath(clean);
    if (internal !== clean) {
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
