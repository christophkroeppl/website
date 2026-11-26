import { defaultLocale, locales, type Locale } from "virtual:astro-localized-routes"

export { defaultLocale, locales, type Locale }

type LocaleMeta = {
  bcp47: string
  ogLocale: string
}

export const localeMeta = {
  de: { bcp47: "de-AT", ogLocale: "de_AT" },
  en: { bcp47: "en", ogLocale: "en_US" },
} satisfies Record<Locale, LocaleMeta>

export function localePrefix(lang: Locale): string {
  return lang === defaultLocale ? "" : `/${lang}`
}

export function llmsPath(lang: Locale): string {
  return `${localePrefix(lang)}/llms.txt`
}

export const languages = {
  de: "Deutsch",
  en: "English",
} satisfies Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
