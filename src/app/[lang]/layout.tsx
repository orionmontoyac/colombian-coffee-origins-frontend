import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { site } from "@/lib/site";
import { getDictionary, hasLocale, locales } from "./dictionaries";

// Origin Ledger type: Vollkorn for headings and numbers, Fira Sans for body,
// Ubuntu for labels (buttons, chips, nav, eyebrows). Files live in src/fonts.
const vollkorn = localFont({
  variable: "--font-vollkorn",
  src: [
    { path: "../../fonts/vollkorn/Vollkorn-Variable.woff2", weight: "400 900", style: "normal" },
    { path: "../../fonts/vollkorn/Vollkorn-Italic-Variable.woff2", weight: "400 900", style: "italic" },
  ],
});
const firaSans = localFont({
  variable: "--font-fira-sans",
  preload: false,
  // Not preloaded (home LCP) and optional so the late swap never shifts layout (CLS); see DECISIONS.md 2026-11-14
  display: "optional",
  src: [
    { path: "../../fonts/fira-sans/FiraSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/fira-sans/FiraSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/fira-sans/FiraSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/fira-sans/FiraSans-SemiBold.woff2", weight: "600", style: "normal" },
  ],
});
const ubuntu = localFont({
  variable: "--font-ubuntu",
  preload: false,
  display: "optional",
  src: [
    { path: "../../fonts/ubuntu/Ubuntu-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/ubuntu/Ubuntu-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary();
  return { metadataBase: new URL(site.baseUrl), title: dict.meta.title, description: dict.meta.description };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${vollkorn.variable} ${firaSans.variable} ${ubuntu.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            __html: "setTimeout(function(){document.documentElement.classList.add('fonts-on')},400)",
          }}
        />
        {children}
      </body>
    </html>
  );
}
