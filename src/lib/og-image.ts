import type { Locale } from "../i18n/locales"

export const ogImagePaths: Record<Locale, string> = {
  de: "/og.png",
  en: "/og-en.png",
}

export function ogImagePath(lang: Locale): string {
  return ogImagePaths[lang]
}
