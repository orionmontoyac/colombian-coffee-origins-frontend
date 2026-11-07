import type { Metadata } from "next";
import { Inter, Instrument_Sans, Raleway } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary, hasLocale, locales } from "./dictionaries";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
// Only used for the giant hero word
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: "800",
  style: "italic",
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
      className={`${inter.variable} ${instrumentSans.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
