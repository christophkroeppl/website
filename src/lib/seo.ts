import { defaultLocale, localeMeta, locales, type Locale } from "../i18n/locales"
import { person } from "../content/site"

export const siteUrl = "https://kroeppl.ch"

export function inLanguage(lang: Locale): string {
  return localeMeta[lang].bcp47
}

export function ogLocale(lang: Locale): string {
  return localeMeta[lang].ogLocale
}

export function otherLocale(lang: Locale): Locale {
  return locales.find((candidate) => candidate !== lang) ?? defaultLocale
}

export function formatPageTitle(title: string): string {
  return title === person.name ? title : `${title} — ${person.name}`
}
