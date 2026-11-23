import type { Locale } from "../i18n/locales"

export type Bilingual = Record<Locale, string>

export function pick(lang: Locale, value: Bilingual): string {
  return value[lang]
}
