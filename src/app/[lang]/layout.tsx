import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";

// Origin Ledger type: Vollkorn for headings and numbers, Fira Sans for body,
// Ubuntu for labels (buttons, chips, nav, eyebrows). Files live in src/fonts.
const vollkorn = localFont({
  variable: "--font-vollkorn",
  src: [
    { path: "../../fonts/vollkorn/Vollkorn-VariableFont_wght.ttf", weight: "400 900", style: "normal" },
    { path: "../../fonts/vollkorn/Vollkorn-Italic-VariableFont_wght.ttf", weight: "400 900", style: "italic" },
  ],
});
const firaSans = localFont({
  variable: "--font-fira-sans",
  src: [
    { path: "../../fonts/fira-sans/FiraSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/fira-sans/FiraSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../fonts/fira-sans/FiraSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/fira-sans/FiraSans-SemiBold.ttf", weight: "600", style: "normal" },
  ],
});
const ubuntu = localFont({
  variable: "--font-ubuntu",
  src: [
    { path: "../../fonts/ubuntu/Ubuntu-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/ubuntu/Ubuntu-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/ubuntu/Ubuntu-Bold.ttf", weight: "700", style: "normal" },
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
  return { title: dict.meta.title, description: dict.meta.description };
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
