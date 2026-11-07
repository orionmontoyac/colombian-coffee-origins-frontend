import { NextResponse, type NextRequest } from "next/server";

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
  if (hasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals and files with an extension (images, favicon, etc.)
  matcher: ["/((?!_next|.*\\..*).*)"],
};
