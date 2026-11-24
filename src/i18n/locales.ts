export const locales = ["de", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale = "de" satisfies Locale

type LocaleMeta = {
  bcp47: string
  ogLocale: string
  prefix: string
  llmsPath: string
}

export const localeMeta = {
  de: { bcp47: "de-AT", ogLocale: "de_AT", prefix: "", llmsPath: "/llms.txt" },
  en: { bcp47: "en", ogLocale: "en_US", prefix: "/en", llmsPath: "/en/llms.txt" },
} satisfies Record<Locale, LocaleMeta>

export const languages = {
  de: "Deutsch",
  en: "English",
} satisfies Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
