import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type en from "./dictionaries/en.json";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof en;
export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (): Promise<Dictionary> => {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
};
